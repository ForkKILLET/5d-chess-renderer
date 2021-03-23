const Background = require('@local/background');
const Board = require('@local/board');
const ArrowManager = require('@local/arrowManager');
const CustomArrowManager = require('@local/customArrowManager');
const HighlightManager = require('@local/highlightManager');
const { default: PixiFps } = require('pixi-fps');

class Render {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.background = new Background(this.global);
    this.board = new Board(this.global);
    this.arrowManager = new ArrowManager(this.global);
    this.customArrowManager = new CustomArrowManager(this.global);
    this.highlightManager = new HighlightManager(this.global);
    //TODO: Promotion manager

    this.fpsCounter;
    this.emitter.on('configUpdate', this.update.bind(this));
    this.update();
  }
  update() {
    if(this.global.configStore.get('fps').show) {
      if(typeof this.fpsCounter === 'undefined') {
        this.fpsCounter = new PixiFps();
        this.global.app.stage.addChild(this.fpsCounter);
      }
      var textStyle = new this.global.PIXI.TextStyle({
        align: this.global.configStore.get('fps').align,
        fontFamily: this.global.configStore.get('fps').fontFamily,
        fontSize: this.global.configStore.get('fps').fontSize,
        fontStyle: this.global.configStore.get('fps').fontStyle,
        fontWeight: this.global.configStore.get('fps').fontWeight,
        textBaseline: this.global.configStore.get('fps').textBaseline,
        fill: this.global.paletteStore.get('fps').text,
      });
      this.fpsCounter.style = textStyle;
    }
    else {
      if(typeof this.fpsCounter !== 'undefined') {
        this.global.app.stage.removeChild(this.fpsCounter);
        this.fpsCounter.destroy();
        this.fpsCounter = undefined;
      }
    }
  }
}

module.exports = Render;
