class Selector {
  //Used to select pieces and moves
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.emitter.on('pieceTap', (data) => {
      this.global.selectedPiece = {
        key: data.key,
        pieceObject: data.pieceObject,
      };
    });
    this.emitter.on('pieceOver', (data) => {
      this.global.hoverPiece = {
        key: data.key,
        pieceObject: data.pieceObject,
      };
    });
    this.emitter.on('pieceOut', (data) => {
      if(this.global.hoverPiece !== null && this.global.hoverPiece.key === data.key) {
        this.global.hoverPiece = null;
      }
    });
  }
}

module.exports = Selector;
