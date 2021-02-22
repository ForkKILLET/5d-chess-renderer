const BlackPawn = require('@local/assets/b.png');
const BlackBishop = require('@local/assets/bB.png');
const BlackKnight = require('@local/assets/bN.png');
const BlackRook = require('@local/assets/bR.png');
const BlackQueen = require('@local/assets/bQ.png');
const BlackKing = require('@local/assets/bK.png');
const WhitePawn = require('@local/assets/w.png');
const WhiteBishop = require('@local/assets/wB.png');
const WhiteKnight = require('@local/assets/wN.png');
const WhiteRook = require('@local/assets/wR.png');
const WhiteQueen = require('@local/assets/wQ.png');
const WhiteKing = require('@local/assets/wK.png');
const PIXI = require('pixi.js-legacy');

exports.loadDefault = () => {
  PIXI.Texture.addToCache(PIXI.Texture.WHITE, 'whiteSquare');
  PIXI.Texture.addToCache(PIXI.Texture.WHITE, 'blackSquare');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackPawn), 'blackP');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackBishop), 'blackB');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackKnight), 'blackN');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackRook), 'blackR');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackQueen), 'blackS');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackQueen), 'blackQ');
  PIXI.Texture.addToCache(PIXI.Texture.from(BlackKing), 'blackK');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhitePawn), 'whiteP');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhiteBishop), 'whiteB');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhiteKnight), 'whiteN');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhiteRook), 'whiteR');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhiteQueen), 'whiteS');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhiteQueen), 'whiteQ');
  PIXI.Texture.addToCache(PIXI.Texture.from(WhiteKing), 'whiteK');
}

exports.load = (pieceKey, texture) => {
  if(typeof PIXI.utils.TextureCache[pieceKey] !== 'undefined') {
    PIXI.Texture.removeFromCache(pieceKey);
  }
  PIXI.Texture.addToCache(texture, pieceKey);
}

exports.loadFrom = (pieceKey, data) => {
  if(typeof PIXI.utils.TextureCache[pieceKey] !== 'undefined') {
    PIXI.Texture.removeFromCache(pieceKey);
  }
  PIXI.Texture.addToCache(PIXI.Texture.from(data), pieceKey);
}