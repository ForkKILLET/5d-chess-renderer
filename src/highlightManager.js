const Highlight = require('@local/highlight');

class HighlightManager {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.selectedPieceHighlight;
    this.selectedPieceMoveHighlights = [];

    this.hoverPieceHighlight;
    this.hoverPieceMoveHighlights = [];

    this.emitter.on('selectedPieceUpdate', this.update.bind(this));
  }
  update() {
    //Updating selectedPiece
    if(this.global.selectedPiece !== null) {
      var highlight = this.global.selectedPiece.pieceObject.position;
      highlight.alpha = this.global.config.get('highlight').selectedAlpha;
      highlight.color = this.global.palette.get('highlight').self;
      if(typeof this.selectedPieceHighlight !== 'undefined') {
        this.selectedPieceHighlight.update(highlight);
      }
      else {
        this.selectedPieceHighlight = new Highlight(this.global, highlight);
      }
    }
    else {
      if(typeof this.selectedPieceHighlight !== 'undefined') {
        this.selectedPieceHighlight.destroy();
        this.selectedPieceHighlight = undefined;
      }
    }
  }
}

module.exports = HighlightManager;
