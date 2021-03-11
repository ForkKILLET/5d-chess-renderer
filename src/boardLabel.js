const utilsFuncs = require('@local/utils');
const positionFuncs = require('@local/position');

const Label = require('@local/label');

class BoardLabel {
  constructor(global, turnObject = null) {
    this.global = global;
    this.emitter = this.global.emitter;
    this.timelineLabel;
    this.turnLabel;
    this.fileLabels = [];
    this.rankLabels = [];
    if(turnObject !== null) {
      this.update(turnObject);
    }
  }
  refresh() {
    this.update(this.turnObject);
  }
  update(turnObject) {
    //Assign pieceObj to instance variables
    this.turnObject = turnObject;

    var coordinates = positionFuncs.toCoordinates({
      timeline: this.turnObject.timeline,
      turn: this.turnObject.turn,
      player: this.turnObject.player,
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    //Load and animate board labels if needed
    if(
      positionFuncs.compare(coordinates, this.coordinates) !== 0 ||
      this.showSpatial !== this.global.config.get('boardLabel').showSpatial ||
      this.showNonSpatial !== this.global.config.get('boardLabel').showNonSpatial ||
      this.showMiddleTimeline !== this.global.config.get('boardLabel').showMiddleTimeline
    ) {
      this.coordinates = coordinates;
      this.showSpatial = this.global.config.get('boardLabel').showSpatial;
      this.showNonSpatial = this.global.config.get('boardLabel').showNonSpatial;
      this.showMiddleTimeline = this.global.config.get('boardLabel').showMiddleTimeline;
  
      //Calulate if is middle turn
      var show = true;
      try {
        var currTimeline = this.global.board.timelines.filter(t => t.timeline === this.turnObject.timeline)[0];
        var minTurn = Number.POSITIVE_INFINITY;
        var minPlayer = 'black';
        for(var i = 0;i < currTimeline.turns.length;i++) {
          if(minTurn > currTimeline.turns[i].turn) {
            minTurn = currTimeline.turns[i].turn;
            minPlayer = currTimeline.turns[i].player;
          }
          if(
            minTurn === currTimeline.turns[i].turn &&
            minPlayer === 'black' &&
            currTimeline.turns[i].player === 'white'
          ) {
            minTurn = currTimeline.turns[i].turn;
            minPlayer = currTimeline.turns[i].player;
          }
        }
        if(!this.showMiddleTimeline && !(this.turnObject.turn === minTurn && this.turnObject.player === minPlayer)) {
          show = false;
        }
      }
      catch(err) {}

      //Create or update timeline / turn label
      var labelObject = {
        timeline: this.turnObject.timeline,
        turn: this.turnObject.turn,
        player: this.turnObject.player,
        coordinate: 'a1',
        rank: 1,
        file: 1
      };
      labelObject.type = 'timeline';
      if(typeof this.timelineLabel !== 'undefined') {
        if(!this.showNonSpatial || !show) {
          this.timelineLabel.destroy();
          this.timelineLabel = undefined;
        }
        else {
          this.timelineLabel.update(labelObject);
        }
      }
      else if(this.showNonSpatial && show) {
        this.timelineLabel = new Label(this.global, labelObject);
      }
      labelObject.type = 'turn';
      if(typeof this.turnLabel !== 'undefined') {
        if(!this.showNonSpatial) {
          this.turnLabel.destroy();
          this.turnLabel = undefined;
        }
        else {
          this.turnLabel.update(labelObject);
        }
      }
      else if(this.showNonSpatial) {
        this.turnLabel = new Label(this.global, labelObject);
      }

      //Creating new file array
      var files = [];
      for(var f = 0;f < this.global.board.width;f++) {
        var rank = 1;
        var file = f + 1;
        var coordinates = ['a','b','c','d','e','f','g','h'][f] + rank;
        var labelObject = {
          type: 'file',
          timeline: this.turnObject.timeline,
          turn: this.turnObject.turn,
          player: this.turnObject.player,
          coordinate: coordinates,
          rank: rank,
          file: file
        };
        var key = utilsFuncs.squareObjectKey(labelObject);
        files.push({
          key: key,
          labelObject: labelObject
        });
      }
      if(!this.showSpatial) { files = []; }
      //Looking in internal file object to see if they still exist
      for(var i = 0;i < this.fileLabels.length;i++) {
        var found = false;
        for(var j = 0;j < files.length;j++) {
          if(this.fileLabels[i].key === files[j].key) {
            found = true;
            this.fileLabels[i].update(files[j].labelObject);
          }
        }
        if(!found) {
          this.file[i].destroy();
          this.file.splice(i, 1);
          i--;
        }
      }
      //Looking in new file array for new file to create
      for(var j = 0;j < files.length;j++) {
        for(var i = 0;i < this.fileLabels.length;i++) {
          if(this.fileLabels[i].key === files[j].key) {
            found = true;
          }
        }
        if(!found) {
          this.fileLabels.push(new Label(this.global, files[j].labelObject));
        }
      }
      
      //Creating new rank array
      var ranks = [];
      for(var r = 0;r < this.global.board.height;r++) {
        var rank = r + 1;
        var file = 1;
        var coordinates = 'a' + rank;
        var labelObject = {
          type: 'rank',
          timeline: this.turnObject.timeline,
          turn: this.turnObject.turn,
          player: this.turnObject.player,
          coordinate: coordinates,
          rank: rank,
          file: file
        };
        var key = utilsFuncs.squareObjectKey(labelObject);
        ranks.push({
          key: key,
          labelObject: labelObject
        });
      }
      if(!this.showSpatial) { ranks = []; }
      //Looking in internal rank object to see if they still exist
      for(var i = 0;i < this.rankLabels.length;i++) {
        var found = false;
        for(var j = 0;j < ranks.length;j++) {
          if(this.rankLabels[i].key === ranks[j].key) {
            found = true;
            this.rankLabels[i].update(ranks[j].labelObject);
          }
        }
        if(!found) {
          this.rankLabels[i].destroy();
          this.rankLabels.splice(i, 1);
          i--;
        }
      }
      //Looking in new rank array for new rank to create
      for(var j = 0;j < ranks.length;j++) {
        for(var i = 0;i < this.rankLabels.length;i++) {
          if(this.rankLabels[i].key === ranks[j].key) {
            found = true;
          }
        }
        if(!found) {
          this.rankLabels.push(new Label(this.global, ranks[j].labelObject));
        }
      }
    }
  }
  destroy() {
    //Calling destroy on children
    if(typeof this.timelineLabel !== 'undefined') {
      this.timelineLabel.destroy();
    }
    if(typeof this.turnLabel !== 'undefined') {
      this.turnLabel.destroy();
    }
    for(var i = 0;i < this.fileLabels.length;i++) {
      this.fileLabels[i].destroy();
      this.fileLabels.splice(i, 1);
      i--;
    }
    for(var i = 0;i < this.rankLabels.length;i++) {
      this.rankLabels[i].destroy();
      this.rankLabels.splice(i, 1);
      i--;
    }
  }
}

module.exports = BoardLabel;
