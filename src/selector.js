const utilsFuncs = require('@local/utils');

class Selector {
  //Used to select pieces and moves
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.emitter.on('pieceTap', (data) => {
      if(this.global.selectedPiece !== null && this.global.selectedPiece.key === data.key) {
        this.global.selectedPiece = null;
      }
      else {
        this.global.selectedPiece = {
          key: data.key,
          squareKey: data.squareKey,
          pieceObject: data.pieceObject,
        };
      }
      this.global.emitter.emit('selectedPieceUpdate');
    });
    this.emitter.on('highlightTap', (data) => {
      if(this.global.selectedPiece !== null && this.global.selectedPiece.squareKey === data.key) {
        this.global.selectedPiece = null;
        this.global.emitter.emit('selectedPieceUpdate');
      }
    });
    this.emitter.on('pieceOver', (data) => {
      this.global.hoverPiece = {
        key: data.key,
        squareKey: data.squareKey,
        pieceObject: data.pieceObject,
      };
      this.global.emitter.emit('hoverPieceUpdate');
    });
    this.emitter.on('pieceOut', (data) => {
      if(this.global.hoverPiece !== null && this.global.hoverPiece.key === data.key) {
        this.global.hoverPiece = null;
        this.global.emitter.emit('hoverPieceUpdate');
      }
    });
    this.emitter.on('moveSelect', () => {
      if(this.global.configStore.get('selector').deselectOnMove) {
        if(this.global.selectedPiece !== null) {
          this.global.selectedPiece = null;
          this.global.emitter.emit('selectedPieceUpdate');
        }
        if(this.global.hoverPiece !== null) {
          this.global.hoverPiece = null;
          this.global.emitter.emit('hoverPieceUpdate');
        }
      }
    });

    //TODO: Single highlight for 'cursor'
    //TODO: Add methods to easily bind to keyboard / controller inputs
  }
  selectPiece(pieceObject) {
    this.global.selectedPiece = {
      key: utilsFuncs.pieceObjectKey(pieceObject),
      squareKey: utilsFuncs.squareObjectKey(pieceObject.position),
      pieceObject: pieceObject,
    };
    this.global.emitter.emit('selectedPieceUpdate');
  }
  deselectPiece() {
    this.global.selectedPiece = null;
    this.global.emitter.emit('selectedPieceUpdate');
  }
  hoverPiece(pieceObject) {
    this.global.hoverPiece = {
      key: utilsFuncs.pieceObjectKey(pieceObject),
      squareKey: utilsFuncs.squareObjectKey(pieceObject.position),
      pieceObject: pieceObject,
    };
    this.global.emitter.emit('hoverPieceUpdate');
  }
  unhoverPiece() {
    this.global.hoverPiece = null;
    this.global.emitter.emit('hoverPieceUpdate');
  }
}

module.exports = Selector;
