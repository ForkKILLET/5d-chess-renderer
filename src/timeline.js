const PIXI = require('pixi.js-legacy');

class Timeline {
  constructor(layer, emitter, coordinateOptions, timelineObject = null) {
    this.layer = layer;
    this.emitter = emitter;
    this.coordinateOptions = coordinateOptions;
    this.timelineObject = {};
    if(timelineObject !== null) {
      this.update(timelineObject);
    }
    this.turns = [];
  }
  refresh() {
    this.destroy();
    this.updateBoard(this.timelineObject);
  }
  update(timelineObject) {
    this.timelineObject = timelineObject;
  
    //Looking in internal turns object to see if they still exist
    for(var i = 0;i < this.turns.length;i++) {
      var found = false;
      for(var j = 0;j < this.timelineObject.turns.length;j++) {
        if(
          this.turns[i].turnObject.turn === this.timelineObject.turns[j].turn &&
          this.turns[i].turnObject.player === this.timelineObject.turns[j].player
        ) {
          found = true;
          this.turns[i].update(this.timelineObject.turns[j]);
        }
      }
      if(!found) {
        this.turns[i].destroy();
        this.turns.splice(i, 1);
        i--;
      }
    }
    //Looking in new timeline object for new turns to create
    for(var j = 0;j < this.timelineObject.turns.length;j++) {
      var found = false;
      for(var i = 0;i < this.turns.length;i++) {
        if(
          this.turns[i].turnObject.turn === this.timelineObject.turns[j].turn &&
          this.turns[i].turnObject.player === this.timelineObject.turns[j].player
        ) {
          found = true;
        }
      }
      if(!found) {
        this.turns.push(new Turn(this.layer, this.emitter, this.timelineObject.turns[j]));
      }
    }
  }
  destroy() {
    for(var i = 0;i < this.turns.length;i++) {
      this.turns[i].destroy();
      this.turns.splice(i, 1);
      i--;
    }
    this.turns = [];
  }
}

module.exports = Timeline;