const PIXI = require('pixi.js-legacy');

class Piece {
  constructor(displayObj, pieceObj, oldPieceObj = null) {
    this.pieceObject = pieceObj;
    this.key = `${this.pieceObject.player}${this.pieceObject.piece}_${this.pieceObject.position.timeline}_${this.pieceObject.position.player}${this.pieceObject.position.turn}_${this.pieceObject.position.coordinate}`;
    this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[`${this.pieceObject.player}${this.pieceObject.piece}`]);
    this.sprite.width = 100;
    this.sprite.height = 100;
    displayObj.addChild(this.sprite);

    this.old = null;
    if(oldPieceObj !== null) {
      this.old = {};
      this.old.pieceObject = oldPieceObj;
      this.old.key = `${this.old.pieceObject.player}${this.old.pieceObject.piece}_${this.old.pieceObject.position.timeline}_${this.old.pieceObject.position.player}${this.old.pieceObject.position.turn}_${this.old.pieceObject.position.coordinate}`;
      this.old.differentSprite = `${this.pieceObject.player}${this.pieceObject.piece}` !== `${this.old.pieceObject.player}${this.old.pieceObject.piece}`;
      if(this.old.differentSprite) {
        this.old.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[`${this.old.pieceObject.player}${this.old.pieceObject.piece}`]);
        this.old.sprite.width = 100;
        this.old.sprite.height = 100;    
        displayObj.addChild(this.old.sprite);
      }
    }
  }
  initAnimation() {
    if(this.old !== null) {
      PIXI.Ticker.shared.add(this.animate);
    }
  }
  animate(time) {
    PIXI.Ticker.shared.remove(this.animate);
  }
}

module.exports = Piece;