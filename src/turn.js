const PIXI = require('pixi.js-legacy');
const { DropShadowFilter } = require('@pixi/filter-drop-shadow');

const layerFuncs = require('@local/layers');
const positionFuncs = require('@local/position');
const config = require('@local/config');
const palette = require('@local/palette');

const Square = require('@local/square');
const Piece = require('@local/piece');

class Turn {
  constructor(emitter, turnObject = null, delay = null) {
    this.layers = layerFuncs.layers;
    this.emitter = emitter;
    this.turnObject = {};
    this.squares = [];
    this.pieces = [];
    if(turnObject !== null) {
      if(delay === null) {
        this.update(turnObject);
      }
      else {
        window.setTimeout(() => {
          this.update(turnObject);
        }, delay);
      }
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
        this.graphics.filters = [new DropShadowFilter({
          rotation: config.get('boardShadowRotation'),
          distance: config.get('boardShadowDistance')
        })];
      }
      this.layers.boardBorder.addChild(this.graphics);
      if(config.get('turnFollow')) {
        this.layers.viewport.snap(
          this.coordinates.boardWithMargins.center.x,
          this.coordinates.boardWithMargins.center.y, 
          {
            removeOnComplete: true,
            removeOnInterrupt: true,
            time: 250,
            ease: 'easeOutExpo'
          }
        );
      }
      //Initialize animation
      this.wipe();
    }

    //Creating new squares array
    var squares = [];
    for(var r = 0;r < positionFuncs.coordinateOptions.boardHeight;r++) {  
      for(var f = 0;f < positionFuncs.coordinateOptions.boardWidth;f++) {
        var rank = r + 1;
        var file = f + 1;
        var coordinates = ['a','b','c','d','e','f','g','h'][r] + file;
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
  wipe() {
    this.maskGraphics = new PIXI.Graphics();
    this.graphics.mask = this.maskGraphics;
    this.wipe = 0;
    this.wipeLeft = config.get('boardWipeRippleDuration') * Math.min(positionFuncs.coordinateOptions.boardHeight, positionFuncs.coordinateOptions.boardWidth);
    this.wipeDuration = this.wipeLeft;
    PIXI.Ticker.shared.add(this.wipeAnimate.bind(this));
  }
  wipeAnimate(delta) {
    //Animate fading in
    if(this.wipe < 1) {
      this.wipeLeft -= (delta / 60) * 1000;
      if(this.wipeLeft <= 0) {
        this.wipeLeft = 0;
        this.wipe = 1;
        this.graphics.mask = null;
        PIXI.Ticker.shared.remove(this.wipeAnimate);
      }
      else {
        this.wipe = (this.wipeDuration - this.wipeLeft) / this.wipeDuration;
        this.maskGraphics.clear();
        this.maskGraphics.beginFill(0xffffff);
        var realX = this.coordinates.board.x - config.get('boardBorderWidth') - config.get('boardBorderLineWidth');
        var realY = this.coordinates.board.y - config.get('boardBorderHeight') - config.get('boardBorderLineWidth');
        var realWidth = this.coordinates.board.width + (config.get('boardBorderWidth') * 2) + (config.get('boardBorderLineWidth') * 2);
        var realHeight = this.coordinates.board.height + (config.get('boardBorderHeight') * 2) + (config.get('boardBorderLineWidth') * 2);
        realY += realHeight;
        this.maskGraphics.drawPolygon([
          realX,
          realY,
          realX + (2 * realWidth * this.wipe),
          realY,
          realX,
          realY - (2 * realHeight * this.wipe)
        ]);
        this.maskGraphics.endFill();
      }
    }
  }
  destroy() {
    this.sprite.destroy();
  }
}

module.exports = Turn;