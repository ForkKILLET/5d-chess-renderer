const utilsFuncs = require('@local/utils');
const positionFuncs = require('@local/position');

const Square = require('@local/square');
const Piece = require('@local/piece');

class Turn {
  constructor(global, turnObject = null) {
    this.global = global;
    this.layers = this.global.layers.layers;
    this.emitter = this.global.emitter;
    this.turnObject = {};
    this.squares = [];
    this.pieces = [];
    if(turnObject !== null) {
      this.update(turnObject);
    }
  }
  refresh() {
    this.update(this.turnObject);
  }
  update(turnObject) {
    //Assign pieceObj to instance variables
    this.turnObject = turnObject;

    var coordinates = positionFuncs.toCoordinates({
      timeline: this.turnObject.timeline,
      turn: this.turnObject.turn,
      player: this.turnObject.player,
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    //Load and animate board if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      //Clear old stuff if needing to update
      if(typeof this.graphics !== 'undefined') {
        this.destroy();
      }
      this.graphics = new this.global.PIXI.Graphics();
      if(this.turnObject.player === 'white') {
        this.graphics.beginFill(this.global.palette.get('board').whiteBorder);
        this.graphics.lineStyle({
          width: this.global.config.get('board').borderLineWidth,
          color: this.global.palette.get('board').whiteBorderOutline,
          alignment: 0
        });
      }
      else {
        this.graphics.beginFill(this.global.palette.get('board').blackBorder);
        this.graphics.lineStyle({
          width: this.global.config.get('board').borderLineWidth,
          color: this.global.palette.get('board').blackBorderOutline,
          alignment: 0
        });
      }
      this.graphics.drawRoundedRect(
        this.coordinates.board.x - this.global.config.get('board').borderWidth,
        this.coordinates.board.y - this.global.config.get('board').borderHeight,
        this.coordinates.board.width + (this.global.config.get('board').borderWidth * 2),
        this.coordinates.board.height + (this.global.config.get('board').borderHeight * 2),
        this.global.config.get('board').borderRadius
      );
      this.graphics.endFill();
      if(this.global.config.get('boardShadow').show) {
        this.shadowGraphics = new this.global.PIXI.Graphics();
        this.shadowGraphics.beginFill(this.global.palette.get('boardShadow').shadow);
        this.shadowGraphics.drawRoundedRect(
          (this.coordinates.board.x - this.global.config.get('board').borderWidth) + this.global.config.get('boardShadow').offsetX,
          (this.coordinates.board.y - this.global.config.get('board').borderHeight) + this.global.config.get('boardShadow').offsetY,
          this.coordinates.board.width + (this.global.config.get('board').borderWidth * 2),
          this.coordinates.board.height + (this.global.config.get('board').borderHeight * 2),
          this.global.config.get('board').borderRadius
        );
        this.shadowGraphics.alpha = this.global.config.get('boardShadow').alpha;
        this.layers.boardBorder.addChild(this.shadowGraphics);
      }
      this.layers.boardBorder.addChild(this.graphics);
      //Initialize animation
      this.fadeIn();
    }

    //Creating new squares array
    var squares = [];
    for(var r = 0;r < this.global.board.height;r++) {
      for(var f = 0;f < this.global.board.width;f++) {
        var rank = r + 1;
        var file = f + 1;
        var coordinates = ['a','b','c','d','e','f','g','h'][f] + rank;
        var squareObject = {
          timeline: this.turnObject.timeline,
          turn: this.turnObject.turn,
          player: this.turnObject.player,
          coordinate: coordinates,
          rank: rank,
          file: file
        };
        var key = utilsFuncs.squareObjectKey(squareObject);
        squares.push({
          key: key,
          squareObject: squareObject
        });
      }
    }

    //Looking in internal squares object to see if they still exist
    for(var i = 0;i < this.squares.length;i++) {
      var found = false;
      for(var j = 0;j < squares.length;j++) {
        if(this.squares[i].key === squares[j].key) {
          found = true;
          this.squares[i].update(squares[j].squareObject);
        }
      }
      if(!found) {
        this.squares[i].destroy();
        this.squares.splice(i, 1);
        i--;
      }
    }
    //Looking in new squares array for new squares to create
    for(var j = 0;j < squares.length;j++) {
      for(var i = 0;i < this.squares.length;i++) {
        if(this.squares[i].key === squares[j].key) {
          found = true;
        }
      }
      if(!found) {
        this.squares.push(new Square(this.global, squares[j].squareObject));
      }
    }

    //Looking in internal pieces object to see if they still exist
    for(var i = 0;i < this.pieces.length;i++) {
      var found = false;
      for(var j = 0;j < this.turnObject.pieces.length;j++) {
        var pieceObject = this.turnObject.pieces[j];
        if(pieceObject.piece === '') { pieceObject.piece = 'P'; }
        var key = utilsFuncs.pieceObjectKey(pieceObject);
        if(this.pieces[i].key === key) {
          found = true;
          this.pieces[i].update(this.turnObject.pieces[j]);
        }
      }
      if(!found) {
        this.pieces[i].destroy();
        this.pieces.splice(i, 1);
        i--;
      }
    }

    //Looking in new turn object for new pieces to create
    for(var j = 0;j < this.turnObject.pieces.length;j++) {
      var found = false;
      var pieceObject = this.turnObject.pieces[j];
      if(pieceObject.piece === '') { pieceObject.piece = 'P'; }
      var key = utilsFuncs.pieceObjectKey(pieceObject);
      for(var i = 0;i < this.pieces.length;i++) {
        if(this.pieces[i].key === key) {
          found = true;
        }
      }
      if(!found) {
        this.pieces.push(new Piece(this.global, this.turnObject.pieces[j]));
      }
    }
  }
  fadeIn() {
    this.graphics.alpha = 0;
    if(this.shadowGraphics) {
      this.shadowGraphics.alpha = 0;
    }
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.turnObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.turnObject.turn * 2 )+ (this.turnObject.player === 'white' ? 0 : 1));
    this.fadeLeft = this.global.config.get('board').fadeDuration;
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
    else if(this.graphics && this.graphics.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.graphics.alpha = 1;
        this.global.PIXI.Ticker.shared.remove(this.fadeInAnimate, this);
      }
      else {
        this.graphics.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        if(this.shadowGraphics) {
          this.shadowGraphics.alpha =
            this.global.config.get('boardShadow').alpha *
            (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        }
      }
    }
  }
  destroy() {
    //Calling destroy on children
    for(var i = 0;i < this.pieces.length;i++) {
      this.pieces[i].destroy();
    }
    for(var i = 0;i < this.squares.length;i++) {
      this.squares[i].destroy();
    }
    
    //Skip destroy if not needed
    if(typeof this.graphics === 'undefined') { return null; }
    this.tmpGraphics = this.graphics;
    this.graphics = undefined;
    if(this.shadowGraphics) {
      this.tmpShadowGraphics = this.shadowGraphics;
      this.shadowGraphics = undefined;
    }
    this.fadeDelay = this.global.config.get('ripple').timelineDuration * Math.abs(this.turnObject.timeline);
    this.fadeDelay += this.global.config.get('ripple').turnDuration * ((this.turnObject.turn * 2 )+ (this.turnObject.player === 'white' ? 0 : 1));
    this.fadeLeft = this.global.config.get('board').fadeDuration;
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
    else if(this.tmpGraphics && this.tmpGraphics.alpha > 0) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.tmpGraphics.clear();
        this.tmpGraphics.destroy();
        this.tmpGraphics = undefined;
        if(this.tmpShadowGraphics) {
          this.tmpShadowGraphics.clear();
          this.tmpShadowGraphics.destroy();
          this.tmpShadowGraphics = undefined;
        }
        this.global.PIXI.Ticker.shared.remove(this.fadeOutAnimate, this);
      }
      else {
        this.tmpGraphics.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        if(this.tmpShadowGraphics) {
          this.tmpShadowGraphics.alpha =
            this.global.config.get('boardShadow').alpha *
            (1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration));
        }
      }
    }
  }
}

module.exports = Turn;
