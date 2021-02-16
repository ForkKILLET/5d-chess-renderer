const config = require('@local/config');

exports.toCoords = (positionObj, optionsIn) => {
  var options = Object.assign({
    boardWidth: 8,
    boardHeight: 8,
    flipTimeline: false,
    flipTurn: false,
    flipRank: false,
    flipFile: false,
    twoTimeline: false
  }, optionsIn);

  var res = {
    x: 0,
    y: 0,
    width: config.get('squareSizeX'),
    height: config.get('squareSizeY')
  };

  var trueTimeline = positionObj.timeline;
  if(options.twoTimeline && positionObj.timeline > 0) {
    trueTimeline = positionObj.timeline - 1;
  }

  var boardHeight = (options.boardWidth * config.get('squareSizeY'));
  var boardHeighWithMarginst = boardHeight + config.get('boardMarginsY');
  var boardY = (trueTimeline*fullBoardHeight) + (config.get('boardMarginsY')/2);
}