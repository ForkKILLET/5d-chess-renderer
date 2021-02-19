var config = {
  antialias: true,
  forceCanvas: true,
  minFps: 20,
  squareHeight: 100,
  squareWidth: 100,
  squareFadeDuration: 150,
  squareFadeRippleDuration: 15,
  squareEvents: true,
  pieceFadeDuration: 150,
  pieceFadeRippleDuration: 15,
  pieceRoundPixel: true,
  pieceEvents: true,
  boardMarginHeight: 120,
  boardMarginWidth: 120,
  boardBorderHeight: 40,
  boardBorderWidth: 40,
  boardBorderRadius: 45,
  boardBorderLineWidth: 8,
  boardShadow: false,
  boardShadowRotation: 45,
  boardShadowDistance: 10,
  boardShadowQuality: 1,
  boardFlipTimeline: false,
  boardFlipTurn: false,
  boardFlipRank: false,
  boardFlipFile: false,
  boardWipeRippleDuration: 15,
  backgroundBlur: true,
  backgroundBlurStrength: 20,
  backgroundBlurQuality: 3,
  timelineRippleDuration: 100,
  turnRippleDuration: 100,
  turnFollow: false,
  turnFollowTime: 200
};

exports.set = (key, value = null) => {
  if(value === null) {
    config = Object(config, key);
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
