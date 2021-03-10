const StraightArrow = require('@local/straightArrow');
const CurvedArrow = require('@local/curvedArrow');

class CustomArrowManager {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.middleMode = false;
    this.customColor = null;
    this.tmpArrowObject = null;
    this.tmpArrow;
    this.customArrowObjects = [];
    this.customArrows = [];

    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
    this.emitter.on('squareTap', this.squareSelect.bind(this));
    this.emitter.on('squareOver', this.squareHover.bind(this));
  }
  enableCustomArrowMode(color = null, middleMode = false) {
    this.customArrowMode = true;
    if(color !== null) {
      this.customColor = color;
    }
    else {
      this.customColor = null;
    }
    this.middleMode = middleMode;
  }
  disableCustomArrowMode() {
    this.customArrowMode = false;
    this.middleMode = false;
    this.customColor = null;
    this.tmpArrowObject = null;
    if(typeof this.tmpArrow !== 'undefined') {
      this.tmpArrow.destroy();
      this.tmpArrow = undefined;
    }
  }
  update() {
    
  }
  squareSelect(event) {
    if(this.tmpArrowObject === null) {
      this.tmpArrowObject = {
        start: event.squareObject,
      };
    }
  }
  squareHover(event) {
    
  }
}

module.exports = CustomArrowManager;
