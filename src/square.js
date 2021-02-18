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
      this.graphics = new PIXI.Graphics();
      if(this.squareObject.rank % 2 === this.squareObject.file % 2) {
        this.graphics.beginFill(palette.get('whiteSquare'));
      }
      else {
        this.graphics.beginFill(palette.get('blackSquare'));
      }
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
    if(config.get('squareEvents') && !this.graphics.interactive) {
      this.graphics.interactive = true;
      this.graphics.hitArea = new PIXI.Rectangle(this.graphics.x, this.graphics.y, this.graphics.width, this.graphics.height);
      this.graphics.on('pointertap', (event) => {
        this.emitter.emit('squareTap', {
          key: this.key,
          squareObject: this.squareObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.graphics.on('pointerover', (event) => {
        this.emitter.emit('squareOver', {
          key: this.key,
          squareObject: this.squareObject,
          coordinates: this.coordinates,
          sourceEvent: event
        });
      });
      this.graphics.on('pointerout', (event) => {
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
    this.graphics.alpha = 0;
    this.graphics.visible = true;
    this.fadeDelay = config.get('squareFadeRippleDuration') * Math.min(this.squareObject.rank, this.squareObject.file);
    this.fadeLeft = config.get('squareFadeDuration');
    this.fadeDuration = config.get('squareFadeDuration');
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
        if(this.squareObject.rank % 2 === this.squareObject.file % 2) {
          this.graphics.beginFill(palette.get('whiteSquare'));
        }
        else {
          this.graphics.beginFill(palette.get('blackSquare'));
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
        var width = this.graphics.alpha * config.get('squareWidth');
        var height = this.graphics.alpha * config.get('squareHeight');
        if(this.squareObject.rank % 2 === this.squareObject.file % 2) {
          this.graphics.beginFill(palette.get('whiteSquare'));
        }
        else {
          this.graphics.beginFill(palette.get('blackSquare'));
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

module.exports = Square;