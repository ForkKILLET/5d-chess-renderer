const StraightArrow = require('@local/straightArrow');
const CurvedArrow = require('@local/curvedArrow');

class CustomArrowManager {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.middleMode = false;
    this.customColor = null;
    this.tmpArrowObject;
    this.tmpArrows;
    this.customArrowObjects = [];
    this.customArrows = [];

    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
    this.emitter.on('squareTap', this.squareSelect.bind(this));
    this.emitter.on('squareOver', this.squareHover.bind(this));
  }
  isSpatial(move) {
    if(move.start.timeline !== move.end.timeline) { return false; }
    if(move.start.turn !== move.end.turn) { return false; }
    if(move.start.player !== move.end.player) { return false; }
    return true;
  }
  enableCustomArrowMode(color = null, middleMode = false) {
    if(color !== null) {
      this.customColor = color;
    }
    else {
      this.customColor = null;
    }
    this.middleMode = middleMode;
  }
  update() {
    
  }
  squareSelect() {

  }
  squareHover() {
    
  }
}

module.exports = CustomArrowManager;
