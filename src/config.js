const deepcopy = require('deepcopy');
const deepmerge = require('deepmerge');

class Config {
  constructor(customConfig = null) {
    this.config = {
      app: {
        antialias: true,
        forceCanvas: false,
      },
      viewport: {
        drag: true,
        pinch: true,
        wheel: true,
        decelerate: true,
      },
      fps: {
        show: false,
        min: 20,
        max: 0,
      },
      background: {
        showRectangle: true,
        blur: true,
        blurStrength: 17,
        blurQuality: 3,
      },
      board: {
        showWhite: true,
        showBlack: true,
        fadeDuration: 450,
        marginHeight: 120,
        marginWidth: 120,
        borderHeight: 40,
        borderWidth: 40,
        borderRadius: 45,
        borderLineWidth: 8,
        flipTimeline: false,
        flipTurn: false,
        flipRank: false,
        flipFile: false,
      },
      boardShadow: {
        show: true,
        offsetX: 40,
        offsetY: 40,
        alpha: 0.25,
      },
      square: {
        height: 100,
        width: 100,
        fadeDuration: 150,
      },
      piece: {
        fadeDuration: 150,
        roundPixel: true,
      },
      arrow: {
        lutInterval: 10,
        headSize: 30,
        size: 10,
        midpointRadius: 10,
        outlineSize: 20,
        animateDuration: 650,
        alpha: 0.6,
        spatialShow: true,
        spatialCurved: true,
        spatialMiddle: false,
        spatialRealEnd: false,
        nonSpatialShow: true,
        nonSpatialCurved: true,
        nonSpatialMiddle: true,
        nonSpatialRealEnd: true,
      },
      ripple: {
        timelineDuration: 40,
        turnDuration: 20,
        rankDuration: 15,
        fileDuration: 15,
      },
    };

    if(customConfig !== null) {
      this.set(customConfig);
    }
  }
  set(key, value = null) {
    if(value === null) {
      this.config = deepmerge(this.config, deepcopy(key));
    }
    else {
      this.config[key] = deepmerge(this.config[key], deepcopy(value));
    }
  }
  get(key = null) {
    if(key === null) {
      return this.config;
    }
    return this.config[key];
  }
}

module.exports = Config;
