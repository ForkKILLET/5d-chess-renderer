const PIXI = require('pixi.js-legacy');

const positionFuncs = require('@local/position');
const config = require('@local/config');

class Piece {
  constructor(layer, emitter, coordinateOptions, pieceObj, oldPieceObj = null) {
    //Assign pieceObj to instance variables
    this.pieceObject = pieceObj;
    if(this.pieceObject.piece === '') { this.pieceObject.piece = 'P'; }
    this.sourceCoordinates = positionFuncs.toCoordinates(this.pieceObject.position, coordinateOptions);
    this.targetCoordinates = positionFuncs.copy(this.sourceCoordinates);
    this.key = `${this.pieceObject.player}${this.pieceObject.piece}_${this.pieceObject.position.timeline}_${this.pieceObject.position.player}${this.pieceObject.position.turn}_${this.pieceObject.position.coordinate}`;
    this.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[`${this.pieceObject.player}${this.pieceObject.piece}`]);
    this.sprite.width = config.get('squareWidth');
    this.sprite.height = config.get('squareHeight');
    this.sprite.anchor.set(0.5);
    this.sprite.visible = false;
    layer.addChild(this.sprite);
    
    //Assign oldPieceObj to instance variables if old piece is passed
    this.old = null;
    if(oldPieceObj !== null) {
      this.old = {};
      this.old.pieceObject = oldPieceObj;
      if(this.old.pieceObject.piece === '') { this.old.pieceObject.piece = 'P'; }
      this.sourceCoordinates = positionFuncs.toCoordinates(this.old.pieceObject.position, coordinateOptions);
      this.old.differentSprite = `${this.pieceObject.player}${this.pieceObject.piece}` !== `${this.old.pieceObject.player}${this.old.pieceObject.piece}`;
      if(this.old.differentSprite) {
        this.old.sprite = new PIXI.Sprite(PIXI.utils.TextureCache[`${this.old.pieceObject.player}${this.old.pieceObject.piece}`]);
        this.old.sprite.width = config.get('squareWidth');
        this.old.sprite.height = config.get('squareHeight');
        this.old.sprite.anchor.set(0.5);
        this.old.sprite.visible = false;
        layer.addChild(this.old.sprite);
      }
    }

    //Add interactive events
    if(config.get('pieceEvents')) {
      this.sprite.interactive = true;
      this.sprite.hitArea = new PIXI.Rectangle(this.sprite.x, this.sprite.y, this.sprite.width, this.sprite.height);
      this.sprite.on('pointertap', (event) => {
        emitter.emit('pieceTap', {
          key: this.key,
          pieceObject: this.pieceObject,
          coordinates: this.targetCoordinates,
          sourceEvent: event
        });
      });
      this.sprite.on('pointerover', (event) => {
        emitter.emit('pieceOver', {
          key: this.key,
          pieceObject: this.pieceObject,
          coordinates: this.targetCoordinates,
          sourceEvent: event
        });
      });
      this.sprite.on('pointerout', (event) => {
        emitter.emit('pieceOut', {
          key: this.key,
          pieceObject: this.pieceObject,
          coordinates: this.targetCoordinates,
          sourceEvent: event
        });
      });
    }

    //Initialize animation
    this.fade();
    this.move();
  }
  move() {
    this.sprite.x = this.sourceCoordinates.square.center.x;
    this.sprite.y = this.sourceCoordinates.square.center.y;
    if(this.old !== null && this.old.differentSprite) {
      this.old.sprite.x = this.sourceCoordinates.square.center.x;
      this.old.sprite.y = this.sourceCoordinates.square.center.y;
    }
    PIXI.Ticker.shared.add(this.moveAnimate.bind(this));
  }
  moveAnimate(delta) {
    //Animate moving
    var deltaTime = (delta / 60) * 1000;
    var deltaDistance = deltaTime * config.get('pieceMoveSpeed');
    var atan = Math.atan2(this.targetCoordinates.square.center.y - this.sourceCoordinates.square.center.y, this.targetCoordinates.square.center.x - this.sourceCoordinates.square.center.x);
    var deltaY = Math.sin(atan) * deltaDistance;
    var deltaX = Math.cos(atan) * deltaDistance;
    var done = deltaDistance >= Math.sqrt(Math.pow(this.targetCoordinates.square.center.y - this.sprite.y, 2) + Math.pow(this.targetCoordinates.square.center.x - this.sprite.x, 2)) * 0.99;
    if(done) {
      this.sprite.x = this.targetCoordinates.square.center.x;
      this.sprite.y = this.targetCoordinates.square.center.y;
      this.sourceCoordinates = positionFuncs.copy(this.targetCoordinates);
      PIXI.Ticker.shared.remove(this.moveAnimate);
    }
    else {
      this.sprite.x = this.sprite.x + deltaX;
      this.sprite.y = this.sprite.y + deltaY;
    }
    if(this.old !== null && this.old.differentSprite) {
      this.old.sprite.x = this.sprite.x;
      this.old.sprite.y = this.sprite.y;
    }
  }
  fade() {
    this.sprite.alpha = 0;
    this.sprite.visible = true;
    if(this.old !== null && this.old.differentSprite) {
      this.old.sprite.visible = true;
    }
    else if(this.old === null) {
      this.sprite.width = 0;
      this.sprite.height = 0;
    }
    this.fadeLeft = config.get('pieceFadeDuration');
    this.fadeDuration = config.get('pieceFadeDuration');
    PIXI.Ticker.shared.add(this.fadeAnimate.bind(this));
  }
  fadeAnimate(delta) {
    //Animate fading in
    if(this.sprite.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.sprite.alpha = 1;
        if(this.old !== null && this.old.differentSprite) {
          this.old.sprite.alpha = 0;
          this.destroyOld();
        }
        PIXI.Ticker.shared.remove(this.fadeAnimate);
      }
      else {
        this.sprite.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        if(this.old !== null && this.old.differentSprite) {
          this.old.sprite.alpha = this.fadeLeft / this.fadeDuration;
        }
        else if(this.old === null) {
          this.sprite.width = this.sprite.alpha * config.get('squareWidth');
          this.sprite.height = this.sprite.alpha * config.get('squareHeight');
        }
      }
    }
  }
  destroyOld() {
    if(this.old !== null) {
      if(this.old.differentSprite) {
        this.old.sprite.destroy();
      }
    }
    this.old = null;
  }
  destroy() {
    this.destroyOld();
    this.sprite.destroy();
  }
}

module.exports = Piece;