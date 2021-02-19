const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class Square {
  constructor(emitter, squareObject = null) {
    this.layer = layerFuncs.layers.pieces;
    this.emitter = emitter;
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
    
    var coordinates = positionFuncs.toCoordinates(this.squareObject);
    //Load and animate sprite if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      this.key = `${this.squareObject.timeline}_${this.squareObject.player}${this.squareObject.turn}_${this.squareObject.coordinate}`;
      this.sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
      if(this.squareObject.rank % 2 === this.squareObject.file % 2) {
        this.sprite.tint = palette.get('whiteSquare');
      }
      else {
        this.sprite.tint = palette.get('blackSquare');
      }
      this.sprite.width = config.get('squareWidth');
      this.sprite.height = config.get('squareHeight');
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.square.center.x;
      this.sprite.y = this.coordinates.square.center.y;
      this.layer.addChild(this.sprite);
      //Add interaction if needed
      this.interact();
  
      //Initialize animation
      this.fade();
    }
  }
  interact() {
    //Add interactive events
    if(config.get('squareEvents')) {
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
  }
  fade() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.fadeDelay = config.get('squareFadeRippleDuration') * (this.squareObject.rank + this.squareObject.file);
    this.fadeLeft = config.get('squareFadeDuration');
    this.fadeDuration = config.get('squareFadeDuration');
    PIXI.Ticker.shared.add(this.fadeAnimate, this);
  }
  fadeAnimate(delta) {
    //Animate fading in
    if(this.fadeDelay > 0) {
      this.fadeDelay -= (delta / 60) * 1000;
      if(this.fadeDelay < 0) {
        this.fadeDelay = 0;
      }
    }
    else if(this.sprite.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.sprite.alpha = 1;
        this.sprite.width = config.get('squareWidth');
        this.sprite.height = config.get('squareHeight');
        PIXI.Ticker.shared.remove(this.fadeAnimate, this);
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

module.exports = Square;