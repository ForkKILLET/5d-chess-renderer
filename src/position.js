const config = require('@local/config');

exports.toCoordinates = (positionObj, optionsIn) => {
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
    board: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      center: {
        x: 0,
        y: 0
      }
    },
    boardWithMargins: {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      center: {
        x: 0,
        y: 0
      }
    },
    square: {
      x: 0,
      y: 0,
      width: config.get('squareWidth'),
      height: config.get('squareHeight'),
      center: {
        x: 0,
        y: 0
      }
    }
  };

  //Adjust y coordinate from timeline (allow two timeline)
  //Flip if necessary
  var newTimeline = 0;
  if(config.get('boardFlipTimeline')) {
    newTimeline = positionObj.timeline;
    if(options.twoTimeline && positionObj.timeline > 0) {
      newTimeline = positionObj.timeline - 1;
    }
  }
  else {
    newTimeline = -positionObj.timeline;
    if(options.twoTimeline && positionObj.timeline < 0) {
      newTimeline = positionObj.timeline + 1;
    }
  }

  //Get y coordinate from timeline
  res.board.height = options.boardHeight * config.get('squareHeight');
  res.boardWithMargins.height = res.board.height + config.get('boardMarginHeight');
  res.boardWithMargins.y = newTimeline * res.boardWithMargins.height;
  res.board.y = res.boardWithMargins.y + (config.get('boardMarginHeight') / 2);
  res.board.center.y = (res.board.y - res.board.height) / 2;
  res.boardWithMargins.center.y = res.boardWithMargins.y + (res.boardWithMargins.height / 2);
  
  //Adjust x coordinate from turn
  //Flip if necessary
  var newTurn = 0;
  if(config.get('boardFlipTurn')) {
    newTurn = -2 * (positionObj.turn - 1);
    if(positionObj.player === 'black') {
      newTurn -= 1;
    }
  }
  else {
    newTurn = 2 * (positionObj.turn - 1);
    if(positionObj.player === 'black') {
      newTurn += 1;
    }
  }

  //Get x coordinate from turn
  res.board.width = options.boardWidth * config.get('squareWidth');
  res.boardWithMargins.width = res.board.width + config.get('boardMarginWidth');
  res.boardWithMargins.x = newTurn * res.boardWithMargins.width;
  res.board.x = res.boardWithMargins.x + (config.get('boardMarginWidth') / 2);
  res.board.center.x = (res.board.x + res.board.width) / 2;
  res.boardWithMargins.center.x = res.boardWithMargins.x + (res.boardWithMargins.width / 2);
  
  //Adjust y coordinate from rank
  //Flip if necessary
  var newRank = 0;
  if(config.get('boardFlipRank')) {
    newRank = positionObj.rank - 1;
  }
  else {
    newRank = options.boardHeight - positionObj.rank;
  }

  //Get y coordinate from rank
  res.square.y = res.board.y + (newRank * config.get('squareHeight'));
  res.square.center.y = res.square.y + (res.square.height / 2);
  
  //Adjust x coordinate from file
  //Flip if necessary
  var newFile = 0;
  if(config.get('boardFlipFile')) {
    newFile = options.boardWidth - positionObj.file;
  }
  else {
    newFile = positionObj.file - 1;
  }

  //Get x coordinate from file
  res.square.x = res.board.x + (newFile * config.get('squareWidth'));
  res.square.center.x = res.square.x + (res.square.width / 2);

  return res;
}
exports.copy = (coordinates) => {
  return {
    board: {
      x: coordinates.board.x,
      y: coordinates.board.y,
      width: coordinates.board.width,
      height: coordinates.board.height,
      center: {
        x: coordinates.board.center.x,
        y: coordinates.board.center.y
      }
    },
    boardWithMargins: {
      x: coordinates.boardWithMargins.x,
      y: coordinates.boardWithMargins.y,
      width: coordinates.boardWithMargins.width,
      height: coordinates.boardWithMargins.height,
      center: {
        x: coordinates.boardWithMargins.center.x,
        y: coordinates.boardWithMargins.center.y
      }
    },
    square: {
      x: coordinates.square.x,
      y: coordinates.square.y,
      width: coordinates.square.width,
      height: coordinates.square.height,
      center: {
        x: coordinates.square.center.x,
        y: coordinates.square.center.y
      }
    }
  };
}