var palette = {
  background: 0xE2E5F7,
  backgroundWhiteSquare: 0xE2E5F7,
  backgroundBlackSquare: 0xCED4F1,
  boardShadow: 0x000000,
  whiteSquare: 0xaaaaaa,
  blackSquare: 0x555555,
  whiteBoardBorder: 0xdddddd,
  blackBoardBorder: 0x222222,
  whiteBoardBorderLine: 0x222222,
  blackBoardBorderLine: 0xdddddd,
  arrowOutline: 0x000000,
  moveArrow: 0xd3a026,
  captureArrow: 0xd3a026,
  checkArrow: 0xf50000,
  selfHighlight: 0x0083be,
  moveHighlight: 0x6fc326,
  captureHighlight: 0xf50000,
  checkBoardOutline: 0xf50000,
  inactiveBoardOutline: 0x777777,
  timelineLabel: 0xffffff,
  turnLabel: 0xffffff,
  whiteBoardLabel: 0x000000,
  blackBoardLabel: 0xffffff,
  checkBoardLabel: 0xffffff,
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
