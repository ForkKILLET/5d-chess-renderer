const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class Highlight {
  constructor(global, highlightObject = null) {
    this.global = global;
    this.layer = this.global.layers.layers.squareHighlights;
    this.highlightObject = {};
    this.alpha = 0;
    if(highlightObject !== null) {
      this.update(highlightObject);
    }
  }
  refresh() {
    this.destroy();
    this.update(this.highlightObject);
  }
  update(highlightObject) {
    //Assign pieceObj to instance variables
    this.highlightObject = highlightObject;
    
    var coordinates = positionFuncs.toCoordinates(this.highlightObject, this.global);
    //Load and animate sprite if needed
    if(
      positionFuncs.compare(coordinates, this.coordinates) !== 0 ||
      this.alpha !== this.highlightObject.alpha
    ) {
      if(typeof this.sprite !== 'undefined') {
        this.destroy();
      }

      this.coordinates = coordinates;
      this.alpha = this.highlightObject.alpha;
      this.key = `${this.highlightObject.timeline}_${this.highlightObject.player}${this.highlightObject.turn}_${this.highlightObject.coordinate}`;
      this.sprite = new this.global.PIXI.Sprite(this.global.PIXI.utils.TextureCache['highlight']);
      this.sprite.tint = this.highlightObject.color;
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
      this.emitter.on('highlightTap', {
        key: this.key,
        highlightObject: this.highlightObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
    this.sprite.on('pointerover', (event) => {
      this.emitter.on('highlightOver', {
        key: this.key,
        highlightObject: this.highlightObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
    this.sprite.on('pointerout', (event) => {
      this.emitter.on('highlightOut', {
        key: this.key,
        highlightObject: this.highlightObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
  }
  fadeIn() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.highlightObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.highlightObject.turn * 2 )+ (this.highlightObject.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.highlightObject.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.highlightObject.file;
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
    else if(this.sprite && this.sprite.alpha < this.alpha) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.sprite.alpha = this.alpha;
        this.sprite.width = this.coordinates.square.width;
        this.sprite.height = this.coordinates.square.height;
        this.global.PIXI.Ticker.shared.remove(this.fadeInAnimate, this);
      }
      else {
        var progress = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        this.sprite.alpha = this.alpha * progress;
        this.sprite.width = progress * this.coordinates.square.width;
        this.sprite.height = progress * this.coordinates.square.height;
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
    this.tmpAlpha = this.alpha;
    this.alpha = 0;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.highlightObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.highlightObject.turn * 2 )+ (this.highlightObject.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.highlightObject.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.highlightObject.file;
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
        this.tmpAlpha = undefined;
        this.global.PIXI.Ticker.shared.remove(this.fadeOutAnimate, this);
      }
      else {
        var progress = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        this.tmpSprite.alpha = this.tmpAlpha * progress;
        this.tmpSprite.width = progress * this.tmpCoordinates.square.width;
        this.tmpSprite.height = progress * this.tmpCoordinates.square.height;
      }
    }
  }
}

module.exports = Highlight;