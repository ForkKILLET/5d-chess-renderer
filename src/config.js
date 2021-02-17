var config = {
  antialias: true,
  forceCanvas: false,
  squareHeight: 100,
  squareWidth: 100,
  boardMarginHeight: 100,
  boardMarginWidth: 100,
  boardFlipTimeline: false,
  boardFlipTurn: false,
  boardFlipRank: false,
  boardFlipFile: false,
  pieceEvents: true,
  pieceFadeDuration: 550,
  pieceMoveSpeed: 750 / 1000 //px per ms
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
