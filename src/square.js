const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');

class Square {
  constructor(global, squareObject = null) {
    this.global = global;
    this.layer = this.global.layers.layers.squares;
    this.emitter = this.global.emitter;
    this.squareObject = {};
    if(squareObject !== null) {
      this.update(squareObject);
    }
  }
  refresh() {
    this.destroy();
    this.update(this.squareObject);
  }
  update(squareObject) {
    //Assign pieceObj to instance variables
    this.squareObject = squareObject;
    
    var coordinates = positionFuncs.toCoordinates(this.squareObject, this.global);
    //Load and animate sprite if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      this.key = `${this.squareObject.timeline}_${this.squareObject.player}${this.squareObject.turn}_${this.squareObject.coordinate}`;
      if(this.squareObject.rank % 2 === this.squareObject.file % 2) {
        this.sprite = new this.global.PIXI.Sprite(this.global.PIXI.utils.TextureCache['whiteSquare']);
        this.sprite.tint = this.global.palette.get('square').white;
      }
      else {
        this.sprite = new this.global.PIXI.Sprite(this.global.PIXI.utils.TextureCache['blackSquare']);
        this.sprite.tint = this.global.palette.get('square').black;
      }
      this.sprite.width = this.coordinates.square.width;
      this.sprite.height = this.coordinates.square.height;
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.square.center.x;
      this.sprite.y = this.coordinates.square.center.y;
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
    this.sprite.on('pointertap', (event) => {
      this.emitter.emit('squareTap', {
        key: this.key,
        squareObject: this.squareObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
    this.sprite.on('pointerover', (event) => {
      this.emitter.emit('squareOver', {
        key: this.key,
        squareObject: this.squareObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
    this.sprite.on('pointerout', (event) => {
      this.emitter.emit('squareOut', {
        key: this.key,
        squareObject: this.squareObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
  }
  fadeIn() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.squareObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.squareObject.turn * 2 )+ (this.squareObject.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.squareObject.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.squareObject.file;
    this.fadeLeft = this.global.config.get('square').fadeDuration;
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
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.squareObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.squareObject.turn * 2 )+ (this.squareObject.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.squareObject.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.squareObject.file;
    this.fadeLeft = this.global.config.get('square').fadeDuration;
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
        this.tmpCoordinates = undefined;
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

module.exports = Square;