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
      this.alpha !== this.global.config.get('arrow').alpha ||
      this.graphics === 'undefined'
    ) {
      if(typeof this.graphics !== 'undefined') {
        this.destroy();
      }
      this.hasMiddle = hasMiddle;
      this.startCoordinates = startCoordinates;
      this.endCoordinates = endCoordinates;

      //Generate bezier curve
      if(hasMiddle) {
        this.middleCoordinates = positionFuncs.toCoordinates(this.arrowObject.middle, this.global);
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
    var headlen = this.global.config.get('arrow').headSize;
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
      this.graphics = new this.global.PIXI.Graphics();
      this.graphics.filters = [new this.global.PIXI.filters.AlphaFilter(this.global.config.get('arrow').alpha)];
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
            width: this.global.config.get('arrow').outlineSize,
            color: this.outlineColor,
            alignment: 0.5,
            native: false,
            cap: this.global.PIXI.LINE_CAP.ROUND,
            join: this.global.PIXI.LINE_JOIN.ROUND
          });
          this.graphics.moveTo(
            this.startCoordinates.square.center.x,
            this.startCoordinates.square.center.y
          );
          this.graphics.lineTo(
            point.x,
            point.y
          );
          this.drawArrowhead(this.outlineColor, this.graphics, this.startCoordinates.square.center, point);

          //Draw arrow
          this.graphics.lineStyle({
            width: this.global.config.get('arrow').size,
            color: this.color,
            alignment: 0.5,
            native: false,
            cap: this.global.PIXI.LINE_CAP.ROUND,
            join: this.global.PIXI.LINE_JOIN.ROUND
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
            width: this.global.config.get('arrow').outlineSize,
            color: this.outlineColor,
            alignment: 0.5,
            native: false,
            cap: this.global.PIXI.LINE_CAP.ROUND,
            join: this.global.PIXI.LINE_JOIN.ROUND
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
            this.global.config.get('arrow').midpointRadius
          );
          this.drawArrowhead(this.outlineColor, this.graphics, this.middleCoordinates.square.center, point);

          //Draw arrow
          this.graphics.lineStyle({
            width: this.global.config.get('arrow').size,
            color: this.color,
            alignment: 0.5,
            native: false,
            cap: this.global.PIXI.LINE_CAP.ROUND,
            join: this.global.PIXI.LINE_JOIN.ROUND
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
            this.global.config.get('arrow').midpointRadius
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
          width: this.global.config.get('arrow').outlineSize,
          color: this.outlineColor,
          alignment: 0.5,
          native: false,
          cap: this.global.PIXI.LINE_CAP.ROUND,
          join: this.global.PIXI.LINE_JOIN.ROUND
        });
        this.graphics.moveTo(
          this.startCoordinates.square.center.x,
          this.startCoordinates.square.center.y
        );
        this.graphics.lineTo(
          point.x,
          point.y
        );
        this.drawArrowhead(this.outlineColor, this.graphics, this.startCoordinates.square.center, point);

        //Draw arrow
        this.graphics.lineStyle({
          width: this.global.config.get('arrow').size,
          color: this.color,
          alignment: 0.5,
          native: false,
          cap: this.global.PIXI.LINE_CAP.ROUND,
          join: this.global.PIXI.LINE_JOIN.ROUND
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
        this.draw(this.wipeProgress);
        this.global.PIXI.Ticker.shared.remove(this.wipeInAnimate, this);
      }
      else {
        this.wipeProgress = (this.wipeDuration - this.wipeLeft) / this.wipeDuration;
        this.draw(this.wipeProgress);
      }
    }
  }
  destroy() {
    this.wipeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.arrowObject.start.timeline);
    this.wipeDelay += this.global.config.get('ripple').turnDuration * ((this.arrowObject.start.turn * 2 )+ (this.arrowObject.start.player === 'white' ? 0 : 1));
    this.wipeDelay += this.global.config.get('ripple').rankDuration * this.arrowObject.start.rank;
    this.wipeDelay += this.global.config.get('ripple').fileDuration * this.arrowObject.start.file;
    this.wipeLeft = this.global.config.get('arrow').animateDuration;
    this.wipeDuration = this.wipeLeft;
    if(typeof this.graphics !== 'undefined') {
      this.global.PIXI.Ticker.shared.add(this.wipeOutAnimate, this);
    }
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
        this.graphics.clear();
        this.graphics.destroy();
        this.graphics = undefined;
        this.startCoordinates = undefined;
        this.middleCoordinates = undefined;
        this.endCoordinates = undefined;
        this.hasMiddle = undefined;
        this.global.PIXI.Ticker.shared.remove(this.wipeOutAnimate, this);
      }
      else {
        this.wipeProgress = 1 - ((this.wipeDuration - this.wipeLeft) / this.wipeDuration);
        this.draw(this.wipeProgress);
      }
    }
  }
}

module.exports = StraightArrow;