const PIXI = require('pixi.js-legacy');

const { createNanoEvents } = require('nanoevents');

const Config = require('@local/config');
const Palette = require('@local/palette');

class Global {
  constructor(customConfig = null, customPalette = null, customPIXI = null) {
    //Allow custom PIXI library
    this.PIXI = PIXI;
    if(customPIXI !== null) {
      this.PIXI = customPIXI;
    }

    //New event emitter instance
    this.emitter = createNanoEvents();

    //Allow custom configuration
    this.config = new Config(customConfig);

    //Allow custom palette
    this.palette = new Palette(customPalette);

    //Create PIXI app
    this.app = new PIXI.Application({
      backgroundColor: this.palette.getRaw('background'),
      antialias: this.config.get('antialias'),
      forceCanvas: this.config.get('forceCanvas')
    });

    //Contain 5d-chess-js board object
    this.board = {};
    
    //Contain 5d-chess-js action history array
    this.actionHistory = [];

    //Contain 5d-chess-js move buffer array
    this.moveBuffer = [];

    //Contain 5d-chess-js checks array
    this.checks = [];
  }
  sync(chess) {
    //Takes 5d-chess-js object and displays it
    var tmpChess = chess.copy();
    this.board = tmpChess.board;
    this.actionHistory = tmpChess.actionHistory;
    this.moveBuffer = tmpChess.moveBuffer;
    this.checks = tmpChess.checks;
  }
}

module.exports = Global;