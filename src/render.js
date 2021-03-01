const Background = require('@local/background');
const Board = require('@local/board');
const ArrowManager = require('@local/arrowManager');
const { default: PixiFps } = require('pixi-fps');

class Render {
  constructor(global) {
    this.global = global;

    this.background = new Background(this.global);
    this.board = new Board(this.global);
    this.arrowManager = new ArrowManager(this.global);
  }
}

module.exports = Render;
