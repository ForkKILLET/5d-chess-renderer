const PIXI = require('pixi.js-legacy');
const { Viewport } = require('pixi-viewport');

const { throttle } = require('throttle-debounce');
const elementResizeEvent = require('element-resize-event');
const { createNanoEvents } = require('nanoevents');

const Config = require('@local/config');
const Palette = require('@local/palette');
const Layers = require('@local/layers');

const loadFuncs = require('@local/assets/load');

class Global {
  constructor(customConfig = null, customPalette = null, customPIXI = null) {
    //Allow custom PIXI library
    this.PIXI = PIXI;
    if(customPIXI !== null) {
      this.PIXI = customPIXI;
    }

    //Loading initial textures
    loadFuncs.loadDefault(this.PIXI);

    //New event emitter instance
    this.emitter = createNanoEvents();

    //Allow custom configuration
    this.config = new Config(customConfig);

    //Allow custom palette
    this.palette = new Palette(customPalette);

    //Create PIXI app
    this.app = new PIXI.Application({
      antialias: this.config.get().app.antialias,
      forceCanvas: this.config.get().app.forceCanvas,
    });

    //Create Viewport and add to app
    this.viewport = new Viewport();
    this.app.stage.addChild(this.viewport);

    //Create and attach layers
    this.layers = new Layers(this.PIXI, this.viewport);

    //Contain 5d-chess-js board object
    this.board;
    
    //Contain 5d-chess-js action history array
    this.actionHistory;

    //Contain 5d-chess-js move buffer array
    this.moveBuffer;

    //Contain 5d-chess-js checks array
    this.checks;

    //Trigger updates
    this.updateConfig({});
    this.updatePalette({});
  }
  attach(element) {
    //Attach PIXI app to element
    this.app.resizeTo = element;
    element.appendChild(this.app.view);

    //Trigger resize on element change for viewport
    elementResizeEvent(element, throttle(250, () => {
      this.viewport.resize(this.app.renderer.width, this.app.renderer.height);
    }));
  }
  sync(chess) {
    //Takes 5d-chess-js object and displays it
    var tmpChess = chess.copy();
    tmpChess.skipDetection = true;
    this.updateBoard(tmpChess.board);
    this.updateActionHistory(tmpChess.actionHistory);
    this.updateMoveBuffer(tmpChess.moveBuffer);
    this.updateChecks(tmpChess.checks());
  }
  updateConfig(key, value = null) {
    this.config.set(key, value);
    this.PIXI.Ticker.shared.minFPS = this.config.get('fps').min;
    this.PIXI.Ticker.shared.maxFPS = this.config.get('fps').max;
    if(this.config.get('viewport').drag) { this.viewport.drag(); }
    else { this.viewport.plugins.remove('drag'); }
    if(this.config.get('viewport').pinch) { this.viewport.pinch(); }
    else { this.viewport.plugins.remove('pinch'); }
    if(this.config.get('viewport').wheel) { this.viewport.wheel(); }
    else { this.viewport.plugins.remove('wheel'); }
    if(this.config.get('viewport').decelerate) { this.viewport.decelerate(); }
    else { this.viewport.plugins.remove('decelerate'); }
    this.emitter.emit('configUpdate');
  }
  updatePalette(key, value = null) {
    this.palette.set(key, value);
    this.app.renderer.backgroundColor = this.palette.get().background.single;
    this.emitter.emit('paletteUpdate');
  }
  updateTexture(key, data) {
    loadFuncs.loadFrom(this.PIXI, key, data);
    this.emitter.emit('textureUpdate');
  }
  updateBoard(board) {
    this.board = board;
    this.emitter.emit('boardUpdate');
  }
  updateActionHistory(actionHistory) {
    this.actionHistory = actionHistory;
    this.emitter.emit('actionHistoryUpdate');
  }
  updateMoveBuffer(moveBuffer) {
    this.moveBuffer = moveBuffer;
    this.emitter.emit('moveBufferUpdate');
  }
  updateChecks(checks) {
    this.checks = checks;
    this.emitter.emit('checksUpdate');
  }
}

module.exports = Global;