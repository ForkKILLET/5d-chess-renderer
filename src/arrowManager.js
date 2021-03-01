const StraightArrow = require('@local/straightArrow');
const CurvedArrow = require('@local/curvedArrow');

class ArrowManager {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;

    this.actionHistoryArrows = [];
    this.moveBufferArrows = [];
    this.checkArrows = [];

    this.emitter.on('actionHistoryUpdate', this.updateActionHistory.bind(this));
    this.emitter.on('moveBufferUpdate', this.updateMoveBuffer.bind(this));
    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
  }
  isSpatial(move) {
    if(move.start.timeline !== move.end.timeline) { return false; }
    if(move.start.turn !== move.end.turn) { return false; }
    if(move.start.player !== move.end.player) { return false; }
    return true;
  }
  update() {
    this.updateActionHistory();
    this.updateMoveBuffer();
  }
  updateActionHistory() {
    //Grab latest moves from action history
    var actionHistoryMoves = [];
    for(var i = 0;i < this.global.actionHistory.length;i++) {
      var currAction = this.global.actionHistory[i];
      for(var j = 0;j < currAction.moves.length;j++) {
        actionHistoryMoves.push(currAction.moves[j]);
      }
    }

    //Cull all extra arrows
    for(var i = actionHistoryMoves.length - 1;i < this.actionHistoryArrows.length;i++) {
      this.actionHistoryArrows[i].destroy();
      this.actionHistoryArrows.splice(i, 1);
      i--;
    }

    //Update arrows
    for(var i = 0;i < actionHistoryMoves.length;i++) {
      var currMove = actionHistoryMoves[i];
      var res = null;
      var isCurved = false;
      if(this.isSpatial(actionHistoryMoves[i])) {
        isCurved = this.global.config.get('arrow').spatialCurved;
        if(this.global.config.get('arrow').spatialShow) {
          if(this.global.config.get('arrow').spatialMiddle) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: currMove.end,
              end: currMove.realEnd,
            };
          }
          else if(this.global.config.get('arrow').spatialRealEnd) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.realEnd,
            };
          }
          else {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.end,
            };
          }
        }
      }
      else {
        isCurved = this.global.config.get('arrow').nonSpatialCurved;
        if(this.global.config.get('arrow').nonSpatialShow) {
          if(this.global.config.get('arrow').nonSpatialMiddle) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: currMove.end,
              end: currMove.realEnd,
            };
          }
          else if(this.global.config.get('arrow').nonSpatialRealEnd) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.realEnd,
            };
          }
          else {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.end,
            };
          }
        }
      }
      if(typeof this.actionHistoryArrows[i] === 'undefined') {
        if(res !== null) {
          if(isCurved) {
            this.actionHistoryArrows[i] = new CurvedArrow(this.global, res);
          }
          else {
            this.actionHistoryArrows[i] = new StraightArrow(this.global, res);
          }
        }
      }
      else {
        if(res === null) {
          this.actionHistoryArrows[i].destroy();
        }
        else {
          if(isCurved && this.actionHistoryArrows[i] instanceof StraightArrow) {
            this.actionHistoryArrows[i].destroy();
            this.actionHistoryArrows.splice(i, 1, new CurvedArrow(this.global, res));
          }
          else if(!isCurved && this.actionHistoryArrows[i] instanceof CurvedArrow) {
            this.actionHistoryArrows[i].destroy();
            this.actionHistoryArrows.splice(i, 1, new StraightArrow(this.global, res));
          }
          else {
            this.actionHistoryArrows[i].update(res);
          }
        }
      }
    }
  }
  updateMoveBuffer() {
    //Grab latest moves from move buffer
    var moveBuffer = this.global.moveBuffer;

    //Cull all extra arrows
    for(var i = moveBuffer.length - 1;i >= 0 && i < this.moveBufferArrows.length;i++) {
      this.moveBufferArrows[i].destroy();
      this.moveBufferArrows.splice(i, 1);
      i--;
    }

    //Update arrows
    for(var i = 0;i < moveBuffer.length;i++) {
      var currMove = moveBuffer[i];
      var res = null;
      var isCurved = false;
      if(this.isSpatial(moveBuffer[i])) {
        isCurved = this.global.config.get('arrow').spatialCurved;
        if(this.global.config.get('arrow').spatialShow) {
          if(this.global.config.get('arrow').spatialMiddle) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: currMove.end,
              end: currMove.realEnd,
            };
          }
          else if(this.global.config.get('arrow').spatialRealEnd) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.realEnd,
            };
          }
          else {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.end,
            };
          }
        }
      }
      else {
        isCurved = this.global.config.get('arrow').nonSpatialCurved;
        if(this.global.config.get('arrow').nonSpatialShow) {
          if(this.global.config.get('arrow').nonSpatialMiddle) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: currMove.end,
              end: currMove.realEnd,
            };
          }
          else if(this.global.config.get('arrow').nonSpatialRealEnd) {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.realEnd,
            };
          }
          else {
            res = {
              type: 'move',
              start: currMove.start,
              middle: null,
              end: currMove.end,
            };
          }
        }
      }
      if(typeof this.moveBufferArrows[i] === 'undefined') {
        if(res !== null) {
          if(isCurved) {
            this.moveBufferArrows[i] = new CurvedArrow(this.global, res);
          }
          else {
            this.moveBufferArrows[i] = new StraightArrow(this.global, res);
          }
        }
      }
      else {
        if(res === null) {
          this.moveBufferArrows[i].destroy();
        }
        else {
          if(isCurved && this.moveBufferArrows[i] instanceof StraightArrow) {
            this.moveBufferArrows[i].destroy();
            this.moveBufferArrows.splice(i, 1, new CurvedArrow(this.global, res));
          }
          else if(!isCurved && this.moveBufferArrows[i] instanceof CurvedArrow) {
            this.moveBufferArrows[i].destroy();
            this.moveBufferArrows.splice(i, 1, new StraightArrow(this.global, res));
          }
        }
      }
    }
  }
}

module.exports = ArrowManager;
