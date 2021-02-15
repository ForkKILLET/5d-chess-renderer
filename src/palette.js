var palette = {
  background: 0x000000,
  backgroundWhiteSquare: 0x000000,
  backgroundBlackSquare: 0x000000,
  whiteSquare: 0xaaaaaa,
  blackSquare: 0x555555,
  selectedPiece: 0x0083be,
  moveArrow: 0xd3a026,
  moveHighlight: 0x6fc326,
  captureHighlight: 0xf50000,
  checkArrow: 0xf50000,
  whiteBoardOutline: 0xdddddd,
  blackBoardOutline: 0x222222,
  checkBoardOutline: 0xf50000,
  inactiveBoardOutline: 0x777777,
  timelineLabel: 0xffffff,
  turnLabel: 0xffffff,
  whiteBoardLabel: 0x000000,
  blackBoardLabel: 0xffffff,
  checkBoardLabel: 0xffffff,
  drawArrow1: 0xd3a026,
  drawArrow2: 0x0dd95b,
  drawArrow3: 0x32dcfa,
  drawArrow4: 0xf50000
};

exports.set = (key, value) => {
  palette[key] = value;
}

exports.get = (key = null) => {
  if(key === null) {
    return palette;
  }
  return palette[key];
}
