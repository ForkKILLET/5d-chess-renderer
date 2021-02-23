const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');

class Piece {
  constructor(emitter, pieceObject = null) {
    this.layer = layerFuncs.layers.pieces;
    this.emitter = emitter;
    this.pieceObject = {};
    if(pieceObject !== null) {
      this.update(pieceObject);
    }
  }
  refresh() {
    this.destroy();
    this.update(this.pieceObject);
  }
  update(pieceObject) {
    //Assign pieceObj to instance variables
    this.pieceObject = pieceObject;
    //Change empty string to P for easier sprite texture loading
    if(this.pieceObject.piece === '') { this.pieceObject.piece = 'P'; }
    
    var coordinates = positionFuncs.toCoordinates(this.pieceObject.position);
    //Load and animate sprite if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      this.key = `${this.pieceObject.player}${this.pieceObject.piece}_${this.pieceObject.position.timeline}_${this.pieceObject.position.player}${this.pieceObject.position.turn}_${this.pieceObject.position.coordinate}_${this.pieceObject.hasMoved}`;
      this.squareKey = `${this.pieceObject.position.timeline}_${this.pieceObject.position.player}${this.pieceObject.position.turn}_${this.pieceObject.position.coordinate}`;
      this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[`${this.pieceObject.player}${this.pieceObject.piece}`]);
      this.sprite.width = config.get('squareWidth');
      this.sprite.height = config.get('squareHeight');
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.square.center.x;
      this.sprite.y = this.coordinates.square.center.y;
      if(config.get('pieceRoundPixel')) {
        this.sprite.roundPixels = true;
      }
      this.layer.addChild(this.sprite);
      //Add interaction if needed
      this.interact();
  
      //Initialize animation
      this.fadeIn();
    }
  }
  interact() {
    //Add interactive events
    if(config.get('pieceEvents')) {
      this.sprite.interactive = true;
      this.sprite.hitArea = new PIXI.Rectangle(
        -this.coordinates.square.width / 2,
        -this.coordinates.square.height / 2,
        this.coordinates.square.width,
        this.coordinates.square.height
      );
      this.sprite.on('pointertap', (event) => {
        this.emitter.emit('pieceTap', {
          key: this.key,
          pieceObject: this.pieceObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.sprite.on('pointerover', (event) => {
        this.emitter.emit('pieceOver', {
          key: this.key,
          pieceObject: this.pieceObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.sprite.on('pointerout', (event) => {
        this.emitter.emit('pieceOut', {
          key: this.key,
          pieceObject: this.pieceObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
    }
    if(config.get('squareEvents')) {
      this.sprite.interactive = true;
      this.sprite.on('pointertap', (event) => {
        this.emitter.emit('squareTap', {
          key: this.squareKey,
          squareObject: this.pieceObject.position,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.sprite.on('pointerover', (event) => {
        this.emitter.emit('squareOver', {
          key: this.squareKey,
          squareObject: this.pieceObject.position,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.sprite.on('pointerout', (event) => {
        this.emitter.emit('squareOut', {
          key: this.squareKey,
          squareObject: this.pieceObject.position,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
    }
  }
  fadeIn() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.fadeDelay = config.get('timelineRippleDuration') * Math.abs(this.pieceObject.position.timeline);
    this.fadeDelay += config.get('turnRippleDuration') * ((this.pieceObject.position.turn * 2 )+ (this.pieceObject.position.player === 'white' ? 0 : 1));
    this.fadeDelay += config.get('rankRippleDuration') * this.pieceObject.position.rank;
    this.fadeDelay += config.get('fileRippleDuration') * this.pieceObject.position.file;
    this.fadeLeft = config.get('pieceFadeDuration');
    this.fadeDuration = this.fadeLeft;
    PIXI.Ticker.shared.add(this.fadeInAnimate, this);
  }
  fadeInAnimate(delta) {
    //Animate fading in
    if(this.fadeDelay > 0) {
      this.fadeDelay -= (delta / 60) * 1000;
      if(this.fadeDelay < 0) {
        this.fadeDelay = 0;
      }
    }
    else if(this.sprite && this.sprite.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.sprite.alpha = 1;
        this.sprite.width = config.get('squareWidth');
        this.sprite.height = config.get('squareHeight');
        PIXI.Ticker.shared.remove(this.fadeInAnimate, this);
      }
      else {
        this.sprite.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        this.sprite.width = this.sprite.alpha * config.get('squareWidth');
        this.sprite.height = this.sprite.alpha * config.get('squareHeight');
      }
    }
  }
  destroy() {
    this.coordinates = undefined;
    this.tmpSprite = this.sprite;
    this.sprite = undefined;
    this.fadeDelay = config.get('timelineRippleDuration') * Math.abs(this.pieceObject.position.timeline);
    this.fadeDelay += config.get('turnRippleDuration') * ((this.pieceObject.position.turn * 2 )+ (this.pieceObject.position.player === 'white' ? 0 : 1));
    this.fadeDelay += config.get('rankRippleDuration') * this.pieceObject.position.rank;
    this.fadeDelay += config.get('fileRippleDuration') * this.pieceObject.position.file;
    this.fadeLeft = config.get('pieceFadeDuration');
    this.fadeDuration = this.fadeLeft;
    PIXI.Ticker.shared.add(this.fadeOutAnimate, this);
  }
  fadeOutAnimate(delta) {
    //Animate fading out
    if(this.fadeDelay > 0) {
      this.fadeDelay -= (delta / 60) * 1000;
      if(this.fadeDelay < 0) {
        this.fadeDelay = 0;
      }
    }
    else if(this.tmpSprite && this.tmpSprite.alpha > 0) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.tmpSprite.destroy();
        this.tmpSprite = undefined;
        PIXI.Ticker.shared.remove(this.fadeOutAnimate, this);
      }
      else {
        this.tmpSprite.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        this.tmpSprite.width = this.tmpSprite.alpha * config.get('squareWidth');
        this.tmpSprite.height = this.tmpSprite.alpha * config.get('squareHeight');
      }
    }
  }
}

module.exports = Piece;