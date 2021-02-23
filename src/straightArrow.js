const PIXI = require('pixi.js-legacy');

const { Bezier } = require('bezier-js');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

class StraightArrow {
  /*
    Arrow Object:
      - type - string ('move', 'capture', or 'check') or number for custom
      - start - pos obj
      - middle - null or pos obj
      - end - pos obj
  */
  constructor(arrowObject = null) {
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
      this.alpha !== config.get('arrowAlpha')
    ) {
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
  draw(progress) {    //Initialize graphics if needed
    if(typeof this.graphics === 'undefined') {
      this.graphics = new PIXI.Graphics();
      this.graphics.filters = [new PIXI.filters.AlphaFilter(config.get('arrowAlpha'))];
      this.layer.addChild(this.graphics);
    }
    this.graphics.clear();

    if(progress > 0) {
      if(this.hasMiddle) {
        var firstLegLength = Math.sqrt(
          Math.pow(this.middleCoordinates.square.center.x - this.startCoordinates.square.center.x, 2) +
          Math.pow(this.middleCoordinates.square.center.y - this.startCoordinates.square.center.y, 2)
        );
        var secondLegLength = Math.sqrt(
          Math.pow(this.middleCoordinates.square.center.x - this.endCoordinates.square.center.x, 2) +
          Math.pow(this.middleCoordinates.square.center.y - this.endCoordinates.square.center.y, 2)
        );
        var totalLength = firstLegLength + secondLegLength;
        if(progress < firstLegLength / totalLength) {
          //Has not reached middle point
          var newProgress = (progress) / (firstLegLength / totalLength);
          var point = {
            x: ((this.middleCoordinates.square.center.x - this.startCoordinates.square.center.x) * newProgress) + this.startCoordinates.square.center.x,
            y: ((this.middleCoordinates.square.center.y - this.startCoordinates.square.center.y) * newProgress) + this.startCoordinates.square.center.y
          };
          
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
            this.startCoordinates.square.center.x,
            this.startCoordinates.square.center.y
          );
          this.graphics.lineTo(
            point.x,
            point.y
          );
          this.drawArrowhead(palette.get('arrowOutline'), this.graphics, this.startCoordinates.square.center, point);

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
            this.startCoordinates.square.center.x,
            this.startCoordinates.square.center.y
          );
          this.graphics.lineTo(
            point.x,
            point.y
          );
          this.drawArrowhead(this.color, this.graphics, this.startCoordinates.square.center, point);
        }
        else {
          //Has reached middle point
          var newProgress = (progress - (firstLegLength / totalLength)) / (secondLegLength / totalLength);
          var point = {
            x: ((this.endCoordinates.square.center.x - this.middleCoordinates.square.center.x) * newProgress) + this.middleCoordinates.square.center.x,
            y: ((this.endCoordinates.square.center.y - this.middleCoordinates.square.center.y) * newProgress) + this.middleCoordinates.square.center.y
          };
          
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
            this.startCoordinates.square.center.x,
            this.startCoordinates.square.center.y
          );
          this.graphics.lineTo(
            this.middleCoordinates.square.center.x,
            this.middleCoordinates.square.center.y
          );
          this.graphics.lineTo(
            point.x,
            point.y
          );
          this.graphics.drawCircle(
            this.middleCoordinates.square.center.x,
            this.middleCoordinates.square.center.y,
            config.get('arrowMidpointRadius')
          );
          this.drawArrowhead(palette.get('arrowOutline'), this.graphics, this.middleCoordinates.square.center, point);

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
            this.startCoordinates.square.center.x,
            this.startCoordinates.square.center.y
          );
          this.graphics.lineTo(
            this.middleCoordinates.square.center.x,
            this.middleCoordinates.square.center.y
          );
          this.graphics.lineTo(
            point.x,
            point.y
          );
          this.graphics.drawCircle(
            this.middleCoordinates.square.center.x,
            this.middleCoordinates.square.center.y,
            config.get('arrowMidpointRadius')
          );
          this.drawArrowhead(this.color, this.graphics, this.middleCoordinates.square.center, point);
        }
      }
      else {
        var point = {
          x: ((this.endCoordinates.square.center.x - this.startCoordinates.square.center.x) * progress) + this.startCoordinates.square.center.x,
          y: ((this.endCoordinates.square.center.y - this.startCoordinates.square.center.y) * progress) + this.startCoordinates.square.center.y
        };
        
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
          this.startCoordinates.square.center.x,
          this.startCoordinates.square.center.y
        );
        this.graphics.lineTo(
          point.x,
          point.y
        );
        this.drawArrowhead(palette.get('arrowOutline'), this.graphics, this.startCoordinates.square.center, point);

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
          this.startCoordinates.square.center.x,
          this.startCoordinates.square.center.y
        );
        this.graphics.lineTo(
          point.x,
          point.y
        );
        this.drawArrowhead(this.color, this.graphics, this.startCoordinates.square.center, point);
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
  destroy() {
    this.startCoordinates = undefined;
    this.middleCoordinates = undefined;
    this.endCoordinates = undefined;
    this.hasMiddle = undefined;
    this.tmpGraphics = this.graphics;
    this.graphics = undefined;
    this.wipeDelay = config.get('timelineRippleDuration') * Math.abs(this.arrowObject.start.timeline);
    this.wipeDelay += config.get('turnRippleDuration') * ((this.arrowObject.start.turn * 2 )+ (this.arrowObject.start.player === 'white' ? 0 : 1));
    this.wipeDelay += config.get('rankRippleDuration') * this.arrowObject.start.rank;
    this.wipeDelay += config.get('fileRippleDuration') * this.arrowObject.start.file;
    this.wipeLeft = config.get('arrowAnimateDuration');
    this.wipeDuration = this.wipeLeft;
    PIXI.Ticker.shared.add(this.wipeOutAnimate, this);
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
        this.tmpGraphics.destroy();
        this.tmpGraphics = undefined;
        PIXI.Ticker.shared.remove(this.wipeOutAnimate, this);
      }
      else {
        this.wipeProgress = 1 - ((this.wipeDuration - this.wipeLeft) / this.wipeDuration);
        this.draw(this.wipeProgress);
      }
    }
  }
}

module.exports = StraightArrow;