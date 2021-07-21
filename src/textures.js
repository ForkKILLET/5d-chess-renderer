const BlackBishop = require('@local/assets/black_bishop.png');
const BlackBrawn = require('@local/assets/black_brawn.png');
const BlackCommonKing = require('@local/assets/black_common_king.png');
const BlackDragon = require('@local/assets/black_dragon.png');
const BlackKing = require('@local/assets/black_king.png');
const BlackKnight = require('@local/assets/black_knight.png');
const BlackPawn = require('@local/assets/black_pawn.png');
const BlackPrincess = require('@local/assets/black_princess.png');
const BlackQueen = require('@local/assets/black_queen.png');
const BlackRook = require('@local/assets/black_rook.png');
const BlackRoyalQueen = require('@local/assets/black_brawn.png');
const BlackUnicorn = require('@local/assets/black_unicorn.png');

const WhiteBishop = require('@local/assets/white_bishop.png');
const WhiteBrawn = require('@local/assets/white_brawn.png');
const WhiteCommonKing = require('@local/assets/white_common_king.png');
const WhiteDragon = require('@local/assets/white_dragon.png');
const WhiteKing = require('@local/assets/white_king.png');
const WhiteKnight = require('@local/assets/white_knight.png');
const WhitePawn = require('@local/assets/white_pawn.png');
const WhitePrincess = require('@local/assets/white_princess.png');
const WhiteQueen = require('@local/assets/white_queen.png');
const WhiteRook = require('@local/assets/white_rook.png');
const WhiteRoyalQueen = require('@local/assets/white_brawn.png');
const WhiteUnicorn = require('@local/assets/white_unicorn.png');

class Textures {
  constructor(PIXI, customTexture = null) {
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
    this.textures.blackW = this.PIXI.Texture.from(BlackBrawn);
    this.textures.blackB = this.PIXI.Texture.from(BlackBishop);
    this.textures.blackN = this.PIXI.Texture.from(BlackKnight);
    this.textures.blackR = this.PIXI.Texture.from(BlackRook);
    this.textures.blackQ = this.PIXI.Texture.from(BlackQueen);
    this.textures.blackS = this.PIXI.Texture.from(BlackPrincess);
    this.textures.blackK = this.PIXI.Texture.from(BlackKing);
    this.textures.blackC = this.PIXI.Texture.from(BlackCommonKing);
    this.textures.blackY = this.PIXI.Texture.from(BlackRoyalQueen);
    this.textures.blackU = this.PIXI.Texture.from(BlackUnicorn);
    this.textures.blackD = this.PIXI.Texture.from(BlackDragon);
    
    //Load white pieces
    this.textures.whiteP = this.PIXI.Texture.from(WhitePawn);
    this.textures.whiteW = this.PIXI.Texture.from(WhiteBrawn);
    this.textures.whiteB = this.PIXI.Texture.from(WhiteBishop);
    this.textures.whiteN = this.PIXI.Texture.from(WhiteKnight);
    this.textures.whiteR = this.PIXI.Texture.from(WhiteRook);
    this.textures.whiteS = this.PIXI.Texture.from(WhitePrincess);
    this.textures.whiteQ = this.PIXI.Texture.from(WhiteQueen);
    this.textures.whiteK = this.PIXI.Texture.from(WhiteKing);
    this.textures.whiteC = this.PIXI.Texture.from(WhiteCommonKing);
    this.textures.whiteY = this.PIXI.Texture.from(WhiteRoyalQueen);
    this.textures.whiteU = this.PIXI.Texture.from(WhiteUnicorn);
    this.textures.whiteD = this.PIXI.Texture.from(WhiteDragon);

    if(customTexture !== null) {
      let keys = Object.keys(customTexture);
      for(let key in keys) {
        this.set(key, customTexture[key]);
      }
    }
  }
  set(key, data) {
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
