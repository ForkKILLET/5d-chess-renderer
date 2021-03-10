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
        blurStrength: 3,
        blurQuality: 3,
        striped: true,
        expandDuration: 1000,
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
        headSize: 35,
        size: 12,
        midpointRadius: 11,
        outlineSize: 22,
        animateDuration: 650,
        alpha: 0.6,
        spatialShow: true,
        spatialCurved: true,
        spatialSplitCurve: false,
        spatialMiddle: false,
        spatialRealEnd: false,
        nonSpatialShow: true,
        nonSpatialCurved: true,
        nonSpatialSplitCurve: true,
        nonSpatialMiddle: true,
        nonSpatialRealEnd: true,
      },
      customArrow: {
        lutInterval: 10,
        headSize: 35,
        size: 12,
        midpointRadius: 11,
        outlineSize: 22,
        animateDuration: 650,
        alpha: 0.85,
        show: true,
        curved: true,
        splitCurve: false,
      },
      highlight: {
        hoverAlpha: 0.4,
        pastHoverAlpha: 0.2,
        selectedAlpha: 0.6,
        pastSelectedAlpha: 0.4,
        fadeDuration: 75,
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
