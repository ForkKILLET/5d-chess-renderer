//Normally should use pixi from global, but this is only using a static utility function
const PIXI = require('pixi.js-legacy');

class Palette {
  constructor(customPalette = null) {
    this.palette = {
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

    if(customPalette !== null) {
      this.set(customPalette);
    }
  }
  convertFromRaw() {
    var res = {};
    var keys = Object.keys(this.palette);
    for(var i = 0;i < keys.length;i++) {
      res[keys[i]] = PIXI.utils.hex2string(this.palette[keys[i]]);
    }
    return res;
  }
  convertToRaw(value) {
    var res = {};
    var keys = Object.keys(value);
    for(var i = 0;i < keys.length;i++) {
      res[keys[i]] = PIXI.utils.string2hex(value[keys[i]]);
    }
    return res;
  }
  set(key, value = null) {
    if(value === null) {
      this.palette = Object.assign(this.palette, this.convertToRaw(key));
    }
    else {
      this.palette[key] = PIXI.utils.string2hex(value);
    }
  }
  setRaw(key, value = null) {
    if(value === null) {
      this.palette = Object.assign(this.palette, key);
    }
    else {
      this.palette[key] = value;
    }
  }
  get(key = null) {
    if(key === null) {
      return this.convertFromRaw();
    }
    return this.convertFromRaw()[key];
  }
  getRaw(key = null) {
    if(key === null) {
      return this.palette;
    }
    return this.palette[key];
  }
}

module.exports = Palette;
