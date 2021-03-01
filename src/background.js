const positionFuncs = require('@local/position');

const deepequal = require('fast-deep-equal');

class Background {
  constructor(global) {
    this.global = global;
    this.layer = this.global.layers.layers.background;
    this.emitter = this.global.emitter;
    this.sprite = null;
    this.texture = null;
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.update();
    this.emitter.on('boardUpdate', this.update.bind(this));
    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
  }
  refresh() {
    this.destroy();
    this.update();
  }
  update() {
    var coordinates = positionFuncs.toCoordinates({
      timeline: 0,
      turn: 1,
      player: 'white',
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    if(
      positionFuncs.compare(coordinates, this.coordinates) !== 0 ||
      !deepequal(this.configBackground, this.global.config.get('background')) ||
      !deepequal(this.paletteBackground, this.global.palette.get('background'))
    ) {
      this.destroy();
      this.coordinates = coordinates;
      this.configBackground = this.global.config.get('background');
      this.paletteBackground = this.global.palette.get('background');
      this.baseWidth = this.coordinates.boardWithMargins.width * 2;
      this.baseHeight = this.coordinates.boardWithMargins.height;
    }

    //Generate texture if needed
    if(this.texture === null) {
      var graphics = new this.global.PIXI.Graphics();
      graphics.beginFill(this.global.palette.get('background').blackRectangle);
      graphics.drawRect(0, 0, this.baseWidth * 2, this.baseHeight * 2);
      graphics.endFill();
      graphics.beginFill(this.global.palette.get('background').whiteRectangle);
      graphics.drawRect(this.baseWidth * 0, this.baseHeight * 1, this.baseWidth, this.baseHeight);
      graphics.drawRect(this.baseWidth * 1, this.baseHeight * 0, this.baseWidth, this.baseHeight);
      graphics.endFill();
      this.texture = this.global.app.renderer.generateTexture(graphics);
    }

    //Drawing background squares
    if(this.sprite === null && this.global.config.get('background').showRectangle) {
      this.sprite = new this.global.PIXI.TilingSprite(
        this.texture,
        this.baseWidth * 250,
        this.baseHeight * 500
      );
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.boardWithMargins.x;
      this.sprite.y = this.coordinates.boardWithMargins.y;
      if(this.global.config.get('background').blur) {
        var blurFilter = new this.global.PIXI.filters.BlurFilter(this.global.config.get('background').blurStrength);
        blurFilter.quality = this.global.config.get('background').blurQuality;
        this.sprite.filters = [blurFilter];
      }
      this.layer.addChild(this.sprite);
    }
    else if(this.sprite !== null && !this.global.config.get('background').showRectangle) {
      this.destroy();
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
