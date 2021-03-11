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
    if(this.global.board === null || typeof this.global.board === 'undefined') {
      return null;
    }

    if(this.global.config.get('viewport').drag) {
      this.viewport.drag({
        direction: this.global.config.get('viewport').dragDirection,
        pressDrag: this.global.config.get('viewport').dragPressDrag,
        wheel: this.global.config.get('viewport').dragWheel,
        wheelScroll: this.global.config.get('viewport').dragWheelScroll,
        clampWheel: this.global.config.get('viewport').dragClampWheel,
        underflow: this.global.config.get('viewport').dragUnderflow,
        factor: this.global.config.get('viewport').dragFactor,
        mouseButtons: this.global.config.get('viewport').dragMouseButtons,
      });
    }
    else { this.viewport.plugins.remove('drag'); }
    if(this.global.config.get('viewport').pinch) {
      this.viewport.pinch({
        noDrag: this.global.config.get('viewport').pinchNoDrag,
        percent: this.global.config.get('viewport').pinchPercent,
        factor: this.global.config.get('viewport').pinchFactor,
      });
    }
    else { this.viewport.plugins.remove('pinch'); }
    if(this.global.config.get('viewport').wheel) {
      this.viewport.wheel({
        percent: this.global.config.get('viewport').wheelPercent,
        smooth: this.global.config.get('viewport').wheelSmooth,
        reverse: this.global.config.get('viewport').wheelReverse,
      });
    }
    else { this.viewport.plugins.remove('wheel'); }
    if(this.global.config.get('viewport').decelerate) {
      this.viewport.decelerate({
        friction: this.global.config.get('viewport').decelerateFriction,
        bounce: this.global.config.get('viewport').decelerateBounce,
        minSpeed: this.global.config.get('viewport').decelerateMinSpeed,
      });
    }
    else { this.viewport.plugins.remove('decelerate'); }

    //Bounce and ClampZoom
    var worldBorders = positionFuncs.toWorldBorders(this.global);
    if(this.global.config.get('viewport').bounce) {
      var bounce = {
        friction: this.global.config.get('viewport').bounceFriction,
        time: this.global.config.get('viewport').bounceTime,
        ease: this.global.config.get('viewport').bounceEase,
      };
      if(worldBorders.width > worldBorders.height) {
        var newHeight = worldBorders.width * (this.global.app.renderer.height/this.global.app.renderer.width);
        bounce.bounceBox = {
          x: (worldBorders.x - (worldBorders.width / 2)),
          y: (worldBorders.y - (newHeight / 2)),
          width: worldBorders.width * 1.5,
          height: newHeight * 1.5,
        };
      }
      else {
        var newWidth = worldBorders.width * (this.global.app.renderer.width/this.global.app.renderer.height);
        bounce.bounceBox = {
          x: (worldBorders.x - (newWidth / 2)),
          y: (worldBorders.y - (worldBorders.height / 2)),
          width: newWidth * 1.5,
          height: worldBorders.height * 1.5,
        };
      }
      this.viewport.bounce(bounce);
    }
    else { this.viewport.plugins.remove('bounce'); }
    if(this.global.config.get('viewport').clampZoom) {
      var clamp = {};
      if(worldBorders.width > worldBorders.height) {
        clamp.maxWidth = worldBorders.width * this.global.config.get('viewport').clampZoomWidthFactor;
      }
      else {
        clamp.maxHeight = worldBorders.height * this.global.config.get('viewport').clampZoomHeightFactor;
      }
      clamp.minWidth = this.global.board.width * this.global.config.get('square').width;
      clamp.minHeight = this.global.board.height * this.global.config.get('square').height;
      this.viewport.clampZoom(clamp);
    }
    else { this.viewport.plugins.remove('clampZoom'); }
  }
  fullBoard(move = true, zoom = true) {
    var worldBorders = positionFuncs.toWorldBorders(this.global);
    if(move) {
      this.viewport.snap(worldBorders.center.x, worldBorders.center.y, {
        friction: this.global.config.get('viewport').snapFriction,
        time: this.global.config.get('viewport').snapTime,
        ease: this.global.config.get('viewport').snapEase,
        removeOnComplete: true,
        removeOnInterrupt: true,
      });
    }
    if(zoom) {
      if(worldBorders.height > worldBorders.width) {
        this.viewport.snapZoom({
          height: worldBorders.height,
          time: this.global.config.get('viewport').snapZoomTime,
          ease: this.global.config.get('viewport').snapZoomEase,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
      else {
        this.viewport.snapZoom({
          width: worldBorders.width,
          time: this.global.config.get('viewport').snapZoomTime,
          ease: this.global.config.get('viewport').snapZoomEase,
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
        friction: this.global.config.get('viewport').snapFriction,
        time: this.global.config.get('viewport').snapTime,
        ease: this.global.config.get('viewport').snapEase,
        removeOnComplete: true,
        removeOnInterrupt: true,
      });
    }
    if(zoom) {
      if(this.global.app.renderer.width > this.global.app.renderer.height) {
        this.viewport.snapZoom({
          height: maxCoords.boardWithMargins.height,
          time: this.global.config.get('viewport').snapZoomTime,
          ease: this.global.config.get('viewport').snapZoomEase,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
      else {
        this.viewport.snapZoom({
          width: maxCoords.boardWithMargins.width,
          time: this.global.config.get('viewport').snapZoomTime,
          ease: this.global.config.get('viewport').snapZoomEase,
          removeOnComplete: true,
          removeOnInterrupt: true,
        });
      }
    }
  }
  present(move = true, zoom = true) {
    var presentTimelines = this.global.board.timelines.filter(t => t.present);
    if(presentTimelines.length > 0) {
      //Calculate present
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
            friction: this.global.config.get('viewport').snapFriction,
            time: this.global.config.get('viewport').snapTime,
            ease: this.global.config.get('viewport').snapEase,
            removeOnComplete: true,
            removeOnInterrupt: true,
          });
        }
        if(zoom) {
          if(this.global.app.renderer.width > this.global.app.renderer.height) {
            this.viewport.snapZoom({
              height: maxCoords.boardWithMargins.height,
              time: this.global.config.get('viewport').snapZoomTime,
              ease: this.global.config.get('viewport').snapZoomEase,
              removeOnComplete: true,
              removeOnInterrupt: true,
            });
          }
          else {
            this.viewport.snapZoom({
              width: maxCoords.boardWithMargins.width,
              time: this.global.config.get('viewport').snapZoomTime,
              ease: this.global.config.get('viewport').snapZoomEase,
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
