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

class Textures {
  constructor(PIXI) {
    this.PIXI = PIXI;
    //Set mipmap to always on
    this.PIXI.settings.MIPMAP_TEXTURES = this.PIXI.MIPMAP_MODES.ON;
    
    //Store textures here
    this.textures = {};

    //Load board / square / highlight textures
    this.textures.highlight = this.PIXI.Texture.WHITE;
    this.textures.whiteSquare = this.PIXI.Texture.WHITE;
    this.textures.blackSquare = this.PIXI.Texture.WHITE;
    this.textures.whiteBoardBorder = this.PIXI.Texture.WHITE;
    this.textures.blackBoardBorder = this.PIXI.Texture.WHITE;
    this.textures.checkBoardBorder = this.PIXI.Texture.WHITE;
    this.textures.inactiveBoardBorder = this.PIXI.Texture.WHITE;
    
    //Load black pieces
    this.textures.blackP = this.PIXI.Texture.from(BlackPawn);
    this.textures.blackW = this.PIXI.Texture.from(BlackPawn);
    this.textures.blackB = this.PIXI.Texture.from(BlackBishop);
    this.textures.blackN = this.PIXI.Texture.from(BlackKnight);
    this.textures.blackR = this.PIXI.Texture.from(BlackRook);
    this.textures.blackS = this.PIXI.Texture.from(BlackQueen);
    this.textures.blackQ = this.PIXI.Texture.from(BlackQueen);
    this.textures.blackK = this.PIXI.Texture.from(BlackKing);
    
    //Load white pieces
    this.textures.whiteP = this.PIXI.Texture.from(WhitePawn);
    this.textures.whiteW = this.PIXI.Texture.from(WhitePawn);
    this.textures.whiteB = this.PIXI.Texture.from(WhiteBishop);
    this.textures.whiteN = this.PIXI.Texture.from(WhiteKnight);
    this.textures.whiteR = this.PIXI.Texture.from(WhiteRook);
    this.textures.whiteS = this.PIXI.Texture.from(WhiteQueen);
    this.textures.whiteQ = this.PIXI.Texture.from(WhiteQueen);
    this.textures.whiteK = this.PIXI.Texture.from(WhiteKing);
  }
  set(key, data) {
    if(typeof this.textures[key] !== 'undefined') {
      this.textures[key].destroy();
    }
    this.textures[key] = this.PIXI.Texture.from(data);
  }
  get(key) {
    return this.textures[key];
  }
  destroy() {
    var keys = Object.keys(this.textures);
    for(var key in keys) {
      if(typeof this.textures[key] !== 'undefined') {
        this.textures[key].destroy();
      }
    }
    this.textures = {};
  }
}

module.exports = Textures;
