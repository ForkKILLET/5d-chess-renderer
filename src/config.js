var config = {
  antialias: true,
  forceCanvas: false,
  minFps: 20,
  showFps: true,
  squareHeight: 100,
  squareWidth: 100,
  squareFadeDuration: 150,
  squareEvents: true,
  pieceFadeDuration: 150,
  pieceRoundPixel: true,
  pieceEvents: true,
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

exports.set = (key, value = null) => {
  if(value === null) {
    config = Object.assign(config, key);
  }
  else {
    config[key] = value;
  }
}

exports.get = (key = null) => {
  if(key === null) {
    return config;
  }
  return config[key];
}
