exports.pieceObjectKey = (pieceObject) => {
  return `${this.pieceObject.player}${this.pieceObject.piece}_${this.pieceObject.position.timeline}_${this.pieceObject.position.player}${this.pieceObject.position.turn}_${this.pieceObject.position.coordinate}_${this.pieceObject.hasMoved}`;
}

exports.squareObjectKey = (squareObject) => {
  return `${this.squareObject.timeline}_${this.squareObject.player}${this.squareObject.turn}_${this.squareObject.coordinate}`;
}