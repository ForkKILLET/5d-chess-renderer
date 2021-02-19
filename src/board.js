const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');

const Timeline = require('@local/timeline');

class Board {
  constructor(viewport, emitter, boardObject = null) {
    this.viewport = viewport;
    this.layers = layerFuncs.layers;
    layerFuncs.addLayers(this.viewport);
    this.emitter = emitter;
    this.boardObject = {};
    this.timelines = [];
    if(boardObject !== null) {
      this.update(boardObject);
    }
  }
  refresh() {
    for(var i = 0;i < this.timelines.length;i++) {
      this.timelines[i].refresh();
    }
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
      twoTimeline !== positionFuncs.coordinateOptions.twoTimeline ||
      this.boardObject.width !== positionFuncs.coordinateOptions.boardWidth ||
      this.boardObject.height !== positionFuncs.coordinateOptions.boardHeight
    ) {
      this.destroy();
      positionFuncs.set({
        boardWidth: this.boardObject.width,
        boardHeight: this.boardObject.height,
        twoTimeline: twoTimeline
      });
    }
    
    //Check if world borders changed (clamp zoom and panning)
    var worldBorders = positionFuncs.toWorldBorders(this.boardObject);
    if(positionFuncs.compareWorldBorders(worldBorders, this.worldBorders) !== 0) {
      this.worldBorders = worldBorders;
      this.viewport.worldWidth = this.worldBorders.x + this.worldBorders.width;
      this.viewport.worldHeight = this.worldBorders.y + this.worldBorders.height;
      this.viewport.bounce({
        bounceBox: {
          x: this.worldBorders.x - (this.worldBorders.width / 2),
          y: this.worldBorders.y - (this.worldBorders.height / 2),
          width: this.worldBorders.width * 1.5,
          height: this.worldBorders.height * 1.5
        }
      });
      var clamp = {};
      if(this.worldBorders.width > this.worldBorders.height) {
        clamp.maxWidth = this.worldBorders.width + config.get('squareWidth');
      }
      else {
        clamp.maxHeight = this.worldBorders.height * config.get('squareHeight');
      }
      clamp.minWidth = positionFuncs.coordinateOptions.boardWidth * config.get('squareWidth');
      clamp.minHeight = positionFuncs.coordinateOptions.boardHeight * config.get('squareHeight');
      this.viewport.clampZoom(clamp);
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
    var delay = 0;
    for(var j = 0;j < this.boardObject.timelines.length;j++) {
      var found = false;
      for(var i = 0;i < this.timelines.length;i++) {
        if(this.timelines[i].timelineObject.timeline === this.boardObject.timelines[j].timeline) {
          found = true;
        }
      }
      if(!found) {
        this.timelines.push(new Timeline(this.emitter, this.boardObject.timelines[j], delay));
        delay += config.get('timelineRippleDuration');
      }
    }
  }
  zoomFullBoard(move = true, zoom = true) {
    if(move) {
      this.viewport.snap(this.worldBorders.center.x, this.worldBorders.center.y, { removeOnComplete: true, removeOnInterrupt: true });
    }
    if(zoom) {
      if(this.viewport.screenHeight > this.viewport.screenWidth) {
        this.viewport.snapZoom({ height: this.worldBorders.height, removeOnComplete: true, removeOnInterrupt: true });
      }
      else {
        this.viewport.snapZoom({ width: this.worldBorders.width, removeOnComplete: true, removeOnInterrupt: true });
      }
    }
  }
  zoomPresent(move = true, zoom = true) {
    var presentTimelines = this.boardObject.timelines.filter(t => t.present);
    if(presentTimelines.length > 0) {
      var presentTimeline = presentTimelines[0];
      var maxTurn = Number.NEGATIVE_INFINITY;
      var maxTurnPlayer = 'white';
      var maxTurnIndex = -1;
      for(var i = 0;i < presentTimeline.turns.length;i++) {
        if(maxTurn < presentTimeline.turns[i].turn) {
          maxTurn = presentTimeline.turns[i].turn;
          maxTurnPlayer = presentTimeline.turns[i].player;
          maxTurnIndex = i;
        }
        if(maxTurn === presentTimeline.turns[i].turn && maxTurnPlayer === 'white' && presentTimeline.turns[i].player === 'black') {
          maxTurnPlayer = presentTimeline.turns[i].player;
          maxTurnIndex = i;
        }
      }
      if(maxTurnIndex >= 0) {
        var maxCoords = this.toCoordinates({
          timeline: presentTimeline.timeline,
          turn: maxTurn,
          player: maxTurnPlayer,
          coordinate: 'a1',
          rank: 1,
          file: 1
        });
        if(move) {
          this.viewport.snap(maxCoords.boardWithMargins.center.x, maxCoords.boardWithMargins.center.y, { removeOnComplete: true, removeOnInterrupt: true });
        }
        if(zoom) {
          if(this.viewport.screenHeight > this.viewport.screenWidth) {
            this.viewport.snapZoom({ width: maxCoords.boardWithMargins.width, removeOnComplete: true, removeOnInterrupt: true });
          }
          else {
            this.viewport.snapZoom({ height: maxCoords.boardWithMargins.height, removeOnComplete: true, removeOnInterrupt: true });
          }
        }
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