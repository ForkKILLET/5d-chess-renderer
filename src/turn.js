const PIXI = require('pixi.js-legacy');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

const Square = require('@local/square');
const Piece = require('@local/piece');

class Turn {
  constructor(emitter, turnObject = null) {
    this.layers = layerFuncs.layers;
    this.emitter = emitter;
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
    });
    //Load and animate board if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      this.coordinates = coordinates;
      //Clear old stuff if needing to update
      if(typeof this.graphics !== 'undefined') {
        this.destroy();
      }
      this.graphics = new PIXI.Graphics();
      if(this.turnObject.player === 'white') {
        this.graphics.beginFill(palette.get('whiteBoardBorder'));
        this.graphics.lineStyle({
          width: config.get('boardBorderLineWidth'),
          color: palette.get('whiteBoardBorderLine'),
          alignment: 0
        });
      }
      else {
        this.graphics.beginFill(palette.get('blackBoardBorder'));
        this.graphics.lineStyle({
          width: config.get('boardBorderLineWidth'),
          color: palette.get('blackBoardBorderLine'),
          alignment: 0
        });
      }
      this.graphics.drawRoundedRect(
        this.coordinates.board.x - config.get('boardBorderWidth'),
        this.coordinates.board.y - config.get('boardBorderHeight'),
        this.coordinates.board.width + (config.get('boardBorderWidth') * 2),
        this.coordinates.board.height + (config.get('boardBorderHeight') * 2),
        config.get('boardBorderRadius')
      );
      this.graphics.endFill();
      if(config.get('boardShadow')) {
        this.shadowGraphics = new PIXI.Graphics();
        this.shadowGraphics.beginFill(palette.get('boardShadow'));  
        this.shadowGraphics.drawRoundedRect(
          (this.coordinates.board.x - config.get('boardBorderWidth')) + config.get('boardShadowDistance'),
          (this.coordinates.board.y - config.get('boardBorderHeight')) + config.get('boardShadowDistance'),
          this.coordinates.board.width + (config.get('boardBorderWidth') * 2),
          this.coordinates.board.height + (config.get('boardBorderHeight') * 2),
          config.get('boardBorderRadius')
        );
        this.shadowGraphics.alpha = config.get('boardShadowAlpha');
        this.layers.boardBorder.addChild(this.shadowGraphics);
      }
      this.layers.boardBorder.addChild(this.graphics);
      if(config.get('turnFollow')) {
        this.layers.viewport.snap(
          this.coordinates.boardWithMargins.center.x,
          this.coordinates.boardWithMargins.center.y, 
          {
            removeOnComplete: true,
            removeOnInterrupt: true,
            time: config.get('turnFollowTime'),
            ease: 'easeOutExpo'
          }
        );
      }
      //Initialize animation
      this.fadeIn();
    }

    //Creating new squares array
    var squares = [];
    for(var r = 0;r < positionFuncs.coordinateOptions.boardHeight;r++) {  
      for(var f = 0;f < positionFuncs.coordinateOptions.boardWidth;f++) {
        var rank = r + 1;
        var file = f + 1;
        var coordinates = ['a','b','c','d','e','f','g','h'][f] + rank;
        var key = `${this.turnObject.timeline}_${this.turnObject.player}${this.turnObject.turn}_${coordinates}`;
        squares.push({
          key: key,
          squareObject: {
            timeline: this.turnObject.timeline,
            turn: this.turnObject.turn,
            player: this.turnObject.player,
            coordinate: coordinates,
            rank: rank,
            file: file
          }
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
        this.squares.push(new Square(this.emitter, squares[j].squareObject));
      }
    }
  
    //Looking in internal pieces object to see if they still exist
    for(var i = 0;i < this.pieces.length;i++) {
      var found = false;
      for(var j = 0;j < this.turnObject.pieces.length;j++) {
        var pieceObject = this.turnObject.pieces[j];
        if(pieceObject.piece === '') { pieceObject.piece = 'P'; }
        var key = `${pieceObject.player}${pieceObject.piece}_${pieceObject.position.timeline}_${pieceObject.position.player}${pieceObject.position.turn}_${pieceObject.position.coordinate}_${pieceObject.hasMoved}`;
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
      var key = `${pieceObject.player}${pieceObject.piece}_${pieceObject.position.timeline}_${pieceObject.position.player}${pieceObject.position.turn}_${pieceObject.position.coordinate}_${pieceObject.hasMoved}`;
      for(var i = 0;i < this.pieces.length;i++) {
        if(this.pieces[i].key === key) {
          found = true;
        }
      }
      if(!found) {
        this.pieces.push(new Piece(this.emitter, this.turnObject.pieces[j]));
      }
    }
  }
  fadeIn() {
    this.graphics.alpha = 0;
    if(this.shadowGraphics) {
      this.shadowGraphics.alpha = 0;
    }
    this.fadeDelay = config.get('timelineRippleDuration') * Math.abs(this.turnObject.timeline);
    this.fadeDelay += config.get('turnRippleDuration') * ((this.turnObject.turn * 2 )+ (this.turnObject.player === 'white' ? 0 : 1));
    this.fadeLeft = config.get('boardFadeDuration');
    this.fadeDuration = this.fadeLeft;
    PIXI.Ticker.shared.add(this.fadeInAnimate, this);
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
        PIXI.Ticker.shared.remove(this.fadeInAnimate, this);
      }
      else {
        this.graphics.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        if(this.shadowGraphics) {
          this.shadowGraphics.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        }
      }
    }
  }
  destroy() {
    if(this.graphics) {
      this.tmpGraphics = this.graphics;
      this.graphics = undefined;
      if(this.shadowGraphics) {
        this.tmpShadowGraphics = this.shadowGraphics;
        this.shadowGraphics = undefined;
      }
      this.fadeDelay = config.get('timelineRippleDuration') * Math.abs(this.turnObject.timeline);
      this.fadeDelay += config.get('turnRippleDuration') * ((this.turnObject.turn * 2 )+ (this.turnObject.player === 'white' ? 0 : 1));
      this.fadeLeft = config.get('boardFadeDuration');
      this.fadeDuration = this.fadeLeft;
      PIXI.Ticker.shared.add(this.fadeOutAnimate, this);
    }
    if(this.shadowGraphics) {
      this.shadowGraphics.destroy();
    }
    for(var i = 0;i < this.pieces.length;i++) {
      this.pieces[i].destroy();
    }
    for(var i = 0;i < this.squares.length;i++) {
      this.squares[i].destroy();
    }
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
        this.tmpGraphics.destroy();
        this.tmpGraphics = undefined;
        if(this.tmpShadowGraphics) {
          this.tmpShadowGraphics.destroy();
          this.tmpShadowGraphics = undefined;
        }
        PIXI.Ticker.shared.remove(this.fadeOutAnimate, this);
      }
      else {
        this.tmpGraphics.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        if(this.tmpShadowGraphics) {
          this.tmpShadowGraphics.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        }
      }
    }
  }
}

module.exports = Turn;