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
const Text = require('@local/text');

const utilsFuncs = require('@local/utils');

class Global {
  constructor(customConfig = null, customPalette = null, customPIXI = null, customTexture = null) {
    //Allow custom PIXI library
    this.PIXI = PIXI;
    if(customPIXI !== null) {
      this.PIXI = customPIXI;
    }

    //New event emitter instance
    this.emitter = createNanoEvents();

    //New Texture Manager
    this.textureStore = new Textures(this.PIXI, customTexture);

    //Allow custom configuration
    this.configStore = new Config(customConfig);

    //Allow custom palette
    this.paletteStore = new Palette(customPalette);

    //New Text Manager
    this.textStore = new Text(this.PIXI);

    //Create PIXI app
    this.app = new this.PIXI.Application({
      sharedLoader: false,
      width: this.configStore.get('app').width,
      height: this.configStore.get('app').height,
      preserveDrawingBuffer: this.configStore.get('app').preserveDrawingBuffer,
      antialias: this.configStore.get('app').antialias,
      forceCanvas: this.configStore.get('app').forceCanvas,
      backgroundAlpha: this.configStore.get('app').backgroundAlpha,
    });
    this.app.renderer.plugins.interaction.moveWhenInside = true;

    //Create Viewport and add to app
    this.viewport = new Viewport({
      passiveWheel: false,
      disableOnContextMenu: true,
    });
    this.viewport.options.disableOnContextMenu = true;
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
    this.cull.addList(this.layers.layers.promotionMenu.children);
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
    this.actionHistoryObjects = [];

    //Contain 5d-chess-js move buffer array
    this.moveBufferObjects = [];

    //Contain 5d-chess-js checks array
    this.checkObjects = [];

    //Indicate if in custom arrow mode (will block piece and highlight updates)
    this.customArrowMode = false;

    //Contain array of 5d-chess-js move objects indicating available moves
    this.preTransformAvailableMoves = [];
    this.availableMoveObjects = [];

    //Contain array of 5d-chess-js move objects indicating past available moves
    this.preTransformPastAvailableMoves = [];
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
    elementResizeEvent(element, throttle(500, () => {
      this.viewport.resize(this.app.renderer.width, this.app.renderer.height);
      this.emitter.emit('resizeEvent');
    }));
  }
  config(key, value = null, skipEmit = false) {
    this.configStore.set(key, value);
    this.app.stage.interactiveChildren = this.configStore.get('app').interactive;
    this.app.stage.interactive = this.configStore.get('app').interactive;
    this.app.ticker.minFPS = this.configStore.get('fps').min;
    this.app.ticker.maxFPS = this.configStore.get('fps').max;
    if(skipEmit) { return null; }
    this.emitter.emit('configUpdate');
  }
  palette(key, value = null, skipEmit = false) {
    this.paletteStore.set(key, value);
    this.app.renderer.backgroundColor = this.paletteStore.get('background').single;
    if(skipEmit) { return null; }
    this.emitter.emit('paletteUpdate');
  }
  texture(key, data, skipEmit = false) {
    this.textureStore.set(key, data);
    if(skipEmit) { return null; }
    this.emitter.emit('textureUpdate', key);
  }
  sync(chess) {
    //Takes 5d-chess-js object and displays it
    var tmpChess = chess.copy();
    tmpChess.skipDetection = true;
    this.board(tmpChess.board, true);
    this.actionHistory(tmpChess.actionHistory, true);
    this.moveBuffer(tmpChess.moveBuffer, true);
    this.checks(tmpChess.checks('object'), true);
    this.emitter.emit('boardUpdate', this.boardObject);
    this.emitter.emit('actionHistoryUpdate', this.actionHistoryObjects);
    this.emitter.emit('moveBufferUpdate', this.moveBufferObjects);
    this.emitter.emit('checksUpdate', this.checkObjects);
  }
  board(board, skipEmit = false) {
    this.preTransformBoard = board;
    this.boardObject = utilsFuncs.transformBoard(this.preTransformBoard, this.checkObjects);
    if(skipEmit) { return null; }
    this.emitter.emit('boardUpdate', this.boardObject);
  }
  actionHistory(actionHistory, skipEmit = false) {
    this.actionHistoryObjects = actionHistory;
    if(skipEmit) { return null; }
    this.emitter.emit('actionHistoryUpdate', this.actionHistoryObjects);
  }
  moveBuffer(moveBuffer, skipEmit = false) {
    this.moveBufferObjects = moveBuffer;
    if(skipEmit) { return null; }
    this.emitter.emit('moveBufferUpdate', this.moveBufferObjects);
  }
  checks(checks, skipEmit = false) {
    this.checkObjects = checks;
    this.boardObject = utilsFuncs.transformBoard(this.preTransformBoard, this.checkObjects);
    if(skipEmit) { return null; }
    this.emitter.emit('boardUpdate', this.boardObject);
    this.emitter.emit('checksUpdate', this.checkObjects);
  }
  availableMoves(availableMoves) {
    this.preTransformAvailableMoves = availableMoves;
    this.availableMoveObjects = utilsFuncs.transformMoves(this.preTransformAvailableMoves, true);
    this.emitter.emit('availableMovesUpdate', this.availableMoveObjects);
  }
  pastAvailableMoves(pastAvailableMoves) {
    this.preTransformPastAvailableMoves = pastAvailableMoves;
    this.pastAvailableMoveObjects = utilsFuncs.transformMoves(this.preTransformPastAvailableMoves, false);
    this.emitter.emit('pastAvailableMovesUpdate', this.pastAvailableMoveObjects);
  }
  destroy() {
    this.viewport.destroy();
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