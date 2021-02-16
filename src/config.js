var config = {
  antialias: true,
  forceCanvas: false,
  squareSizeY: 100,
  squareSizeX: 100,
  boardMarginsY: 100,
  boardMarginsX: 100
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
