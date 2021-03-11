const utilsFuncs = require('@local/utils');
const positionFuncs = require('@local/position');

class Label {
  constructor(global, labelObject = null) {
    this.global = global;
    this.emitter = this.global.emitter;
    this.layer = this.global.layers.layers.labels;
    this.labelObject = {};
    this.alpha = 0;
    this.interactive = false;
    if(labelObject !== null) {
      this.update(labelObject);
    }
    
    this.emitter.on('textureUpdate', this.refresh.bind(this));
  }
  refresh() {
    this.destroy();
    this.update(this.labelObject);
  }
  update(labelObject) {
    //Assign labelObject to instance variables
    this.labelObject = labelObject;
    
    var coordinates = positionFuncs.toCoordinates(this.labelObject, this.global);
    //Load and animate text if needed
    if(
      positionFuncs.compare(coordinates, this.coordinates) !== 0 ||
      this.type !== this.labelObject.type
    ) {
      if(typeof this.text !== 'undefined') {
        this.destroy();
      }
      this.coordinates = coordinates;
      this.type = this.labelObject.type;

      this.key = utilsFuncs.squareObjectKey(this.labelObject);
      if(this.type === 'timeline') {
        var text = this.labelObject.timeline + 'L';
        this.text = new this.global.PIXI.Text(text, {
          align: this.global.config.get('boardLabel').nonSpatialAlign,
          fontFamily: this.global.config.get('boardLabel').nonSpatialFontFamily,
          fontSize: this.global.config.get('boardLabel').nonSpatialFontSize,
          fontStyle: this.global.config.get('boardLabel').nonSpatialFontStyle,
          fontWeight: this.global.config.get('boardLabel').nonSpatialFontWeight,
          textBaseline: this.global.config.get('boardLabel').nonSpatialTextBaseline,
          fill: this.global.palette.get('boardLabel').timeline,
        });
        this.text.anchor.set(0.5);
        var width = this.global.config.get('board').marginWidth - this.global.config.get('board').borderHeight;
        var height = this.coordinates.board.height;
        this.text.x = this.coordinates.boardWithMargins.x + width/2;
        this.text.y = this.coordinates.board.y + height/2;
        if(this.global.config.get('boardLabel').rotateTimelineLabel) {
          this.text.angle = -90;
        }
      }
      else if(this.type === 'turn') {
        var text = 'T' + this.labelObject.turn;
        this.text = new this.global.PIXI.Text(text, {
          align: this.global.config.get('boardLabel').nonSpatialAlign,
          fontFamily: this.global.config.get('boardLabel').nonSpatialFontFamily,
          fontSize: this.global.config.get('boardLabel').nonSpatialFontSize,
          fontStyle: this.global.config.get('boardLabel').nonSpatialFontStyle,
          fontWeight: this.global.config.get('boardLabel').nonSpatialFontWeight,
          textBaseline: this.global.config.get('boardLabel').nonSpatialTextBaseline,
          fill: this.global.palette.get('boardLabel').turn,
        });
        this.text.anchor.set(0.5);
        var width = this.coordinates.board.width;
        var height = this.global.config.get('board').marginHeight - this.global.config.get('board').borderHeight;
        this.text.x = this.coordinates.board.x + width/2;
        this.text.y = this.coordinates.boardWithMargins.y + height/2;
      }
      else if(this.type === 'file') {
        var text = this.labelObject.coordinate.replace(/\d/g, '');
        var color = this.labelObject.player === 'white' ? this.global.palette.get('boardLabel').whiteBoard : this.global.palette.get('boardLabel').blackBoard;
        if(this.labelObject.check) { color = this.global.palette.get('boardLabel').checkBoard; }
        this.text = new this.global.PIXI.Text(text, {
          align: this.global.config.get('boardLabel').spatialAlign,
          fontFamily: this.global.config.get('boardLabel').spatialFontFamily,
          fontSize: this.global.config.get('boardLabel').spatialFontSize,
          fontStyle: this.global.config.get('boardLabel').spatialFontStyle,
          fontWeight: this.global.config.get('boardLabel').spatialFontWeight,
          textBaseline: this.global.config.get('boardLabel').spatialTextBaseline,
          fill: color,
        });
        this.text.anchor.set(0.5);
        var width = this.coordinates.square.width;
        var height = this.global.config.get('board').borderHeight;
        this.text.x = this.coordinates.square.x + width/2;
        this.text.y = this.coordinates.board.y + this.coordinates.board.height + height/2;
      }
      else if(this.type === 'rank') {
        var text = this.labelObject.rank;
        var color = this.labelObject.player === 'white' ? this.global.palette.get('boardLabel').whiteBoard : this.global.palette.get('boardLabel').blackBoard;
        if(this.labelObject.check) { color = this.global.palette.get('boardLabel').checkBoard; }
        this.text = new this.global.PIXI.Text(text, {
          align: this.global.config.get('boardLabel').spatialAlign,
          fontFamily: this.global.config.get('boardLabel').spatialFontFamily,
          fontSize: this.global.config.get('boardLabel').spatialFontSize,
          fontStyle: this.global.config.get('boardLabel').spatialFontStyle,
          fontWeight: this.global.config.get('boardLabel').spatialFontWeight,
          textBaseline: this.global.config.get('boardLabel').spatialTextBaseline,
          fill: color,
        });
        this.text.anchor.set(0.5);
        var height = this.coordinates.square.height;
        var width = this.global.config.get('board').borderWidth;
        this.text.x = this.coordinates.board.x - this.global.config.get('board').borderWidth + width/2;
        this.text.y = this.coordinates.square.y + height/2;
      }
      this.layer.addChild(this.text);
      
      //Initialize animation
      this.fadeIn();
    }
  }
  fadeIn() {
    this.text.alpha = 0;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.labelObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.labelObject.turn * 2 )+ (this.labelObject.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.labelObject.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.labelObject.file;
    this.fadeLeft = this.global.config.get('boardLabel').fadeDuration;
    this.fadeDuration = this.fadeLeft;
    this.global.PIXI.Ticker.shared.add(this.fadeInAnimate, this);
  }
  fadeInAnimate(delta) {
    //Animate fading in
    if(this.fadeDelay > 0) {
      this.fadeDelay -= (delta / 60) * 1000;
      if(this.fadeDelay < 0) {
        this.fadeDelay = 0;
      }
    }
    else if(this.text && this.text.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.text.alpha = 1;
        this.global.PIXI.Ticker.shared.remove(this.fadeInAnimate, this);
      }
      else {
        var progress = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        this.text.alpha = progress;
      }
    }
  }
  destroy() {
    //Skip destroy if not needed
    if(typeof this.text === 'undefined') { return null; }
    this.tmpCoordinates = this.coordinates;
    this.coordinates = undefined;
    this.tmpText = this.text;
    this.text = undefined;
    this.fadeDelay = 0;
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.labelObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.labelObject.turn * 2 )+ (this.labelObject.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.config.get('ripple').rankDuration * this.labelObject.rank;
    this.fadeDelay += this.global.config.get('ripple').fileDuration * this.labelObject.file;
    this.fadeLeft = this.global.config.get('boardLabel').fadeDuration;
    this.fadeDuration = this.fadeLeft;
    this.global.PIXI.Ticker.shared.add(this.fadeOutAnimate, this);
  }
  fadeOutAnimate(delta) {
    //Animate fading out
    if(this.fadeDelay > 0) {
      this.fadeDelay -= (delta / 60) * 1000;
      if(this.fadeDelay < 0) {
        this.fadeDelay = 0;
      }
    }
    else if(this.tmpText && this.tmpText.alpha > 0) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.tmpText.destroy();
        this.tmpText = undefined;
        this.tmpCoordinates = undefined;
        this.global.PIXI.Ticker.shared.remove(this.fadeOutAnimate, this);
      }
      else {
        var progress = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        this.tmpText.alpha = progress;
      }
    }
  }
}

module.exports = Label;