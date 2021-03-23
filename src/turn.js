const utilsFuncs = require('@local/utils');
const positionFuncs = require('@local/position');

const Square = require('@local/square');
const Piece = require('@local/piece');
const BoardLabel = require('@local/boardLabel');

class Turn {
  constructor(global, turnObject = null) {
    this.global = global;

    this.layer = new this.global.PIXI.Container();
    this.layers = {
      boardShadow: new this.global.PIXI.Container(),
      boardBorder: new this.global.PIXI.Container(),
      squares: new this.global.PIXI.Container(),
      labels: new this.global.PIXI.Container(),
      pieces: new this.global.PIXI.Container(),
    };
    this.global.layers.layers.board.addChild(this.layer);
    this.layer.addChild(this.layers.boardShadow);
    this.layer.addChild(this.layers.boardBorder);
    this.layer.addChild(this.layers.squares);
    this.layer.addChild(this.layers.labels);
    this.layer.addChild(this.layers.pieces);
    this.layers.boardShadow.interactiveChildren = false;
    this.layers.boardBorder.interactiveChildren = false;
    this.layers.labels.interactiveChildren = false;
    this.alphaFilter = new this.global.PIXI.filters.AlphaFilter();
    this.layer.filters = [this.alphaFilter];

    this.emitter = this.global.emitter;
    this.turnObject = {};
    this.squares = [];
    this.pieces = [];
    this.label;
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

    if(this.turnObject.ghost) {
      this.alphaFilter.alpha = this.global.configStore.get('board').ghostAlpha;
    }
    else { this.alphaFilter.alpha = 1; }

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
        this.graphics.beginTextureFill({
          texture: this.global.textureStore.get(`whiteBoardBorder`),
          color: this.global.paletteStore.get('board').whiteBorder,
        });
        this.graphics.lineStyle({
          width: this.global.configStore.get('board').borderLineWidth,
          color: this.global.paletteStore.get('board').whiteBorderOutline,
          alignment: 0
        });
      }
      else {
        this.graphics.beginTextureFill({
          texture: this.global.textureStore.get(`blackBoardBorder`),
          color: this.global.paletteStore.get('board').blackBorder,
        });
        this.graphics.lineStyle({
          width: this.global.configStore.get('board').borderLineWidth,
          color: this.global.paletteStore.get('board').blackBorderOutline,
          alignment: 0
        });
      }
      if(!this.turnObject.active) {
        this.graphics.beginTextureFill({
          texture: this.global.textureStore.get(`inactiveBoardBorder`),
          color: this.global.paletteStore.get('board').inactiveBorder,
        });
        this.graphics.lineStyle({
          width: this.global.configStore.get('board').borderLineWidth,
          color: this.global.paletteStore.get('board').inactiveBorderOutline,
          alignment: 0
        });
      }
      if(this.turnObject.check) {
        this.graphics.beginTextureFill({
          texture: this.global.textureStore.get(`checkBoardBorder`),
          color: this.global.paletteStore.get('board').checkBorder,
        });
        this.graphics.lineStyle({
          width: this.global.configStore.get('board').borderLineWidth,
          color: this.global.paletteStore.get('board').checkBorderOutline,
          alignment: 0
        });
      }
      this.graphics.drawRoundedRect(
        this.coordinates.board.x - this.global.configStore.get('board').borderWidth,
        this.coordinates.board.y - this.global.configStore.get('board').borderHeight,
        this.coordinates.board.width + (this.global.configStore.get('board').borderWidth * 2),
        this.coordinates.board.height + (this.global.configStore.get('board').borderHeight * 2),
        this.global.configStore.get('board').borderRadius
      );
      this.graphics.endFill();
      if(this.global.configStore.get('boardShadow').show) {
        this.shadowGraphics = new this.global.PIXI.Graphics();
        this.shadowGraphics.beginFill(this.global.paletteStore.get('boardShadow').shadow);
        this.shadowGraphics.drawRoundedRect(
          (this.coordinates.board.x - this.global.configStore.get('board').borderWidth) + this.global.configStore.get('boardShadow').offsetX,
          (this.coordinates.board.y - this.global.configStore.get('board').borderHeight) + this.global.configStore.get('boardShadow').offsetY,
          this.coordinates.board.width + (this.global.configStore.get('board').borderWidth * 2),
          this.coordinates.board.height + (this.global.configStore.get('board').borderHeight * 2),
          this.global.configStore.get('board').borderRadius
        );
        this.shadowGraphics.alpha = this.global.configStore.get('boardShadow').alpha;
        this.layers.boardShadow.addChild(this.shadowGraphics);
      }
      this.layers.boardBorder.addChild(this.graphics);
      //Initialize animation
      this.fadeIn();
    }

    //Start and stop blink for present boards
    if(this.global.configStore.get('board').showPresentBlink) {
      if(this.turnObject.present) { this.startBlink(); }
      else { this.stopBlink(); }
    }
    else {
      if(typeof this.blinkGraphics !== 'undefined') { this.stopBlink(); }
    }

    //Creating new squares array
    var squares = [];
    for(var r = 0;r < this.global.boardObject.height;r++) {
      for(var f = 0;f < this.global.boardObject.width;f++) {
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
        this.squares.push(new Square(this.global, squares[j].squareObject, this.layers.squares));
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
        this.pieces.push(new Piece(this.global, this.turnObject.pieces[j], this.layers.pieces));
      }
    }

    //Create or update label
    if(typeof this.label !== 'undefined') {
      this.label.update(this.turnObject);
    }
    else {
      this.label = new BoardLabel(this.global, this.turnObject, this.layers.labels);
    }
  }
  fadeIn() {
    this.graphics.alpha = 0;
    this.pastCoordinates = positionFuncs.toCoordinates({
      timeline: this.turnObject.timeline,
      turn: this.turnObject.player === 'white' ? this.turnObject.turn - 1 : this.turnObject.turn,
      player: this.turnObject.player === 'white' ? 'black' : 'white',
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    if(this.shadowGraphics) {
      this.shadowGraphics.alpha = 0;
    }
    this.fadeDelay = this.global.configStore.get('ripple').timelineDuration * Math.abs(this.turnObject.timeline);
    this.fadeDelay += this.global.configStore.get('ripple').turnDuration * ((this.turnObject.turn * 2 )+ (this.turnObject.player === 'white' ? 0 : 1));
    this.fadeLeft = this.global.configStore.get('board').fadeDuration;
    this.fadeDuration = this.fadeLeft;
    this.global.app.ticker.add(this.fadeInAnimate, this);
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
        this.layer.x = 0;
        this.global.app.ticker.remove(this.fadeInAnimate, this);
      }
      else {
        var progress = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        var diffWidth = this.coordinates.boardWithMargins.x - this.pastCoordinates.boardWithMargins.x;
        if(this.global.configStore.get('board').slideBoard) {
          this.layer.x = -diffWidth * (1 - progress);
        }
        else {
          this.layer.x = 0;
        }
        this.graphics.alpha = progress;
        if(this.shadowGraphics) {
          this.shadowGraphics.alpha = this.global.configStore.get('boardShadow').alpha * progress;
        }
      }
    }
  }
  startBlink() {
    if(typeof this.blinkGraphics === 'undefined') {
      this.blinkGraphics = new this.global.PIXI.Graphics();
      this.blinkGraphics.beginFill(0x000000, 0);
      if(this.turnObject.player === 'black') {
        this.blinkGraphics.lineStyle({
          width: this.global.configStore.get('board').borderLineWidth,
          color: this.global.paletteStore.get('board').whiteBorderOutline,
          alignment: 0
        });
      }
      else {
        this.blinkGraphics.lineStyle({
          width: this.global.configStore.get('board').borderLineWidth,
          color: this.global.paletteStore.get('board').blackBorderOutline,
          alignment: 0
        });
      }
      this.blinkGraphics.drawRoundedRect(
        this.coordinates.board.x - this.global.configStore.get('board').borderWidth,
        this.coordinates.board.y - this.global.configStore.get('board').borderHeight,
        this.coordinates.board.width + (this.global.configStore.get('board').borderWidth * 2),
        this.coordinates.board.height + (this.global.configStore.get('board').borderHeight * 2),
        this.global.configStore.get('board').borderRadius
      );
      this.blinkGraphics.alpha = 0;
      this.layers.boardBorder.addChild(this.blinkGraphics);
    }
    this.blinkDirection = 1;
    this.blinkLeft = this.global.configStore.get('board').blinkDuration;
    this.blinkDuration = this.blinkLeft;
    this.global.app.ticker.add(this.blinkAnimate, this);
  }
  stopBlink() {
    if(typeof this.blinkGraphics !== 'undefined') {
      this.blinkGraphics.destroy();
    }
    this.blinkGraphics = undefined;
    this.global.app.ticker.remove(this.blinkAnimate, this);
  }
  blinkAnimate(delta) {
    if(typeof this.blinkGraphics !== 'undefined') {
      this.blinkLeft -= (delta / 60) * 1000;
      if(this.blinkLeft <= 0) {
        this.blinkLeft = this.blinkDuration;
        if(this.blinkDirection > 0) { this.blinkGraphics.alpha = 1; }
        else { this.blinkGraphics.alpha = 0; }
        this.blinkDirection = -1 * this.blinkDirection;
      }
      else {
        var progress = (this.blinkDuration - this.blinkLeft) / this.blinkDuration;
        if(this.blinkDirection > 0) { this.blinkGraphics.alpha = progress; }
        else { this.blinkGraphics.alpha = 1 - progress; }
      }
    }
  }
  destroy() {
    //Calling destroy on children
    for(var i = 0;i < this.pieces.length;i++) {
      this.pieces[i].destroy();
      this.pieces.splice(i, 1);
      i--;
    }
    for(var i = 0;i < this.squares.length;i++) {
      this.squares[i].destroy();
      this.squares.splice(i, 1);
      i--;
    }
    if(typeof this.label !== 'undefined') {
      this.label.destroy();
    }
    this.stopBlink();
    
    //Skip destroy if not needed
    if(typeof this.graphics === 'undefined') { return null; }
    this.tmpGraphics = this.graphics;
    this.graphics = undefined;
    if(this.shadowGraphics) {
      this.tmpShadowGraphics = this.shadowGraphics;
      this.shadowGraphics = undefined;
    }
    this.fadeDelay = this.global.configStore.get('ripple').timelineDuration * Math.abs(this.turnObject.timeline);
    this.fadeDelay += this.global.configStore.get('ripple').turnDuration * ((this.turnObject.turn * 2 )+ (this.turnObject.player === 'white' ? 0 : 1));
    this.fadeLeft = this.global.configStore.get('board').fadeDuration;
    this.fadeDuration = this.fadeLeft;
    this.global.app.ticker.add(this.fadeOutAnimate, this);
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
        this.global.app.ticker.remove(this.fadeOutAnimate, this);
      }
      else {
        this.tmpGraphics.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        if(this.tmpShadowGraphics) {
          this.tmpShadowGraphics.alpha =
            this.global.configStore.get('boardShadow').alpha *
            (1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration));
        }
      }
    }
  }
}

module.exports = Turn;
