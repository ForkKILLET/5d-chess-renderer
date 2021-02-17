const PIXI = require('pixi.js-legacy');
const { Viewport } = require('pixi-viewport');
const { throttle } = require('throttle-debounce');
const elementResizeEvent = require('element-resize-event');
const { createNanoEvents } = require('nanoevents');

const config = require('@local/config');
const palette = require('@local/palette');
const loadFuncs = require('@local/assets/load');
const Piece = require('@local/piece');

class ChessRenderer {
  constructor(element = null, configObj = {}) {
    //tmp debug
    this.tmpPIXI = PIXI;

    this.app;
    this.viewport;
    this.emitter = createNanoEvents();
    
    //Allow configuration
    config.set(configObj);

    if(element !== null) {
      this.attach(element);
    }
    loadFuncs.loadDefault();
  }
  on(event, callback) {
    return this.emitter.on(event, callback);
  }
  attach(element) {
    //Create and attach PIXI app to element
    this.app = new PIXI.Application({
      backgroundColor: palette.get('background'),
      antialias: config.get('antialias'),
      forceCanvas: config.get('forceCanvas')
    });
    this.app.resizeTo = element;
    element.appendChild(this.app.view);

    //Add viewport to app
    this.viewport = new Viewport({
      worldHeight: 1000,
      worldWidth: 1000
    });
    this.app.stage.addChild(this.viewport);
    this.viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();

    //Trigger resize on element change for viewport
    elementResizeEvent(element, throttle(250, () => {
      this.viewport.resize(this.app.renderer.width, this.app.renderer.height);
    }));
  }
  loadPieceTexture(piece, texture) {
    loadFuncs.load(piece, texture);
  }
  tmpNewPiece(pieceObj, oldPieceObj = null) {
    new Piece(this.viewport, this.emitter, {}, pieceObj, oldPieceObj);
  }
}

module.exports = ChessRenderer;