const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class Highlight {
  constructor(eventCallback, highlightObject = null) {
    this.layer = layerFuncs.layers.squareHighlights;
    this.eventCallback = eventCallback;
    this.highlightObject = {};
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
    
    var coordinates = positionFuncs.toCoordinates(this.highlightObject);
    //Load and animate sprite if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      this.key = `${this.highlightObject.timeline}_${this.highlightObject.player}${this.highlightObject.turn}_${this.highlightObject.coordinate}`;
      this.graphics = new PIXI.Graphics();
      this.graphics.beginFill(this.highlightObject.color);
      this.graphics.drawRect(
        this.coordinates.square.x,
        this.coordinates.square.y,
        this.coordinates.square.width,
        this.coordinates.square.height
      );
      this.graphics.endFill();
      this.layer.addChild(this.graphics);
      //Add interaction if needed
      this.interact();
  
      //Initialize animation
      this.fade();
    }
  }
  interact() {
    //Add interactive events
    if(config.get('highlightEvents') && !this.graphics.interactive) {
      this.graphics.interactive = true;
      this.graphics.hitArea = new PIXI.Rectangle(this.graphics.x, this.graphics.y, this.graphics.width, this.graphics.height);
      this.graphics.on('pointertap', (event) => {
        this.eventCallback('highlightTap', {
          key: this.key,
          highlightObject: this.highlightObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.graphics.on('pointerover', (event) => {
        this.eventCallback('highlightOver', {
          key: this.key,
          highlightObject: this.highlightObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.graphics.on('pointerout', (event) => {
        this.eventCallback('highlightOut', {
          key: this.key,
          highlightObject: this.highlightObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
    }
  }
  fade() {
    this.graphics.alpha = 0;
    this.graphics.visible = true;
    this.fadeDelay = config.get('highlightFadeRippleDuration') * Math.min(this.highlightObject.rank, this.highlightObject.file);
    this.fadeLeft = config.get('highlightFadeDuration');
    this.fadeDuration = config.get('highlightFadeDuration');
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
    else if(this.graphics.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.graphics.clear();
        this.graphics.alpha = 1;
        if(this.highlightObject.rank % 2 === this.highlightObject.file % 2) {
          this.graphics.beginFill(palette.get('whiteHighlight'));
        }
        else {
          this.graphics.beginFill(palette.get('blackHighlight'));
        }
        this.graphics.drawRect(
          this.coordinates.square.x,
          this.coordinates.square.y,
          this.coordinates.square.width,
          this.coordinates.square.height
        );
        this.graphics.endFill();
        PIXI.Ticker.shared.remove(this.fadeAnimate);
      }
      else {
        this.graphics.clear();
        this.graphics.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        var width = this.graphics.alpha * config.get('highlightWidth');
        var height = this.graphics.alpha * config.get('highlightHeight');
        if(this.highlightObject.rank % 2 === this.highlightObject.file % 2) {
          this.graphics.beginFill(palette.get('whiteHighlight'));
        }
        else {
          this.graphics.beginFill(palette.get('blackHighlight'));
        }
        this.graphics.drawRect(
          this.coordinates.square.center.x - (width / 2),
          this.coordinates.square.center.y - (height / 2),
          width,
          height
        );
        this.graphics.endFill();
      }
    }
  }
  destroy() {
    this.coordinates = undefined;
    this.graphics.destroy();
  }
}

module.exports = Highlight;