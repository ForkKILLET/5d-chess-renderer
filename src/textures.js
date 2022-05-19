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
    this.textures.highlight = this.PIXI.Texture.WHITE.castToBaseTexture();
    this.textures.whiteSquare = this.PIXI.Texture.WHITE.castToBaseTexture();
    this.textures.blackSquare = this.PIXI.Texture.WHITE.castToBaseTexture();
    this.textures.whiteBoardBorder = this.PIXI.Texture.WHITE.castToBaseTexture();
    this.textures.blackBoardBorder = this.PIXI.Texture.WHITE.castToBaseTexture();
    this.textures.checkBoardBorder = this.PIXI.Texture.WHITE.castToBaseTexture();
    this.textures.inactiveBoardBorder = this.PIXI.Texture.WHITE.castToBaseTexture();
    
    //Load black pieces
    this.textures.blackP = this.PIXI.BaseTexture.from(BlackPawn);
    this.textures.blackW = this.PIXI.BaseTexture.from(BlackBrawn);
    this.textures.blackB = this.PIXI.BaseTexture.from(BlackBishop);
    this.textures.blackN = this.PIXI.BaseTexture.from(BlackKnight);
    this.textures.blackR = this.PIXI.BaseTexture.from(BlackRook);
    this.textures.blackQ = this.PIXI.BaseTexture.from(BlackQueen);
    this.textures.blackS = this.PIXI.BaseTexture.from(BlackPrincess);
    this.textures.blackK = this.PIXI.BaseTexture.from(BlackKing);
    this.textures.blackC = this.PIXI.BaseTexture.from(BlackCommonKing);
    this.textures.blackY = this.PIXI.BaseTexture.from(BlackRoyalQueen);
    this.textures.blackU = this.PIXI.BaseTexture.from(BlackUnicorn);
    this.textures.blackD = this.PIXI.BaseTexture.from(BlackDragon);
    
    //Load white pieces
    this.textures.whiteP = this.PIXI.BaseTexture.from(WhitePawn);
    this.textures.whiteW = this.PIXI.BaseTexture.from(WhiteBrawn);
    this.textures.whiteB = this.PIXI.BaseTexture.from(WhiteBishop);
    this.textures.whiteN = this.PIXI.BaseTexture.from(WhiteKnight);
    this.textures.whiteR = this.PIXI.BaseTexture.from(WhiteRook);
    this.textures.whiteS = this.PIXI.BaseTexture.from(WhitePrincess);
    this.textures.whiteQ = this.PIXI.BaseTexture.from(WhiteQueen);
    this.textures.whiteK = this.PIXI.BaseTexture.from(WhiteKing);
    this.textures.whiteC = this.PIXI.BaseTexture.from(WhiteCommonKing);
    this.textures.whiteY = this.PIXI.BaseTexture.from(WhiteRoyalQueen);
    this.textures.whiteU = this.PIXI.BaseTexture.from(WhiteUnicorn);
    this.textures.whiteD = this.PIXI.BaseTexture.from(WhiteDragon);

    if(customTexture !== null) {
      let keys = Object.keys(customTexture);
      for(let key of keys) {
        this.set(key, customTexture[key]);
      }
    }
  }
  set(key, data) {
    this.textures[key] = this.PIXI.Texture.from(data).castToBaseTexture();
  }
  get(key) {
    return new this.PIXI.Texture(this.textures[key]);
  }
  destroy() {
    var keys = Object.keys(this.textures);
    for(let key of keys) {
      if(typeof this.textures[key] !== 'undefined') {
        this.textures[key].destroy();
      }
    }
    this.textures = {};
  }
}

module.exports = Textures;
