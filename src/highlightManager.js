const Highlight = require('@local/highlight');

const utilsFuncs = require('@local/utils');

class HighlightManager {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.selectedPieceHighlight;
    this.selectedPieceMoveHighlights = [];
    this.selectedPiecePastMoveHighlights = [];

    this.hoverPieceHighlight;
    this.hoverPieceMoveHighlights = [];
    this.hoverPiecePastMoveHighlights = [];

    this.emitter.on('selectedPieceUpdate', this.update.bind(this));
    this.emitter.on('hoverPieceUpdate', this.update.bind(this));
    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
  }
  update() {
    //Updating selectedPiece (and moves)
    if(this.global.selectedPiece !== null &&
      (
        this.global.selectedPiece.pieceObject.position.player === 'white' && this.global.config.get('board').showWhite ||
        this.global.selectedPiece.pieceObject.position.player === 'black' && this.global.config.get('board').showBlack
      )
    ) {
      var highlight = this.global.selectedPiece.pieceObject.position;
      highlight.alpha = this.global.config.get('highlight').selectedAlpha;
      highlight.color = this.global.palette.get('highlight').self;
      if(typeof this.selectedPieceHighlight !== 'undefined') {
        this.selectedPieceHighlight.update(highlight);
      }
      else {
        this.selectedPieceHighlight = new Highlight(this.global, highlight);
      }

      //Currently available moves with the same start as selected piece
      var moves = this.global.availableMoves.filter((m) => {
        return utilsFuncs.squareObjectKey(m.start) === this.global.selectedPiece.squareKey;
      });
      
      //Destroy extra highlights
      for(var i = moves.length;i < this.selectedPieceMoveHighlights.length;i++) {
        this.selectedPieceMoveHighlights[i].destroy();
        this.selectedPieceMoveHighlights.splice(i,1);
        i--;
      }
      for(var i = 0;i < moves.length;i++) {
        var highlight = moves[i].end;
        highlight.alpha = this.global.config.get('highlight').selectedAlpha;
        highlight.color = this.global.palette.get('highlight').move; //TODO add capture checking for capture color
        highlight.interactive = true;
        highlight.move = moves[i];
        if(typeof this.selectedPieceMoveHighlights[i] !== 'undefined') {
          this.selectedPieceMoveHighlights[i].update(highlight);
        }
        else {
          this.selectedPieceMoveHighlights[i] = new Highlight(this.global, highlight);
        }
      }
      
      //Past available moves with the same start as selected piece
      moves = this.global.pastAvailableMoves.filter((m) => {
        return utilsFuncs.squareObjectKey(m.start) === this.global.selectedPiece.squareKey;
      });
      
      //Destroy extra highlights
      for(var i = moves.length;i < this.selectedPiecePastMoveHighlights.length;i++) {
        this.selectedPiecePastMoveHighlights[i].destroy();
        this.selectedPiecePastMoveHighlights.splice(i,1);
        i--;
      }
      for(var i = 0;i < moves.length;i++) {
        var highlight = moves[i].end;
        highlight.alpha = this.global.config.get('highlight').pastSelectedAlpha;
        highlight.color = this.global.palette.get('highlight').pastMove; //TODO add capture checking for capture color
        if(typeof this.selectedPiecePastMoveHighlights[i] !== 'undefined') {
          this.selectedPiecePastMoveHighlights[i].update(highlight);
        }
        else {
          this.selectedPiecePastMoveHighlights[i] = new Highlight(this.global, highlight);
        }
      }
    }
    else {
      if(typeof this.selectedPieceHighlight !== 'undefined') {
        this.selectedPieceHighlight.destroy();
        this.selectedPieceHighlight = undefined;
      }
      for(var i = 0;i < this.selectedPieceMoveHighlights.length;i++) {
        this.selectedPieceMoveHighlights[i].destroy();
        this.selectedPieceMoveHighlights.splice(i,1);
        i--;
      }
      for(var i = 0;i < this.selectedPiecePastMoveHighlights.length;i++) {
        this.selectedPiecePastMoveHighlights[i].destroy();
        this.selectedPiecePastMoveHighlights.splice(i,1);
        i--;
      }
    }

    //Updating hoverPiece (and moves)
    //Only show if hover piece is different from selected piece
    if(
      this.global.hoverPiece !== null &&
      (
        this.global.hoverPiece.pieceObject.position.player === 'white' && this.global.config.get('board').showWhite ||
        this.global.hoverPiece.pieceObject.position.player === 'black' && this.global.config.get('board').showBlack
      ) &&
      (this.global.selectedPiece === null || this.global.hoverPiece.key !== this.global.selectedPiece.key)
    ) {
      var highlight = this.global.hoverPiece.pieceObject.position;
      highlight.alpha = this.global.config.get('highlight').hoverAlpha;
      highlight.color = this.global.palette.get('highlight').self;
      if(typeof this.hoverPieceHighlight !== 'undefined') {
        this.hoverPieceHighlight.update(highlight);
      }
      else {
        this.hoverPieceHighlight = new Highlight(this.global, highlight);
      }
      
      //Currently available moves with the same start as selected piece
      var moves = this.global.availableMoves.filter((m) => {
        return utilsFuncs.squareObjectKey(m.start) === this.global.hoverPiece.squareKey;
      });
      
      //Destroy extra highlights
      for(var i = moves.length;i < this.hoverPieceMoveHighlights.length;i++) {
        this.hoverPieceMoveHighlights[i].destroy();
        this.hoverPieceMoveHighlights.splice(i,1);
        i--;
      }
      for(var i = 0;i < moves.length;i++) {
        var highlight = moves[i].end;
        highlight.alpha = this.global.config.get('highlight').hoverAlpha;
        highlight.color = this.global.palette.get('highlight').move; //TODO add capture checking for capture color
        highlight.interactive = true;
        highlight.move = moves[i];
        if(typeof this.hoverPieceMoveHighlights[i] !== 'undefined') {
          this.hoverPieceMoveHighlights[i].update(highlight);
        }
        else {
          this.hoverPieceMoveHighlights[i] = new Highlight(this.global, highlight);
        }
      }
      
      //Past available moves with the same start as selected piece
      moves = this.global.pastAvailableMoves.filter((m) => {
        return utilsFuncs.squareObjectKey(m.start) === this.global.hoverPiece.squareKey;
      });
      
      //Destroy extra highlights
      for(var i = moves.length;i < this.hoverPiecePastMoveHighlights.length;i++) {
        this.hoverPiecePastMoveHighlights[i].destroy();
        this.hoverPiecePastMoveHighlights.splice(i,1);
        i--;
      }
      for(var i = 0;i < moves.length;i++) {
        var highlight = moves[i].end;
        highlight.alpha = this.global.config.get('highlight').pastHoverAlpha;
        highlight.color = this.global.palette.get('highlight').pastMove; //TODO add capture checking for capture color
        if(typeof this.hoverPiecePastMoveHighlights[i] !== 'undefined') {
          this.hoverPiecePastMoveHighlights[i].update(highlight);
        }
        else {
          this.hoverPiecePastMoveHighlights[i] = new Highlight(this.global, highlight);
        }
      }
    }
    else {
      if(typeof this.hoverPieceHighlight !== 'undefined') {
        this.hoverPieceHighlight.destroy();
        this.hoverPieceHighlight = undefined;
      }
      for(var i = 0;i < this.hoverPieceMoveHighlights.length;i++) {
        this.hoverPieceMoveHighlights[i].destroy();
        this.hoverPieceMoveHighlights.splice(i,1);
        i--;
      }
      for(var i = 0;i < this.hoverPiecePastMoveHighlights.length;i++) {
        this.hoverPiecePastMoveHighlights[i].destroy();
        this.hoverPiecePastMoveHighlights.splice(i,1);
        i--;
      }
    }
  }
}

module.exports = HighlightManager;
