const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class Arrow {
  /*
    Arrow Object:
      - type - string ('move', 'capture', or 'check') or number for custom
      - start - pos obj
      - middle - null or pos obj
      - end - pos obj
  */
  constructor(emitter, arrowObject = null, delay = null) {
    this.emitter = emitter;
    this.lineSprites = [];
    if(arrowObject !== null) {
      if(delay === null) {
        this.update(arrowObject);
      }
      else {
        window.setTimeout(() => {
          this.update(arrowObject);
        }, delay);
      }
    }
  }
  update(arrowObject) {
    this.arrowObject = arrowObject;
    this.layer = typeof this.arrowObject === 'string' ? layerFuncs.layers.moveArrows : layerFuncs.layers.customArrows;
    var hasMiddle = this.arrowObject.middle !== null;

    //Generate LUT
  }
}

module.exports = Arrow;