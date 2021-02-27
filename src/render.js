const Background = require('@local/background');
const Board = require('@local/board');
const { default: PixiFps } = require('pixi-fps');

class Render {
  constructor(global) {
    this.global = global;

    this.background = new Background(this.global);
    this.board = new Board(this.global);
  }
}

module.exports = Render;
