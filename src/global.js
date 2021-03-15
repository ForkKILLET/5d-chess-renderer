const PIXI = require('pixi.js-legacy');
const { Viewport } = require('pixi-viewport');
const Cull = require('pixi-cull');

const { throttle } = require('throttle-debounce');
const elementResizeEvent = require('element-resize-event');
const { createNanoEvents } = require('nanoevents');

const Config = require('@local/config');
const Palette = require('@local/palette');
const Layers = require('@local/layers');

const utilsFuncs = require('@local/utils');
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
    this.app = new this.PIXI.Application({
      width: this.config.get('app').width,
      height: this.config.get('app').height,
      preserveDrawingBuffer: this.config.get('app').preserveDrawingBuffer,
      antialias: this.config.get('app').antialias,
      forceCanvas: this.config.get('app').forceCanvas,
    });

    //Create Viewport and add to app
    this.viewport = new Viewport();
    this.app.stage.addChild(this.viewport);
    this.viewport.resize(this.app.renderer.width, this.app.renderer.height);

    //Create and attach layers
    this.layers = new Layers(this.PIXI, this.viewport);

    //Create Culling instance and bind to viewport
    this.cull = new Cull.Simple({ dirtyTest: false });
    this.cull.addList(this.layers.layers.background.children);
    this.cull.addList(this.layers.layers.present.children);
    this.cull.addList(this.layers.layers.boardBorder.children);
    this.cull.addList(this.layers.layers.squares.children);
    this.cull.addList(this.layers.layers.labels.children);
    this.cull.addList(this.layers.layers.pieces.children);
    this.cull.addList(this.layers.layers.squareHighlights.children);
    this.cull.addList(this.layers.layers.moveArrows.children);
    this.cull.addList(this.layers.layers.customArrows.children);
    this.cull.cull(this.viewport.getVisibleBounds());
    this.PIXI.Ticker.shared.add(() => {
      if(this.viewport.dirty) {
        this.cull.cull(this.viewport.getVisibleBounds());
        this.viewport.dirty = false;
      }
    }, this);

    //Contain 5d-chess-js board object
    this.preTransformBoard;
    this.board;
    
    //Contain 5d-chess-js action history array
    this.actionHistory;

    //Contain 5d-chess-js move buffer array
    this.moveBuffer;

    //Contain 5d-chess-js checks array
    this.checks;

    //Indicate if in custom arrow mode (will block piece and highlight updates)
    this.customArrowMode = false;

    //Contain array of 5d-chess-js move objects indicating available moves
    this.availableMoves = [];

    //Contain array of 5d-chess-js move objects indicating past available moves
    this.pastAvailableMoves = [];

    //Object indicating piece hovered over (null if none)
    //Hovered indicates piece that is being considered for selection (but not actually selected)
    /*
      Object:
       - key: string
       - squareKey: string
       - pieceObject: object
    */
    this.hoverPiece = null;

    //Object indicating selected piece (null if none)
    /*
      Object:
       - key: string
       - squareKey: string
       - pieceObject: object
    */
    this.selectedPiece = null;

    //Trigger updates
    this.updateConfig({});
    this.updatePalette({});
  }
  attach(element) {
    //Attach PIXI app to element
    this.app.resizeTo = element;
    element.appendChild(this.app.view);
    this.viewport.resize(this.app.renderer.width, this.app.renderer.height);

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
    this.preTransformBoard = board;
    this.board = utilsFuncs.transformBoard(this.preTransformBoard, this.checks);
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
    this.board = utilsFuncs.transformBoard(this.preTransformBoard, this.checks);
    this.emitter.emit('boardUpdate');
    this.emitter.emit('checksUpdate');
  }
  updateAvailableMoves(availableMoves) {
    this.availableMoves = availableMoves;
    this.emitter.emit('availableMovesUpdate');
  }
  updatePastAvailableMoves(pastAvailableMoves) {
    this.pastAvailableMoves = pastAvailableMoves;
    this.emitter.emit('pastAvailableMovesUpdate');
  }
}

module.exports = Global;