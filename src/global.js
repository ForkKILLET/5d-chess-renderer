const PIXI = require('pixi.js-legacy');
const { Viewport } = require('pixi-viewport');
const Cull = require('pixi-cull');

const { throttle } = require('throttle-debounce');
const elementResizeEvent = require('element-resize-event');
const { createNanoEvents } = require('nanoevents');

const Textures = require('@local/textures');
const Config = require('@local/config');
const Palette = require('@local/palette');
const Layers = require('@local/layers');

const utilsFuncs = require('@local/utils');

class Global {
  constructor(customConfig = null, customPalette = null, customPIXI = null) {
    //Allow custom PIXI library
    this.PIXI = PIXI;
    if(customPIXI !== null) {
      this.PIXI = customPIXI;
    }

    //New event emitter instance
    this.emitter = createNanoEvents();

    //New Texture Manager
    this.textureStore = new Textures(this.PIXI);

    //Allow custom configuration
    this.configStore = new Config(customConfig);

    //Allow custom palette
    this.paletteStore = new Palette(customPalette);

    //Create PIXI app
    this.app = new this.PIXI.Application({
      sharedLoader: false,
      width: this.configStore.get('app').width,
      height: this.configStore.get('app').height,
      preserveDrawingBuffer: this.configStore.get('app').preserveDrawingBuffer,
      antialias: this.configStore.get('app').antialias,
      forceCanvas: this.configStore.get('app').forceCanvas,
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
    this.app.ticker.add(() => {
      if(this.viewport.dirty) {
        this.cull.cull(this.viewport.getVisibleBounds());
        this.viewport.dirty = false;
      }
    }, this);

    //Contain 5d-chess-js board object
    this.preTransformBoard;
    this.boardObject;
    
    //Contain 5d-chess-js action history array
    this.actionHistoryObjects;

    //Contain 5d-chess-js move buffer array
    this.moveBufferObjects;

    //Contain 5d-chess-js checks array
    this.checkObjects;

    //Indicate if in custom arrow mode (will block piece and highlight updates)
    this.customArrowMode = false;

    //Contain array of 5d-chess-js move objects indicating available moves
    this.availableMoveObjects = [];

    //Contain array of 5d-chess-js move objects indicating past available moves
    this.pastAvailableMoveObjects = [];

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
    this.config({});
    this.palette({});
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
    this.board(tmpChess.board);
    this.actionHistory(tmpChess.actionHistory);
    this.moveBuffer(tmpChess.moveBuffer);
    this.checks(tmpChess.checks());
  }
  texture(key, data) {
    this.textureStore.set(key, data);
    this.global.emitter.emit('textureUpdate');
  }
  config(key, value = null) {
    this.configStore.set(key, value);
    this.app.ticker.minFPS = this.configStore.get('fps').min;
    this.app.ticker.maxFPS = this.configStore.get('fps').max;
    this.emitter.emit('configUpdate');
  }
  palette(key, value = null) {
    this.paletteStore.set(key, value);
    this.app.renderer.backgroundColor = this.paletteStore.get().background.single;
    this.emitter.emit('paletteUpdate');
  }
  board(board) {
    this.preTransformBoard = board;
    this.boardObject = utilsFuncs.transformBoard(this.preTransformBoard, this.checkObjects);
    this.emitter.emit('boardUpdate');
  }
  actionHistory(actionHistory) {
    this.actionHistoryObjects = actionHistory;
    this.emitter.emit('actionHistoryUpdate');
  }
  moveBuffer(moveBuffer) {
    this.moveBufferObjects = moveBuffer;
    this.emitter.emit('moveBufferUpdate');
  }
  checks(checks) {
    this.checkObjects = checks;
    this.boardObject = utilsFuncs.transformBoard(this.preTransformBoard, this.checkObjects);
    this.emitter.emit('boardUpdate');
    this.emitter.emit('checksUpdate');
  }
  availableMoves(availableMoves) {
    this.availableMoveObjects = availableMoves;
    this.emitter.emit('availableMovesUpdate');
  }
  pastAvailableMoves(pastAvailableMoves) {
    this.pastAvailableMoveObjects = pastAvailableMoves;
    this.emitter.emit('pastAvailableMovesUpdate');
  }
  destroy() {
    this.app.destroy({
      removeView: true,
      stageOptions: {
        children: true,
        texture: true,
        baseTexture: true,
      }
    });
    this.emitter.events = {};
    this.textureStore.destroy();
    this.PIXI = undefined;
  }
}

module.exports = Global;