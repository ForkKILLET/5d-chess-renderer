const utilsFuncs = require('@local/utils');
const positionFuncs = require('@local/position');

class Piece {
  constructor(global, pieceObject = null) {
    this.global = global;
    this.layer = this.global.layers.layers.pieces;
    this.emitter = this.global.emitter;
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
    
    var coordinates = positionFuncs.toCoordinates(this.pieceObject.position, this.global);
    //Load and animate sprite if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      this.key = utilsFuncs.pieceObjectKey(this.pieceObject);
      this.squareKey = utilsFuncs.squareObjectKey(this.pieceObject.position);
      this.sprite = new this.global.PIXI.Sprite(this.global.PIXI.utils.TextureCache[`${this.pieceObject.player}${this.pieceObject.piece}`]);
      this.sprite.width = this.coordinates.square.height;
      this.sprite.height = this.coordinates.square.width;
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.square.center.x;
      this.sprite.y = this.coordinates.square.center.y;
      if(this.global.config.get('piece').roundPixel) {
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
    this.sprite.interactive = true;
    this.sprite.hitArea = new this.global.PIXI.Rectangle(
      -this.coordinates.square.width / 2,
      -this.coordinates.square.height / 2,
      this.coordinates.square.width,
      this.coordinates.square.height
    );
    this.sprite.on('pointertap', (event) => {
      this.emitter.emit('squareTap', {
        key: this.squareKey,
        squareObject: this.pieceObject.position,
        coordinates: this.coordinates,
        sourceEvent: event
      });
      if(this.global.customArrowMode) {
        return null;
      }
      this.emitter.emit('pieceTap', {
        key: this.key,
        squareKey: this.squareKey,
        pieceObject: this.pieceObject,
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
      if(this.global.customArrowMode) {
        return null;
      }
      this.emitter.emit('pieceOver', {
        key: this.key,
        squareKey: this.squareKey,
        pieceObject: this.pieceObject,
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
      if(this.global.customArrowMode) {
        return null;
      }
      this.emitter.emit('pieceOut', {
        key: this.key,
        squareKey: this.squareKey,
        pieceObject: this.pieceObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
  }
  fadeIn() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.pieceObject.position.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.pieceObject.position.turn * 2 )+ (this.pieceObject.position.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.pieceObject.position.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.pieceObject.position.file;
    this.fadeLeft = this.global.config.get('piece').fadeDuration;
    this.fadeDuration = this.fadeLeft;
    this.global.PIXI.Ticker.shared.add(this.fadeInAnimate, this);
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
        this.sprite.width = this.coordinates.square.width;
        this.sprite.height = this.coordinates.square.height;
        this.global.PIXI.Ticker.shared.remove(this.fadeInAnimate, this);
      }
      else {
        this.sprite.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        this.sprite.width = this.sprite.alpha * this.coordinates.square.width;
        this.sprite.height = this.sprite.alpha * this.coordinates.square.height;
      }
    }
  }
  destroy() {
    //Skip destroy if not needed
    if(typeof this.sprite === 'undefined') { return null; }
    this.tmpCoordinates = this.coordinates;
    this.coordinates = undefined;
    this.tmpSprite = this.sprite;
    this.sprite = undefined;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.pieceObject.position.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.pieceObject.position.turn * 2 )+ (this.pieceObject.position.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.pieceObject.position.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.pieceObject.position.file;
    this.fadeLeft = this.global.config.get('piece').fadeDuration;
    this.fadeDuration = this.fadeLeft;
    this.global.PIXI.Ticker.shared.add(this.fadeOutAnimate, this);
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
        this.global.PIXI.Ticker.shared.remove(this.fadeOutAnimate, this);
      }
      else {
        this.tmpSprite.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        this.tmpSprite.width = this.tmpSprite.alpha * this.tmpCoordinates.square.width;
        this.tmpSprite.height = this.tmpSprite.alpha * this.tmpCoordinates.square.height;
      }
    }
  }
}

module.exports = Piece;