const positionFuncs = require('@local/position');

class ZoomManager {
  constructor(global) {
    this.global = global;
    this.viewport = this.global.viewport;
    this.emitter = this.global.emitter;

    this.update();
    this.emitter.on('boardUpdate', this.update.bind(this));
    this.emitter.on('configUpdate', this.update.bind(this));
  }
  update() {
    if(this.global.boardObject === null || typeof this.global.boardObject === 'undefined') {
      return null;
    }

    if(this.global.configStore.get('viewport').drag) {
      this.viewport.drag(this.global.configStore.get('viewport').dragOptions);
    }
    else { this.viewport.plugins.remove('drag'); }
    if(this.global.configStore.get('viewport').pinch) {
      this.viewport.pinch(this.global.configStore.get('viewport').pinchOptions);
    }
    else { this.viewport.plugins.remove('pinch'); }
    if(this.global.configStore.get('viewport').wheel) {
      this.viewport.wheel(this.global.configStore.get('viewport').wheelOptions);
    }
    else { this.viewport.plugins.remove('wheel'); }
    if(this.global.configStore.get('viewport').decelerate) {
      this.viewport.decelerate(this.global.configStore.get('viewport').decelerateOptions);
    }
    else { this.viewport.plugins.remove('decelerate'); }

    //Bounce and Clamp Zoom
    var worldBorders = positionFuncs.toWorldBorders(this.global);
    if(this.global.configStore.get('viewport').bounce) {
      var bounce = this.global.configStore.get('viewport').bounceOptions;
      var heightFactor = this.global.configStore.get('viewport').bounceHeightFactor;
      var widthFactor = this.global.configStore.get('viewport').bounceWidthFactor;
      if(worldBorders.width > worldBorders.height) {
        var newHeight = worldBorders.width * (this.global.app.renderer.height/this.global.app.renderer.width);
        bounce.bounceBox = {
          x: worldBorders.x - (worldBorders.width * (1 - widthFactor)),
          y: worldBorders.y - (newHeight * (1 - heightFactor)),
          width: worldBorders.width + (worldBorders.width * (1 - widthFactor)),
          height: worldBorders.height + (newHeight * (1 - heightFactor)),
        };
      }
      else {
        var newWidth = worldBorders.height * (this.global.app.renderer.width/this.global.app.renderer.height);
        bounce.bounceBox = {
          x: worldBorders.x - (newWidth * (1 - widthFactor)),
          y: worldBorders.y - (worldBorders.height * (1 - heightFactor)),
          width: worldBorders.width + (newWidth * (1 - widthFactor)),
          height: worldBorders.height + (worldBorders.height * (1 - heightFactor)),
        };
      }
      this.viewport.bounce(bounce);
    }
    else { this.viewport.plugins.remove('bounce'); }
    if(this.global.configStore.get('viewport').clampZoom) {
      var clamp = {};
      if(worldBorders.width > worldBorders.height) {
        clamp.maxWidth = worldBorders.width * this.global.configStore.get('viewport').clampZoomWidthFactor;
      }
      else {
        clamp.maxHeight = worldBorders.height * this.global.configStore.get('viewport').clampZoomHeightFactor;
      }
      clamp.minWidth = this.global.boardObject.width * this.global.configStore.get('square').width;
      clamp.minHeight = this.global.boardObject.height * this.global.configStore.get('square').height;
      this.viewport.clampZoom(clamp);
    }
    else { this.viewport.plugins.remove('clampZoom'); }
  }
  fullBoard(move = true, zoom = true) {
    var worldBorders = positionFuncs.toWorldBorders(this.global);
    if(move) {
      this.viewport.snap(worldBorders.center.x, worldBorders.center.y, {
        friction: this.global.configStore.get('viewport').snapOptions.friction,
        time: this.global.configStore.get('viewport').snapOptions.time,
        ease: this.global.configStore.get('viewport').snapOptions.ease,
        removeOnComplete: true,
        removeOnInterrupt: true,
      });
    }
    if(zoom) {
      if(worldBorders.height > worldBorders.width || (worldBorders.height === worldBorders.width && this.global.app.renderer.width > this.global.app.renderer.height)) {
        this.viewport.snapZoom({
          height: worldBorders.height,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
      else {
        this.viewport.snapZoom({
          width: worldBorders.width,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
    }
  }
  board(timeline, turn, player, move = true, zoom = true) {
    var maxCoords = positionFuncs.toCoordinates({
      timeline: timeline,
      turn: turn,
      player: player,
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    if(move) {
      this.viewport.snap(maxCoords.boardWithMargins.center.x, maxCoords.boardWithMargins.center.y, {
        friction: this.global.configStore.get('viewport').snapOptions.friction,
        time: this.global.configStore.get('viewport').snapOptions.time,
        ease: this.global.configStore.get('viewport').snapOptions.ease,
        removeOnComplete: true,
        removeOnInterrupt: true,
      });
    }
    if(zoom) {
      if(this.global.app.renderer.width > this.global.app.renderer.height) {
        this.viewport.snapZoom({
          height: maxCoords.boardWithMargins.height,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
      else {
        this.viewport.snapZoom({
          width: maxCoords.boardWithMargins.width,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
    }
  }
  present(move = true, zoom = true) {
    var presentTimelines = this.global.boardObject.timelines.filter(t => t.present);
    if(presentTimelines.length > 0) {
      //Calculate present
      var presentTimeline = presentTimelines[0];
      var maxTurn = Number.NEGATIVE_INFINITY;
      var maxTurnPlayer = 'white';
      var maxTurnIndex = -1;
      for(var i = 0;i < presentTimeline.turns.length;i++) {
        if(!presentTimeline.turns[i].ghost) {
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
      }

      //Snapping
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
          this.viewport.snap(maxCoords.boardWithMargins.center.x, maxCoords.boardWithMargins.center.y, {
            friction: this.global.configStore.get('viewport').snapOptions.friction,
            time: this.global.configStore.get('viewport').snapOptions.time,
            ease: this.global.configStore.get('viewport').snapOptions.ease,
            removeOnComplete: true,
            removeOnInterrupt: true,
          });
        }
        if(zoom) {
          if(this.global.app.renderer.width > this.global.app.renderer.height) {
            this.viewport.snapZoom({
              height: maxCoords.boardWithMargins.height,
              time: this.global.configStore.get('viewport').snapZoomOptions.time,
              ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
              removeOnComplete: true,
              removeOnInterrupt: true,
            });
          }
          else {
            this.viewport.snapZoom({
              width: maxCoords.boardWithMargins.width,
              time: this.global.configStore.get('viewport').snapZoomOptions.time,
              ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
              removeOnComplete: true,
              removeOnInterrupt: true,
            });
          }
        }
      }
    }
  }
}

module.exports = ZoomManager;
