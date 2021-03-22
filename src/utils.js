const deepcopy = require('deepcopy');

exports.pieceObjectKey = (pieceObject) => {
  return `${pieceObject.player}${pieceObject.piece}_${pieceObject.position.timeline}_${pieceObject.position.player}${pieceObject.position.turn}_${pieceObject.position.coordinate}_${pieceObject.hasMoved}`;
}

exports.squareObjectKey = (squareObject) => {
  return `${squareObject.timeline}_${squareObject.player}${squareObject.turn}_${squareObject.coordinate}`;
}

exports.transformBoard = (boardObject, checkObjects) => {
  //Add ghost boards and indicate inactive / present / check status
  var res = deepcopy(boardObject);
  var checkPositions = [];
  if(Array.isArray(checkObjects)){
    for(var i = 0 ;i < checkObjects.length;i++) {
      if(checkObjects[i].start) { checkPositions.push(checkObjects[i].start); }
      if(checkObjects[i].end) { checkPositions.push(checkObjects[i].end); }
      if(checkObjects[i].realEnd) { checkPositions.push(checkObjects[i].realEnd); }
    }
  }

  for(var l = 0;l < res.timelines.length;l++) {
    var isActive = res.timelines[l].active;
    var isPresent = res.timelines[l].present;
    var maxTurn = Number.NEGATIVE_INFINITY;
    var maxPlayer = 'white';
    var maxIndex = -1;
    for(var t = 0;t < res.timelines[l].turns.length;t++) {
      res.timelines[l].turns[t].active = isActive;
      res.timelines[l].turns[t].present = false;
      res.timelines[l].turns[t].check = false;
      res.timelines[l].turns[t].ghost = false;
      if(
        maxTurn < res.timelines[l].turns[t].turn ||
        (maxTurn === res.timelines[l].turns[t].turn && maxPlayer === 'white' && res.timelines[l].turns[t].player === 'black')
      ) {
        maxTurn = res.timelines[l].turns[t].turn;
        maxPlayer = res.timelines[l].turns[t].player;
        maxIndex = t;
      }
    }

    //Modify latest board
    if(maxIndex >= 0) {
      res.timelines[l].turns[maxIndex].present = isPresent;
      res.timelines[l].turns[maxIndex].check = checkPositions.filter(c => {
        return (
          c.timeline === res.timelines[l].timeline &&
          c.turn === res.timelines[l].turns[maxIndex].turn &&
          c.player === res.timelines[l].turns[maxIndex].player
        );
      }).length > 0;

      //Create and add ghost
      var ghostTurn = deepcopy(res.timelines[l].turns[maxIndex]);
      ghostTurn.present = false;
      ghostTurn.ghost = true;
      if(ghostTurn.player === 'white') {
        ghostTurn.player = 'black';
      }
      else {
        ghostTurn.player = 'white';
        ghostTurn.turn++;
      }
      for(var p = 0;p < ghostTurn.pieces.length;p++) {
        ghostTurn.pieces[p].position.player = ghostTurn.player;
        ghostTurn.pieces[p].position.turn = ghostTurn.turn;
      }
      ghostTurn.check = checkPositions.filter(c => {
        return (
          c.timeline === res.timelines[l].timeline &&
          c.turn === ghostTurn.turn &&
          c.player === ghostTurn.player
        );
      }).length > 0;
      //Show only on timelines needing moves (or in check)
      if(res.player === maxPlayer || ghostTurn.check) {
        res.timelines[l].turns.push(ghostTurn);
      }
    }
  }
  return res;
}

exports.isCapturingMove = (boardObject, moveObject) => {
  for(var l = 0;l < boardObject.timelines.length;l++) {
    for(var t = 0;boardObject.timelines[l].timeline === moveObject.end.timeline && t < boardObject.timelines[l].turns.length;t++) {
      for(var p = 0;boardObject.timelines[l].turns[t].turn === moveObject.end.turn && boardObject.timelines[l].turns[t].player === moveObject.end.player && p < boardObject.timelines[l].turns[t].pieces.length;p++) {
        if(this.squareObjectKey(boardObject.timelines[l].turns[t].pieces[p].position) === this.squareObjectKey(moveObject.end)) {
          return true;
        }
      }
    }
  }
  return false;
}