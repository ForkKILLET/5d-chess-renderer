const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class Background {
  constructor(app) {
    this.layer = layerFuncs.layers.background;
    this.sprite = null;
    this.texture = null;
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.update(app);
  }
  refresh() {
    this.destroy();
    this.update();
  }
  update(app) {
    var coordinates = positionFuncs.toCoordinates({
      timeline: 0,
      turn: 1,
      player: 'white',
      coordinate: 'a1',
      rank: 1,
      file: 1
    });
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.destroy();
      this.coordinates = coordinates;
      this.baseWidth = this.coordinates.boardWithMargins.width * 2;
      this.baseHeight = this.coordinates.boardWithMargins.height;
    }

    //Generate texture if needed
    if(this.texture === null) {
      /*
      var container = new PIXI.Container();
      var topLeft = new PIXI.Sprite(PIXI.Texture.WHITE);
      topLeft.tint = palette.get('backgroundBlackSquare');
      */
      var graphics = new PIXI.Graphics();
      graphics.beginFill(palette.get('backgroundBlackSquare'));
      graphics.drawRect(0, 0, this.baseWidth * 2, this.baseHeight * 2);
      graphics.endFill();
      graphics.beginFill(palette.get('backgroundWhiteSquare'));
      graphics.drawRect(this.baseWidth * 0, this.baseHeight * 1, this.baseWidth, this.baseHeight);
      graphics.drawRect(this.baseWidth * 1, this.baseHeight * 0, this.baseWidth, this.baseHeight);
      graphics.endFill();
      this.texture = app.renderer.generateTexture(graphics);
    }

    //Drawing background squares
    if(this.sprite === null && config.get('backgroundSquares')) {
      this.sprite = new PIXI.TilingSprite(
        this.texture,
        this.baseWidth * 250,
        this.baseHeight * 500
      );
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.boardWithMargins.x;
      this.sprite.y = this.coordinates.boardWithMargins.y;
      if(config.get('backgroundBlur')) {
        var blurFilter = new PIXI.filters.BlurFilter(config.get('backgroundBlurStrength'));
        blurFilter.quality = config.get('backgroundBlurQuality');
        this.sprite.filters = [blurFilter];
      }
      this.layer.addChild(this.sprite);
    }
  }
  destroy() {
    this.coordinates = undefined;
    this.baseWidth = 0;
    this.baseHeight = 0;
    if(this.texture !== null) {
      this.texture.destroy();
      this.texture = null;
    }
    if(this.sprite !== null) {
      this.sprite.destroy();
      this.sprite = null;
    }
  }
}

module.exports = Background;