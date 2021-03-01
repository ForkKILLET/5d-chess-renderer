const deepcopy = require('deepcopy');

class Palette {
  constructor(customPalette = null) {
    this.palette = {
      background: {
        single: 0xE2E5F7,
        whiteRectangle: 0xE2E5F7,
        blackRectangle: 0xCED4F1,
      },
      board: {
        whiteBorder: 0xdddddd,
        blackBorder: 0x222222,
        checkBorder: 0x222222,
        inactiveBorder: 0x222222,
        whiteBorderOutline: 0x222222,
        blackBorderOutline: 0xdddddd,
        checkBorderOutline: 0xdddddd,
        inactiveBorderOutline: 0xdddddd,
      },
      boardShadow: {
        shadow: 0x000000,
      },
      square: {
        white: 0xaaaaaa,
        black: 0x555555,
      },
      arrow: {
        move: 0xd3a026,
        moveOutline: 0x000000,
        check: 0xf50000,
        checkOutline: 0x000000,
      },
      highlight: {
        self: 0x0083be,
        move: 0x6fc326,
        capture: 0xf50000,
      },
      label: {
        timeline: 0xffffff,
        turn: 0xffffff,
        whiteBoard: 0x000000,
        blackBoard: 0xffffff,
        checkBoard: 0xffffff,
      }
    };

    if(customPalette !== null) {
      this.set(customPalette);
    }
  }
  set(key, value = null) {
    if(value === null) {
      this.palette = Object.assign(this.palette, deepcopy(key));
    }
    else {
      this.palette[key] = Object.assign(this.palette[key], deepcopy(value));
    }
  }
  get(key = null) {
    if(key === null) {
      return this.palette;
    }
    return this.palette[key];
  }
}

module.exports = Palette;
