const { Bezier } = require('bezier-js');

const positionFuncs = require('@local/position');
const deepcopy = require('deepcopy');

class CurvedArrow {
  /*
    Arrow Object:
      - type - string ('move' or 'check') or number for custom
      - start - pos obj
      - middle - null or pos obj
      - end - pos obj
  */
  constructor(global, arrowObject = null) {
    this.global = global;
    if(arrowObject !== null) {
      this.update(arrowObject);
    }
  }
  update(arrowObject) {
    this.arrowObject = arrowObject;
    this.layer = typeof this.arrowObject.type === 'string' ? this.global.layers.layers.moveArrows : this.global.layers.layers.customArrows;
    this.color = typeof this.arrowObject.type === 'string' ? this.global.palette.get('arrow')[this.arrowObject.type] : this.arrowObject.type;
    this.outlineColor = typeof this.arrowObject.type === 'string' ? this.global.palette.get('arrow')[`${this.arrowObject.type}Outline`] : 0x000000;
    var hasMiddle = this.arrowObject.middle !== null;
    var startCoordinates = positionFuncs.toCoordinates(this.arrowObject.start, this.global);
    var endCoordinates = positionFuncs.toCoordinates(this.arrowObject.end, this.global);

    //Update only if needed
    if(
      hasMiddle !== this.hasMiddle ||
      positionFuncs.compare(startCoordinates, this.startCoordinates) !== 0 ||
      positionFuncs.compare(endCoordinates, this.endCoordinates) !== 0 ||
      this.lutInterval !== this.global.config.get('arrow').lutInterval ||
      this.alpha !== this.global.config.get('arrow').alpha ||
      typeof this.graphics === 'undefined'
    ) {
      if(typeof this.graphics !== 'undefined') {
        this.destroy();
      }
      this.hasMiddle = hasMiddle;
      this.startCoordinates = startCoordinates;
      this.endCoordinates = endCoordinates;
      this.lutInterval = this.global.config.get('arrow').lutInterval;
      this.alpha = this.global.config.get('arrow').alpha;
      //Generate middle
      if(this.hasMiddle) {
        this.middleCoordinates = positionFuncs.toCoordinates(this.arrowObject.middle, this.global);
      }
      
      this.graphics = new this.global.PIXI.Graphics();
      this.graphics.filters = [new this.global.PIXI.filters.AlphaFilter(this.alpha)];
      this.layer.addChild(this.graphics);

      //Initialize animation
      this.wipeIn();
    }
  }
  drawArrowhead(color, graphics, sp, tp) {
    var sx = sp.x;
    var sy = sp.y;
    var tx = tp.x;
    var ty = tp.y;
    var dx = tx - sx;
    var dy = ty - sy;
    var angle = Math.atan2(dy, dx);
    var headlen = this.global.config.get('arrow').headSize;
    graphics.beginFill(color);
    graphics.drawPolygon([
      tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6),
      tx, ty,
      tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6)
    ]);
    graphics.endFill();
  }
  draw(progress, graphics, startCoordinates, endCoordinates, hasMiddle, middleCoordinates) {
    //Generate bezier curve
    var bezierObject;
    if(hasMiddle) {
      bezierObject = Bezier.quadraticFromPoints(
        {
          x: startCoordinates.square.center.x,
          y: startCoordinates.square.center.y
        },
        {
          x: middleCoordinates.square.center.x,
          y: middleCoordinates.square.center.y
        },
        {
          x: endCoordinates.square.center.x,
          y: endCoordinates.square.center.y
        }
      );
    }
    else {
      var distanceX = Math.abs(startCoordinates.square.center.x - endCoordinates.square.center.x);
      var distanceY = Math.abs(startCoordinates.square.center.y - endCoordinates.square.center.y);
      var control = {
        x: startCoordinates.square.center.x,
        y: endCoordinates.square.center.y
      };
      if(distanceX > distanceY) {
        control.x = endCoordinates.square.center.x;
        control.y = startCoordinates.square.center.y;
      }
      bezierObject = new Bezier(
        {
          x: startCoordinates.square.center.x,
          y: startCoordinates.square.center.y
        },
        control,
        {
          x: endCoordinates.square.center.x,
          y: endCoordinates.square.center.y
        }
      );
    }

    //Get closest T from progress
    var totalLength = bezierObject.length();
    //Create LUT
    var LUT = bezierObject.getLUT(Math.ceil(totalLength / this.global.config.get('arrow').lutInterval));
    var targetT = -1;
    for(var i = 1;targetT < 0 && i <= LUT.length;i++) {
      var currT = i / LUT.length;
      var currLength = bezierObject.split(0, currT).length();
      if(totalLength * progress <= currLength) {
        targetT = currT;
      }
    }
    if(targetT < 0) { targetT = 1; }
    var step = Math.ceil(targetT * (LUT.length - 1));

    //Generate arrowhead source point
    var targetArrowheadT = -1;
    for(var i = 1;targetArrowheadT < 0 && i <= LUT.length;i++) {
      var currT = i / LUT.length;
      var currLength = bezierObject.split(currT, targetT).length();
      if(currLength <= this.global.config.get('arrow').headSize) {
        targetArrowheadT = currT;
      }
    }
    if(targetArrowheadT < 0) {
      targetArrowheadT = 0.99;
    }
    var arrowheadPoint = bezierObject.get(targetArrowheadT);

    graphics.clear();
    if(step > 0) {
      //Draw outline
      graphics.lineStyle({
        width: this.global.config.get('arrow').outlineSize,
        color: this.outlineColor,
        alignment: 0.5,
        native: false,
        cap: this.global.PIXI.LINE_CAP.ROUND,
        join: this.global.PIXI.LINE_JOIN.ROUND
      });
      graphics.moveTo(
        LUT[0].x,
        LUT[0].y
      );
      for(var i = 1;i <= step;i++) {
        graphics.lineTo(
          LUT[i].x,
          LUT[i].y
        );
      }
      this.drawArrowhead(this.outlineColor, graphics, arrowheadPoint, LUT[step]);
      if(hasMiddle && step > LUT.length / 2) {
        graphics.drawCircle(
          middleCoordinates.square.center.x,
          middleCoordinates.square.center.y,
          this.global.config.get('arrow').midpointRadius
        );
      }

      //Draw arrow
      graphics.lineStyle({
        width: this.global.config.get('arrow').size,
        color: this.color,
        alignment: 0.5,
        native: false,
        cap: this.global.PIXI.LINE_CAP.ROUND,
        join: this.global.PIXI.LINE_JOIN.ROUND
      });
      graphics.moveTo(
        LUT[0].x,
        LUT[0].y
      );
      for(var i = 1;i <= step;i++) {
        graphics.lineTo(
          LUT[i].x,
          LUT[i].y
        );
      }
      this.drawArrowhead(this.color, graphics, arrowheadPoint, LUT[step]);
      if(hasMiddle && step > LUT.length / 2) {
        graphics.drawCircle(
          middleCoordinates.square.center.x,
          middleCoordinates.square.center.y,
          this.global.config.get('arrow').midpointRadius
        );
      }
    }
  }
  wipeIn() {
    //Waiting for deleting to be done
    this.wipeProgress = 0;
    this.wipeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.arrowObject.start.timeline);
    this.wipeDelay += this.global.config.get('ripple').turnDuration * ((this.arrowObject.start.turn * 2 )+ (this.arrowObject.start.player === 'white' ? 0 : 1));
    this.wipeDelay += this.global.config.get('ripple').rankDuration * this.arrowObject.start.rank;
    this.wipeDelay += this.global.config.get('ripple').fileDuration * this.arrowObject.start.file;
    this.wipeLeft = this.global.config.get('arrow').animateDuration;
    this.wipeDuration = this.wipeLeft;
    this.global.PIXI.Ticker.shared.add(this.wipeInAnimate, this);
  }
  wipeInAnimate(delta) {
    //Animate wipe in
    if(this.wipeDelay > 0) {
      this.wipeDelay -= (delta / 60) * 1000;
      if(this.wipeDelay < 0) {
        this.wipeDelay = 0;
      }
    }
    else {
      this.wipeLeft -= (delta / 60) * 1000;
      if(this.wipeLeft <= 0) {
        this.wipeLeft = 0;
        this.wipeProgress = 1;
        this.draw(this.wipeProgress, this.graphics, this.startCoordinates, this.endCoordinates, this.hasMiddle, this.middleCoordinates);
        this.global.PIXI.Ticker.shared.remove(this.wipeInAnimate, this);
      }
      else {
        this.wipeProgress = (this.wipeDuration - this.wipeLeft) / this.wipeDuration;
        this.draw(this.wipeProgress, this.graphics, this.startCoordinates, this.endCoordinates, this.hasMiddle, this.middleCoordinates);
      }
    }
  }
  destroy() {
    //Skip destroy if not needed
    if(typeof this.graphics === 'undefined') { return null; }
    this.tmpStartCoordinates = this.startCoordinates;
    this.startCoordinates = undefined;
    this.tmpHasMiddle = this.hasMiddle;
    this.hasMiddle = undefined;
    this.tmpMiddleCoordinates = this.middleCoordinates;
    this.middleCoordinates = undefined;
    this.tmpEndCoordinates = this.endCoordinates;
    this.endCoordinates = undefined;
    this.tmpGraphics = this.graphics;
    this.graphics = undefined;
    this.wipeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.arrowObject.start.timeline);
    this.wipeDelay += this.global.config.get('ripple').turnDuration * ((this.arrowObject.start.turn * 2 )+ (this.arrowObject.start.player === 'white' ? 0 : 1));
    this.wipeDelay += this.global.config.get('ripple').rankDuration * this.arrowObject.start.rank;
    this.wipeDelay += this.global.config.get('ripple').fileDuration * this.arrowObject.start.file;
    this.wipeLeft = this.global.config.get('arrow').animateDuration;
    this.wipeDuration = this.wipeLeft;
    this.global.PIXI.Ticker.shared.add(this.wipeOutAnimate, this);
  }
  wipeOutAnimate(delta) {
    //Animate wipe out
    if(this.wipeDelay > 0) {
      this.wipeDelay -= (delta / 60) * 1000;
      if(this.wipeDelay < 0) {
        this.wipeDelay = 0;
      }
    }
    else {
      this.wipeLeft -= (delta / 60) * 1000;
      if(this.wipeLeft <= 0) {
        this.wipeLeft = 0;
        this.wipeProgress = 0;
        this.tmpStartCoordinates = undefined;
        this.tmpHasMiddle = undefined;
        this.tmpMiddleCoordinates = undefined;
        this.tmpEndCoordinates = undefined;
        this.tmpGraphics.clear();
        this.tmpGraphics.destroy();
        this.tmpGraphics = undefined;
        this.global.PIXI.Ticker.shared.remove(this.wipeOutAnimate, this);
      }
      else {
        this.wipeProgress = 1 - ((this.wipeDuration - this.wipeLeft) / this.wipeDuration);
        this.draw(this.wipeProgress, this.tmpGraphics, this.tmpStartCoordinates, this.tmpEndCoordinates, this.tmpHasMiddle, this.tmpMiddleCoordinates);
      }
    }
  }
}

module.exports = CurvedArrow;