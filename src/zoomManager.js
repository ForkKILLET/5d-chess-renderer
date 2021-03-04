const positionFuncs = require('@local/position');

class ZoomManager {
  constructor(global) {
    this.global = global;
    this.viewport = this.global.viewport;
    this.emitter = this.global.emitter;

    this.update();
    this.emitter.on('boardUpdate', this.update.bind(this));
    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
  }
  update() {
    if(this.global.board === null || typeof this.global.board === 'undefined') {
      return null;
    }

    //Check if world borders changed (clamp zoom and panning)
    var worldBorders = positionFuncs.toWorldBorders(this.global);
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
        clamp.maxWidth = this.worldBorders.width;
      }
      else {
        clamp.maxHeight = this.worldBorders.height;
      }
      clamp.minWidth = this.global.board.width * this.global.config.get('square').width;
      clamp.minHeight = this.global.board.height * this.global.config.get('square').height;
      this.viewport.clampZoom(clamp);
    }
  }
  zoomFullBoard(move = true, zoom = true) {
    if(move) {
      this.viewport.snap(this.worldBorders.center.x, this.worldBorders.center.y, { removeOnComplete: true, removeOnInterrupt: true });
    }
    if(zoom) {
      if(this.viewport.screenHeight < this.viewport.screenWidth) {
        this.viewport.snapZoom({ height: this.worldBorders.height, removeOnComplete: true, removeOnInterrupt: true });
      }
      else {
        this.viewport.snapZoom({ width: this.worldBorders.width, removeOnComplete: true, removeOnInterrupt: true });
      }
    }
  }
  zoomPresent(move = true, zoom = true) {
    var presentTimelines = this.global.board.timelines.filter(t => t.present);
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
        var maxCoords = positionFuncs.toCoordinates({
          timeline: presentTimeline.timeline,
          turn: maxTurn,
          player: maxTurnPlayer,
          coordinate: 'a1',
          rank: 1,
          file: 1
        }, this.global);
        if(move) {
          this.viewport.snap(maxCoords.boardWithMargins.center.x, maxCoords.boardWithMargins.center.y, { removeOnComplete: true, removeOnInterrupt: true });
        }
        if(zoom) {
          if(this.viewport.screenHeight < this.viewport.screenWidth) {
            this.viewport.snapZoom({ height: maxCoords.boardWithMargins.height, removeOnComplete: true, removeOnInterrupt: true });
          }
          else {
            this.viewport.snapZoom({ width: maxCoords.boardWithMargins.width, removeOnComplete: true, removeOnInterrupt: true });
          }
        }
      }
    }
  }
}

module.exports = ZoomManager;
