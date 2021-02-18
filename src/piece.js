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
      this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[`${this.pieceObject.player}${this.pieceObject.piece}`]);
      this.sprite.width = config.get('squareWidth');
      this.sprite.height = config.get('squareHeight');
      this.sprite.x = this.coordinates.square.center.x;
      this.sprite.y = this.coordinates.square.center.y;
      this.sprite.anchor.set(0.5);
      this.layer.addChild(this.sprite);
      //Add interaction if needed
      this.interact();
  
      //Initialize animation
      this.fade();
    }
  }
  interact() {
    //Add interactive events
    if(config.get('pieceEvents') && !this.sprite.interactive) {
      this.sprite.interactive = true;
      this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
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
  }
  fade() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.sprite.visible = true;
    this.fadeDelay = config.get('pieceFadeRippleDuration') * Math.min(this.pieceObject.position.rank, this.pieceObject.position.file);
    this.fadeLeft = config.get('pieceFadeDuration');
    this.fadeDuration = config.get('pieceFadeDuration');
    PIXI.Ticker.shared.add(this.fadeAnimate.bind(this));
  }
  fadeAnimate(delta) {
    //Animate fading in
    if(this.fadeDelay > 0) {
      this.fadeDelay -= (delta / 60) * 1000;
      if(this.fadeDelay < 0) {
        this.fadeDelay = 0;
      }
    }
    if(this.sprite.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.sprite.alpha = 1;
        PIXI.Ticker.shared.remove(this.fadeAnimate);
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
    this.sprite.destroy();
  }
}

module.exports = Piece;