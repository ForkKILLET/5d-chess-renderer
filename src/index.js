const { default: PixiFps } = require('pixi-fps');
const Global = require('@local/global');

const Background = require('@local/background');
const Board = require('@local/board');
const StraightArrow = require('@local/straightArrow');

class ChessRenderer {
  constructor() {
    
    //Allow configuration
    config.set(configObj);

    if(element !== null) {
      this.attach(element);
    }
    if(boardObj !== null) {
      this.updateBoard(boardObj);
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
    this.viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate();
    this.app.stage.addChild(this.viewport);

    //Draw background if needed
    if(typeof this.background === 'undefined') {
      this.background = new Background(this.app);
    }
    else {
      this.background.update(this.app);
    }

    //Trigger resize on element change for viewport
    elementResizeEvent(element, throttle(250, () => {
      this.viewport.resize(this.app.renderer.width, this.app.renderer.height);
    }));
    
    //Add fps counter
    if(config.get('showFps')) {
      this.app.stage.addChild(new PixiFps());
    }

    //Load layers
    layerFuncs.addLayers(this.viewport);

    //Draw background if needed
    if(typeof this.background === 'undefined') {
      this.background = new Background(this.app);
    }
    else {
      this.background.update(this.app);
    }
  }
  loadTexture(piece, texture) {
    loadFuncs.load(piece, texture);
  }
  config(configIn) {
    config.set(configIn);
    this.board.refresh();
  }
  updateBoard(boardObj) {
    if(typeof this.board === 'undefined') {
      this.board = new Board(this.viewport, this.emitter, boardObj);
    }
    else {
      this.board.update(boardObj);
    }

    //Draw background if needed
    if(typeof this.background === 'undefined') {
      this.background = new Background(this.app);
    }
    else {
      this.background.update(this.app);
    }
  }
  tmpArrow(arrowObject) {
    var a = new StraightArrow(arrowObject);
  }
}

module.exports = ChessRenderer;