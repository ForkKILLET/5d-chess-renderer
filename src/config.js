var config = {
  antialias: true,
  forceCanvas: false,
  squareHeight: 100,
  squareWidth: 100,
  squareFadeDuration: 150,
  squareFadeRippleDuration: 25,
  squareEvents: true,
  pieceFadeDuration: 250,
  pieceFadeRippleDuration: 25,
  pieceEvents: true,
  boardMarginHeight: 100,
  boardMarginWidth: 100,
  boardBorderHeight: 30,
  boardBorderWidth: 30,
  boardBorderRadius: 30,
  boardBorderLineWidth: 5,
  boardShadow: true,
  boardShadowRotation: 45,
  boardShadowDistance: 20,
  boardFlipTimeline: false,
  boardFlipTurn: false,
  boardFlipRank: false,
  boardFlipFile: false,
  boardWipeRippleDuration: 35,
  backgroundBlur: false,
  backgroundBlurStrength: 10,
  backgroundBlurQuality: 2,
  timelineRippleDuration: 500,
  turnRippleDuration: 500,
  turnFollow: true
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
