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
    this.global.customArrowMode = true;
    if(color !== null) {
      this.customColor = color;
    }
    else {
      this.customColor = null;
    }
    this.middleMode = middleMode;
  }
  disableCustomArrowMode() {
    this.global.customArrowMode = false;
    this.middleMode = false;
    this.customColor = null;
    this.tmpArrowObject = null;
    if(typeof this.tmpArrow !== 'undefined') {
      this.tmpArrow.destroy();
      this.tmpArrow = undefined;
    }
  }
  undo() {
    if(this.customArrowObjects.length > 0) {
      this.customArrowObjects.splice(this.customArrowObjects.length - 1,1);
      this.update();
    }
  }
  wipe() {
    this.customArrowObjects = [];
    this.update();
  }
  update() {
    //Destroy extra arrows
    for(var i = this.customArrowObjects.length;i < this.customArrows.length;i++) {
      this.customArrows[i].destroy();
      this.customArrows.splice(i,1);
      i--;
    }

    //Update custom arrows
    for(var i = 0;i < this.customArrowObjects.length;i++) {
      var customArrowObject = this.customArrowObjects[i];
      var customArrow = this.customArrows[i];
      if(customArrowObject !== null && this.global.config.get('arrow').showCustom) {
        customArrowObject.split = this.global.config.get('arrow').customSplitCurve;
        if(this.global.config.get('arrow').customCurved) {
          if(customArrow instanceof StraightArrow) {
            customArrow.destroy();
            customArrow = undefined;
          }
          if(typeof customArrow === 'undefined') {
            this.customArrows[i] = new CurvedArrow(this.global, customArrowObject);
          }
          else {
            customArrow.update(customArrowObject);
          }
        }
        else {
          if(customArrow instanceof CurvedArrow) {
            customArrow.destroy();
            customArrow = undefined;
          }
          if(typeof customArrow === 'undefined') {
            this.customArrows[i] = new StraightArrow(this.global, customArrowObject);
          }
          else {
            customArrow.update(customArrowObject);
          }
        }
      }
      else if(typeof customArrow !== 'undefined') {
        customArrow.destroy();
        customArrow = undefined;
      }
    }

    //Update temporary arrow
    if(this.tmpArrowObject !== null && this.tmpArrowObject.end !== null && this.global.config.get('arrow').showCustom) {
      this.tmpArrowObject.split = this.global.config.get('arrow').customSplitCurve;
      if(this.global.config.get('arrow').customCurved) {
        if(this.tmpArrow instanceof StraightArrow) {
          this.tmpArrow.destroy();
          this.tmpArrow = undefined;
        }
        if(typeof this.tmpArrow === 'undefined') {
          this.tmpArrow = new CurvedArrow(this.global, this.tmpArrowObject);
        }
        else {
          this.tmpArrow.update(this.tmpArrowObject);
        }
      }
      else {
        if(this.tmpArrow instanceof CurvedArrow) {
          this.tmpArrow.destroy();
          this.tmpArrow = undefined;
        }
        if(typeof this.tmpArrow === 'undefined') {
          this.tmpArrow = new StraightArrow(this.global, this.tmpArrowObject);
        }
        else {
          this.tmpArrow.update(this.tmpArrowObject);
        }
      }
    }
    else if(typeof this.tmpArrow !== 'undefined') {
      this.tmpArrow.destroy();
      this.tmpArrow = undefined;
    }
  }
  squareSelect(event) {
    if(!this.global.customArrowMode) { return null; }
    if(this.tmpArrowObject === null) {
      this.tmpArrowObject = {
        type: this.customColor === null ? 'custom' : this.customColor,
        start: event.squareObject,
        middle: null,
        middleIsTmp: true,
        end: null,
        endIsTmp: true,
      };
    }
    else if(this.middleMode && (this.tmpArrowObject.middle === null || this.tmpArrowObject.middleIsTmp)) {
      this.tmpArrowObject.middleIsTmp = false;
      this.tmpArrowObject.middle = event.squareObject;
    }
    else if(this.middleMode && (this.tmpArrowObject.end === null || this.tmpArrowObject.endIsTmp)) {
      delete this.tmpArrowObject.middleIsTmp;
      delete this.tmpArrowObject.endIsTmp;
      this.tmpArrowObject.end = event.squareObject;
      this.customArrowObjects.push(this.tmpArrowObject);
      this.tmpArrowObject = null;
    }
    else if(!this.middleMode && (this.tmpArrowObject.end === null || this.tmpArrowObject.endIsTmp)) {
      delete this.tmpArrowObject.middleIsTmp;
      delete this.tmpArrowObject.endIsTmp;
      this.tmpArrowObject.end = event.squareObject;
      this.customArrowObjects.push(this.tmpArrowObject);
      this.tmpArrowObject = null;
    }
    this.update();
  }
  squareHover(event) {
    if(!this.global.customArrowMode) { return null; }
    if(this.tmpArrowObject !== null) {
      if(this.middleMode && (this.tmpArrowObject.middle === null || this.tmpArrowObject.middleIsTmp)) {
        this.tmpArrowObject.end = event.squareObject;
      }
      else if(this.middleMode && (this.tmpArrowObject.end === null || this.tmpArrowObject.endIsTmp)) {
        this.tmpArrowObject.end = event.squareObject;
      }
      else if(!this.middleMode && (this.tmpArrowObject.end === null || this.tmpArrowObject.endIsTmp)) {
        this.tmpArrowObject.end = event.squareObject;
      }
    }
    this.update();
  }
}

module.exports = CustomArrowManager;
