const PIXI = require('pixi.js-legacy');

const Timeline = require('@local/timeline');

class Board {
  constructor(layer, emitter, boardObject = null) {
    this.layer = layer;
    this.emitter = emitter;
    this.coordinateOptions = {
      boardWidth: 8,
      boardHeight: 8,
      twoTimeline: false
    };
    this.boardObject = {};
    if(boardObject !== null) {
      this.update(boardObject);
    }
    this.timelines = [];
  }
  refresh() {
    this.destroy();
    this.updateBoard(this.boardObject);
  }
  update(boardObject) {
    this.boardObject = boardObject;

    //Check if coordinate options have changed (clear internal timeline object if changed)
    var twoTimeline = true;
    for(var j = 0;j < this.boardObject.timelines.length;j++) {
      if(this.boardObject.timelines[j].timeline === 0) {
        twoTimeline = false;
      }
    }
    if(
      twoTimeline !== this.coordinateOptions.twoTimeline ||
      this.boardObject.width !== this.coordinateOptions.width ||
      this.boardObject.height !== this.coordinateOptions.height
    ) {
      this.destroy();
      this.coordinateOptions = {
        boardWidth: this.boardObject.width,
        boardHeight: this.boardObject.height,
        twoTimeline: twoTimeline
      };
    }
    
    //Looking in internal timelines object to see if they still exist
    for(var i = 0;i < this.timelines.length;i++) {
      var found = false;
      for(var j = 0;j < this.boardObject.timelines.length;j++) {
        if(this.timelines[i].timelineObject.timeline === this.boardObject.timelines[j].timeline) {
          found = true;
          this.timelines[i].update(this.boardObject.timelines[j]);
        }
      }
      if(!found) {
        this.timelines[i].destroy();
        this.timelines.splice(i, 1);
        i--;
      }
    }
    //Looking in new board object for new timelines to create
    for(var j = 0;j < this.boardObject.timelines.length;j++) {
      var found = false;
      for(var i = 0;i < this.timelines.length;i++) {
        if(this.timelines[i].timelineObject.timeline === this.boardObject.timelines[j].timeline) {
          found = true;
        }
      }
      if(!found) {
        this.timelines.push(new Timeline(this.layer, this.emitter, this.coordinateOptions, this.boardObject.timelines[j]));
      }
    }
  }
  destroy() {
    for(var i = 0;i < this.timelines.length;i++) {
      this.timelines[i].destroy();
      this.timelines.splice(i, 1);
      i--;
    }
    this.timelines = [];
  }
}

module.exports = Board;