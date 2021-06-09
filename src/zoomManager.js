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
    var coordinates = positionFuncs.toCoordinates({
      timeline: 0,
      turn: 1,
      player: 'white',
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    var boardWidth = coordinates.boardWithMargins.width;
    var boardHeight = coordinates.boardWithMargins.height;
    if(this.global.configStore.get('viewport').bounce) {
      var bounce = this.global.configStore.get('viewport').bounceOptions;
      var heightFactor = this.global.configStore.get('viewport').bounceHeightFactor;
      var widthFactor = this.global.configStore.get('viewport').bounceWidthFactor;
      var newHeight = worldBorders.width * (this.global.app.renderer.height/this.global.app.renderer.width);
      var newWidth = worldBorders.height * (this.global.app.renderer.width/this.global.app.renderer.height);
      bounce.bounceBox = {
        width: worldBorders.width + (newWidth * (1 - widthFactor)),
        height: worldBorders.height + (newHeight * (1 - heightFactor)),
      };
      if(bounce.bounceBox.width < boardWidth * 5) {
        bounce.bounceBox.width = boardWidth * 5;
      }
      if(bounce.bounceBox.height < boardHeight * 5) {
        bounce.bounceBox.height = boardHeight * 5;
      }
      bounce.bounceBox.x = worldBorders.center.x - (bounce.bounceBox.width / 2);
      bounce.bounceBox.y = worldBorders.center.y - (bounce.bounceBox.height / 2);
      this.viewport.bounce(bounce);
    }
    else { this.viewport.plugins.remove('bounce'); }
    if(this.global.configStore.get('viewport').clampZoom) {
      var clamp = {};
      if(worldBorders.width > worldBorders.height) {
        clamp.maxWidth = worldBorders.width * this.global.configStore.get('viewport').clampZoomWidthFactor;
        if(clamp.maxWidth < boardWidth * 5) {
          clamp.maxWidth = boardWidth * 5;
        }
      }
      else {
        clamp.maxHeight = worldBorders.height * this.global.configStore.get('viewport').clampZoomHeightFactor;
        if(clamp.maxHeight < boardHeight * 5) {
          clamp.maxHeight = boardHeight * 5;
        }
      }
      clamp.minWidth = this.global.boardObject.width * this.global.configStore.get('square').width;
      clamp.minHeight = this.global.boardObject.height * this.global.configStore.get('square').height;
      this.viewport.clampZoom(clamp);
    }
    else { this.viewport.plugins.remove('clampZoom'); }
  }
  fullBoard(move = true, zoom = true, offset = null) {
    var worldBorders = positionFuncs.toWorldBorders(this.global);
    if(offset !== null) {
      var coordinates = positionFuncs.toCoordinates({
        timeline: 0,
        turn: 1,
        player: 'white',
        coordinate: 'a1',
        rank: 1,
        file: 1
      }, this.global);
      var boardWidth = coordinates.boardWithMargins.width;
      var boardHeight = coordinates.boardWithMargins.height;
      worldBorders.x += boardWidth * offset.x;
      worldBorders.y += boardHeight * offset.y;
      worldBorders.width += boardWidth * offset.width;
      worldBorders.height += boardHeight * offset.height;
      worldBorders.center.x = worldBorders.x + (worldBorders.width / 2);
      worldBorders.center.y = worldBorders.y + (worldBorders.height / 2);
    }
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
          height: typeof zoom === 'number' ? zoom * worldBorders.height : worldBorders.height,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
      else {
        this.viewport.snapZoom({
          width: typeof zoom === 'number' ? zoom * worldBorders.width : worldBorders.width,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
    }
    this.update();
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
          height: typeof zoom === 'number' ? zoom * maxCoords.boardWithMargins.height : maxCoords.boardWithMargins.height,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
      else {
        this.viewport.snapZoom({
          width: typeof zoom === 'number' ? zoom * maxCoords.boardWithMargins.width : maxCoords.boardWithMargins.width,
          time: this.global.configStore.get('viewport').snapZoomOptions.time,
          ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
    }
    this.update();
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
              height: typeof zoom === 'number' ? zoom * maxCoords.boardWithMargins.height : maxCoords.boardWithMargins.height,
              time: this.global.configStore.get('viewport').snapZoomOptions.time,
              ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
              removeOnComplete: true,
              removeOnInterrupt: true,
            });
          }
          else {
            this.viewport.snapZoom({
              width: typeof zoom === 'number' ? zoom * maxCoords.boardWithMargins.width : maxCoords.boardWithMargins.width,
              time: this.global.configStore.get('viewport').snapZoomOptions.time,
              ease: this.global.configStore.get('viewport').snapZoomOptions.ease,
              removeOnComplete: true,
              removeOnInterrupt: true,
            });
          }
        }
      }
      this.update();
    }
  }
}

module.exports = ZoomManager;
