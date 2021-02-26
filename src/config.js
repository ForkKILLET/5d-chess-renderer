const deepcopy = require('deepcopy');

class Config {
  constructor(customConfig = null) {
    this.config = {
      app: {
        antialias: true,
        forceCanvas: false,
      },
      fps: {
        show: true,
        min: 20,
        max: 0,
      },
      viewport: {
        enableDrag: true,
        enablePinch: true,
        enableWheel: true,
        enableDecelerate: true,
      },
      square: {
        height: 100,
        width: 100,
      },
      squareHeight: 100,
      squareWidth: 100,
      squareFadeDuration: 150,
      squareEvents: true,
      pieceFadeDuration: 150,
      pieceRoundPixel: true,
      pieceEvents: true,
      whiteBoard: true,
      whiteBoardModifier: 1,
      blackBoard: true,
      blackBoardModifier: 1,
      boardFadeDuration: 450,
      boardMarginHeight: 120,
      boardMarginWidth: 120,
      boardBorderHeight: 40,
      boardBorderWidth: 40,
      boardBorderRadius: 45,
      boardBorderLineWidth: 8,
      boardShadow: true,
      boardShadowDistance: 40,
      boardShadowAlpha: 0.5,
      boardFlipTimeline: false,
      boardFlipTurn: false,
      boardFlipRank: false,
      boardFlipFile: false,
      backgroundSquares: true,
      backgroundBlur: true,
      backgroundBlurStrength: 17,
      backgroundBlurQuality: 3,
      timelineRippleDuration: 40,
      turnRippleDuration: 20,
      turnFollow: false,
      turnFollowTime: 200,
      rankRippleDuration: 15,
      fileRippleDuration: 15,
      arrowLutInterval: 10,
      arrowheadSize: 30,
      arrowSize: 10,
      arrowMidpointRadius: 10,
      arrowOutlineSize: 20,
      arrowAnimateDuration: 650,
      arrowAlpha: 0.6,
    };

    if(customConfig !== null) {
      this.set(customConfig);
    }
  }
  set(key, value = null) {
    if(value === null) {
      this.config = Object.assign(this.config, deepcopy(key));
    }
    else {
      this.config[key] = deepcopy(value);
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
