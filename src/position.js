exports.toCoordinates = (positionObj, optionsIn) => {
  var options = Object.assign({
    boardWidth: 8,
    boardHeight: 8,
    flipTimeline: false,
    flipTurn: false,
    flipRank: false,
    flipFile: false,
    centerTimeline: false,
    centerTurn: false,
    centerRank: false,
    centerFile: false
  }, optionsIn);

  var res = {
    x: 0,
    y: 0
  };

}