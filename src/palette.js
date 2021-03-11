const deepcopy = require('deepcopy');
const deepmerge = require('deepmerge');

class Palette {
  constructor(customPalette = null) {
    this.palette = {
      background: {
        single: 0xE2E5F7,
        lightRectangle: 0xE2E5F7,
        lightStripeBlack: 0xBCB6CE,
        lightStripeWhite: 0xE5EEF6,
        darkRectangle: 0xCED4F1,
        darkStripeBlack: 0xAFA3BD,
        darkStripeWhite: 0xDDE5F4,
      },
      board: {
        whiteBorder: 0xdddddd,
        blackBorder: 0x222222,
        checkBorder: 0xf50000,
        whiteBorderOutline: 0x222222,
        blackBorderOutline: 0xdddddd,
        checkBorderOutline: 0xdddddd,
        whiteLabel: 0x000000,
        blackLabel: 0xffffff,
        checkLabel: 0xffffff,
      },
      boardLabel: {
        timeline: 0x000000,
        turn: 0x000000,
        whiteBoard: 0x000000,
        blackBoard: 0xffffff,
        checkBoard: 0xffffff,
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
        custom: 0x32dcfa, //This is the default color used if no color is specified when turning on custom arrow mode
        customOutline: 0x000000,
      },
      highlight: {
        self: 0x0083be,
        move: 0x6fc326,
        pastMove: 0x6fc326,
        capture: 0xf50000,
        pastCapture: 0xf50000,
      }
    };

    if(customPalette !== null) {
      this.set(customPalette);
    }
  }
  set(key, value = null) {
    if(value === null) {
      this.palette = deepmerge(this.palette, deepcopy(key));
    }
    else {
      this.palette[key] = deepmerge(this.palette[key], deepcopy(value));
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
