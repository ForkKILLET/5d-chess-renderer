const BlackPawn = require('@local/assets/bP.png');
const BlackBishop = require('@local/assets/bB.png');
const BlackKnight = require('@local/assets/bN.png');
const BlackRook = require('@local/assets/bR.png');
const BlackQueen = require('@local/assets/bQ.png');
const BlackKing = require('@local/assets/bK.png');
const WhitePawn = require('@local/assets/wP.png');
const WhiteBishop = require('@local/assets/wB.png');
const WhiteKnight = require('@local/assets/wN.png');
const WhiteRook = require('@local/assets/wR.png');
const WhiteQueen = require('@local/assets/wQ.png');
const WhiteKing = require('@local/assets/wK.png');

class LoadManager {
  constructor(global) {
    this.global = global;
    //Load board / square / highlight textures
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'highlight');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'whiteSquare');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'blackSquare');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'whiteBoardBorder');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'blackBoardBorder');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'checkBoardBorder');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.WHITE, 'inactiveBoardBorder');
    
    //Load black pieces
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackPawn), 'blackP');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackPawn), 'blackW');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackBishop), 'blackB');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackKnight), 'blackN');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackRook), 'blackR');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackQueen), 'blackS');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackQueen), 'blackQ');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(BlackKing), 'blackK');
    
    //Load white pieces
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhitePawn), 'whiteP');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhitePawn), 'whiteW');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhiteBishop), 'whiteB');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhiteKnight), 'whiteN');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhiteRook), 'whiteR');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhiteQueen), 'whiteS');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhiteQueen), 'whiteQ');
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(WhiteKing), 'whiteK');
  }
  load(key, data) {
    if(typeof this.global.PIXI.utils.TextureCache[key] !== 'undefined') {
      this.global.PIXI.Texture.removeFromCache(key);
    }
    this.global.PIXI.Texture.addToCache(this.global.PIXI.Texture.from(data), key);
    this.global.emitter.emit('textureUpdate');
  }
}

module.exports = LoadManager;
