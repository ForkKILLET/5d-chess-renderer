const BlackPawn = require('@local/assets/bP.svg');
const BlackBishop = require('@local/assets/bB.svg');
const BlackKnight = require('@local/assets/bN.svg');
const BlackRook = require('@local/assets/bR.svg');
const BlackQueen = require('@local/assets/bQ.svg');
const BlackKing = require('@local/assets/bK.svg');
const WhitePawn = require('@local/assets/wP.svg');
const WhiteBishop = require('@local/assets/wB.svg');
const WhiteKnight = require('@local/assets/wN.svg');
const WhiteRook = require('@local/assets/wR.svg');
const WhiteQueen = require('@local/assets/wQ.svg');
const WhiteKing = require('@local/assets/wK.svg');
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