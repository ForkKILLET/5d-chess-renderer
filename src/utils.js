exports.pieceObjectKey = (pieceObject) => {
  return `${pieceObject.player}${pieceObject.piece}_${pieceObject.position.timeline}_${pieceObject.position.player}${pieceObject.position.turn}_${pieceObject.position.coordinate}_${pieceObject.hasMoved}`;
}

exports.squareObjectKey = (squareObject) => {
  return `${squareObject.timeline}_${squareObject.player}${squareObject.turn}_${squareObject.coordinate}`;
}