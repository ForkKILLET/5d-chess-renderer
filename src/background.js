const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class Background {
  constructor(worldBorders = null) {
    this.layer = layerFuncs.layers.background;
    this.worldBorders = {};
    if(worldBorders !== null) {
      this.update(worldBorders);
    }
  }
  refresh() {
    this.destroy();
    this.update(this.worldBorders);
  }
  update(worldBorders) {
    //Assign pieceObj to instance variables
    this.worldBorders = worldBorders;
    var coords = positionFuncs.toCoordinates({
      timeline: 0,
      turn: 1,
      player: 'white',
      coordinate: 'a1',
      rank: 1,
      file: 1
    });
    var width = coords.boardWithMargins.width * 2;
    var height = coords.boardWithMargins.height;
    var fullBox = {
      x: this.worldBorders.x - (width * 2),
      y: this.worldBorders.y - (height * 2),
      width: this.worldBorders.width + (width * 4),
      height: this.worldBorders.height + (height * 4)
    };
    this.graphics = new PIXI.Graphics();

    //Drawing background squares
    for(var x = fullBox.x;x < fullBox.x + fullBox.width;x += width) {
      for(var y = fullBox.y;y < fullBox.y + fullBox.height;y += height) {  
        if(Math.abs(Math.round(x / width)) % 2 === Math.abs(Math.round(y / height))) {
          this.graphics.beginFill(palette.get('backgroundWhiteSquare'));
        }
        else {
          this.graphics.beginFill(palette.get('backgroundBlackSquare'));
        }  
        this.graphics.drawRect(
          x,
          y,
          width,
          height
        );
      }
    }
    this.graphics.endFill();
    if(config.get('backgroundBlur')) {
      var blurFilter = new PIXI.filters.BlurFilter(config.get('backgroundBlurStrength'));
      blurFilter.quality = config.get('backgroundBlurQuality');
      this.graphics.filters = [blurFilter];
    }
    this.layer.addChild(this.graphics);
  }
  destroy() {
    this.coordinates = undefined;
    this.graphics.destroy();
  }
}

module.exports = Background;