const PIXI = require('pixi.js-legacy');

const { Bezier } = require('bezier-js');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class CurvedArrow {
  /*
    Arrow Object:
      - type - string ('move', 'capture', or 'check') or number for custom
      - start - pos obj
      - middle - null or pos obj
      - end - pos obj
  */
  constructor(arrowObject = null) {
    this.LUT = [];
    if(arrowObject !== null) {
      this.update(arrowObject);
    }
  }
  update(arrowObject) {
    this.arrowObject = arrowObject;
    this.layer = typeof this.arrowObject.type === 'string' ? layerFuncs.layers.moveArrows : layerFuncs.layers.customArrows;
    this.color = typeof this.arrowObject.type === 'string' ? palette.get(`${this.arrowObject.type}Arrow`) : this.arrowObject.type;
    var hasMiddle = this.arrowObject.middle !== null;
    var startCoordinates = positionFuncs.toCoordinates(this.arrowObject.start);
    var endCoordinates = positionFuncs.toCoordinates(this.arrowObject.end);

    //Update only if needed
    if(
      hasMiddle !== this.hasMiddle ||
      positionFuncs.compare(startCoordinates, this.startCoordinates) !== 0 ||
      positionFuncs.compare(endCoordinates, this.endCoordinates) !== 0 ||
      this.lutInterval !== config.get('arrowLutInterval') ||
      this.alpha !== config.get('arrowAlpha')
    ) {
      this.lutInterval = config.get('arrowLutInterval');
      this.hasMiddle = hasMiddle;
      this.startCoordinates = startCoordinates;
      this.endCoordinates = endCoordinates;

      //Generate bezier curve
      if(hasMiddle) {
        this.middleCoordinates = positionFuncs.toCoordinates(this.arrowObject.middle);
        this.bezierObject = Bezier.quadraticFromPoints(
          {
            x: this.startCoordinates.square.center.x,
            y: this.startCoordinates.square.center.y
          },
          {
            x: this.middleCoordinates.square.center.x,
            y: this.middleCoordinates.square.center.y
          },
          {
            x: this.endCoordinates.square.center.x,
            y: this.endCoordinates.square.center.y
          }
        );
      }
      else {
        var distanceX = Math.abs(this.startCoordinates.square.center.x - this.endCoordinates.square.center.x);
        var distanceY = Math.abs(this.startCoordinates.square.center.y - this.endCoordinates.square.center.y);
        var control = {
          x: this.startCoordinates.square.center.x,
          y: this.endCoordinates.square.center.y
        };
        if(distanceX > distanceY) {
          control.x = this.endCoordinates.square.center.x;
          control.y = this.startCoordinates.square.center.y;
        }
        this.bezierObject = new Bezier(
          {
            x: this.startCoordinates.square.center.x,
            y: this.startCoordinates.square.center.y
          },
          control,
          {
            x: this.endCoordinates.square.center.x,
            y: this.endCoordinates.square.center.y
          }
        );
      }

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
    var headlen = config.get('arrowheadSize');
    graphics.beginFill(color);
    graphics.drawPolygon([
      tx - headlen * Math.cos(angle - Math.PI / 6), ty - headlen * Math.sin(angle - Math.PI / 6),
      tx, ty,
      tx - headlen * Math.cos(angle + Math.PI / 6), ty - headlen * Math.sin(angle + Math.PI / 6)
    ]);
    graphics.endFill();
  }
  draw(progress) {
    //Get closest T from progress
    var totalLength = this.bezierObject.length();
    //Create LUT
    this.LUT = this.bezierObject.getLUT(Math.ceil(totalLength / config.get('arrowLutInterval')));
    var targetT = -1;
    for(var i = 1;targetT < 0 && i <= this.LUT.length;i++) {
      var currT = i / this.LUT.length;
      var currLength = this.bezierObject.split(0, currT).length();
      if(totalLength * progress <= currLength) {
        targetT = currT;
      }
    }
    if(targetT < 0) { targetT = 1; }
    var step = Math.ceil(targetT * (this.LUT.length - 1));

    //Generate arrowhead source point
    var targetArrowheadT = -1;
    for(var i = 1;targetArrowheadT < 0 && i <= this.LUT.length;i++) {
      var currT = i / this.LUT.length;
      var currLength = this.bezierObject.split(currT, targetT).length();
      if(currLength <= config.get('arrowheadSize')) {
        targetArrowheadT = currT;
      }
    }
    if(targetArrowheadT < 0) {
      targetArrowheadT = 0.99;
    }
    var arrowheadPoint = this.bezierObject.get(targetArrowheadT);


    //Initialize graphics if needed
    if(typeof this.graphics === 'undefined') {
      this.graphics = new PIXI.Graphics();
      this.graphics.filters = [new PIXI.filters.AlphaFilter(config.get('arrowAlpha'))];
      this.layer.addChild(this.graphics);
    }
    this.graphics.clear();

    if(step > 0) {
      //Draw outline
      this.graphics.lineStyle({
        width: config.get('arrowOutlineSize'),
        color: palette.get('arrowOutline'),
        alignment: 0.5,
        native: false,
        cap: PIXI.LINE_CAP.ROUND,
        join: PIXI.LINE_JOIN.ROUND
      });
      this.graphics.moveTo(
        this.LUT[0].x,
        this.LUT[0].y
      );
      for(var i = 1;i <= step;i++) {
        this.graphics.lineTo(
          this.LUT[i].x,
          this.LUT[i].y
        );
      }
      this.drawArrowhead(palette.get('arrowOutline'), this.graphics, arrowheadPoint, this.LUT[step]);
      if(this.hasMiddle && step > this.LUT.length / 2) {
        this.graphics.drawCircle(
          this.middleCoordinates.square.center.x,
          this.middleCoordinates.square.center.y,
          config.get('arrowMidpointRadius')
        );
      }

      //Draw arrow
      this.graphics.lineStyle({
        width: config.get('arrowSize'),
        color: this.color,
        alignment: 0.5,
        native: false,
        cap: PIXI.LINE_CAP.ROUND,
        join: PIXI.LINE_JOIN.ROUND
      });
      this.graphics.moveTo(
        this.LUT[0].x,
        this.LUT[0].y
      );
      for(var i = 1;i <= step;i++) {
        this.graphics.lineTo(
          this.LUT[i].x,
          this.LUT[i].y
        );
      }
      this.drawArrowhead(this.color, this.graphics, arrowheadPoint, this.LUT[step]);
      if(this.hasMiddle && step > this.LUT.length / 2) {
        this.graphics.drawCircle(
          this.middleCoordinates.square.center.x,
          this.middleCoordinates.square.center.y,
          config.get('arrowMidpointRadius')
        );
      }
    }
  }
  wipeIn() {
    this.wipeProgress = 0;
    this.wipeDelay = config.get('timelineRippleDuration') * Math.abs(this.arrowObject.start.timeline);
    this.wipeDelay += config.get('turnRippleDuration') * ((this.arrowObject.start.turn * 2 )+ (this.arrowObject.start.player === 'white' ? 0 : 1));
    this.wipeDelay += config.get('rankRippleDuration') * this.arrowObject.start.rank;
    this.wipeDelay += config.get('fileRippleDuration') * this.arrowObject.start.file;
    this.wipeLeft = config.get('arrowAnimateDuration');
    this.wipeDuration = this.wipeLeft;
    PIXI.Ticker.shared.add(this.wipeInAnimate, this);
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
        this.draw(this.wipeProgress);
        PIXI.Ticker.shared.remove(this.wipeInAnimate, this);
      }
      else {
        this.wipeProgress = (this.wipeDuration - this.wipeLeft) / this.wipeDuration;
        this.draw(this.wipeProgress);
      }
    }
  }
}

module.exports = CurvedArrow;