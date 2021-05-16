const utilsFuncs = require('@local/utils');
const positionFuncs = require('@local/position');

class Piece {
  constructor(global, pieceObject = null, layer = null) {
    this.global = global;
    this.layer = this.global.layers.layers.pieces;
    if(layer !== null) {
      this.layer = layer;
    }
    
    this.emitter = this.global.emitter;
    this.pieceObject = {};
    if(pieceObject !== null) {
      this.update(pieceObject);
    }

    this.emitter.on('textureUpdate', this.refresh.bind(this));
  }
  refresh() {
    this.destroy();
    this.update(this.pieceObject);
  }
  update(pieceObject) {
    //Assign pieceObj to instance variables
    this.pieceObject = pieceObject;
    //Change empty string to P for easier sprite texture loading
    if(this.pieceObject.piece === '') { this.pieceObject.piece = 'P'; }
    
    var coordinates = positionFuncs.toCoordinates(this.pieceObject.position, this.global);
    //Load and animate sprite if needed
    if(positionFuncs.compare(coordinates, this.coordinates) !== 0) {
      if(typeof this.sprite !== 'undefined') {
        this.destroy();
      }

      this.coordinates = coordinates;
      this.key = utilsFuncs.pieceObjectKey(this.pieceObject);
      this.squareKey = utilsFuncs.squareObjectKey(this.pieceObject.position);
      this.sprite = new this.global.PIXI.Sprite(this.global.textureStore.get(`${this.pieceObject.player}${this.pieceObject.piece}`));
      this.sprite.width = this.global.configStore.get('piece').width;
      this.sprite.height = this.global.configStore.get('piece').height;
      this.sprite.anchor.set(0.5);
      this.sprite.x = this.coordinates.square.center.x;
      this.sprite.y = this.coordinates.square.center.y;
      this.layer.addChild(this.sprite);
      //Add interaction if needed
      this.interact();
  
      //Initialize animation
      this.fadeIn();
    }
    this.sprite.roundPixels = this.global.configStore.get('piece').roundPixel;
  }
  interact() {
    //Add interactive events
    this.sprite.interactive = true;
    //TODO: Fix hitArea
    this.sprite.hitArea = new this.global.PIXI.Rectangle(
      -this.coordinates.square.width / 2,
      -this.coordinates.square.height / 2,
      this.coordinates.square.width,
      this.coordinates.square.height
    );
    this.sprite.on('pointertap', (event) => {
      this.emitter.emit('squareTap', {
        key: this.squareKey,
        squareObject: this.pieceObject.position,
        coordinates: this.coordinates,
        sourceEvent: event
      });
      if(this.global.customArrowMode) { return null; }
      this.emitter.emit('pieceTap', {
        key: this.key,
        squareKey: this.squareKey,
        pieceObject: this.pieceObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
    this.sprite.on('pointerover', (event) => {
      this.emitter.emit('squareOver', {
        key: this.squareKey,
        squareObject: this.pieceObject.position,
        coordinates: this.coordinates,
        sourceEvent: event
      });
      if(this.global.customArrowMode) { return null; }
      this.emitter.emit('pieceOver', {
        key: this.key,
        squareKey: this.squareKey,
        pieceObject: this.pieceObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
    this.sprite.on('pointerout', (event) => {
      this.emitter.emit('squareOut', {
        key: this.squareKey,
        squareObject: this.pieceObject.position,
        coordinates: this.coordinates,
        sourceEvent: event
      });
      if(this.global.customArrowMode) { return null; }
      this.emitter.emit('pieceOut', {
        key: this.key,
        squareKey: this.squareKey,
        pieceObject: this.pieceObject,
        coordinates: this.coordinates,
        sourceEvent: event
      });
    });
  }
  fadeIn() {
    this.sprite.alpha = 0;
    this.sprite.width = 0;
    this.sprite.height = 0;
    this.fadeDelay = this.global.configStore.get('ripple').timelineDuration * Math.abs(this.pieceObject.position.timeline);
    this.fadeDelay += this.global.configStore.get('ripple').turnDuration * ((this.pieceObject.position.turn * 2 )+ (this.pieceObject.position.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.configStore.get('ripple').rankDuration * this.pieceObject.position.rank;
    this.fadeDelay += this.global.configStore.get('ripple').fileDuration * this.pieceObject.position.file;
    this.fadeLeft = this.global.configStore.get('piece').fadeDuration;
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
    else if(this.sprite && this.sprite.alpha < 1) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.sprite.alpha = 1;
        this.sprite.width = this.global.configStore.get('piece').width;
        this.sprite.height = this.global.configStore.get('piece').height;
        this.global.app.ticker.remove(this.fadeInAnimate, this);
      }
      else {
        this.sprite.alpha = (this.fadeDuration - this.fadeLeft) / this.fadeDuration;
        this.sprite.width = this.sprite.alpha * this.global.configStore.get('piece').width;
        this.sprite.height = this.sprite.alpha * this.global.configStore.get('piece').height;
      }
    }
  }
  destroy() {
    //Skip destroy if not needed
    if(typeof this.sprite === 'undefined') { return null; }
    this.tmpCoordinates = this.coordinates;
    this.coordinates = undefined;
    this.tmpSprite = this.sprite;
    this.sprite = undefined;
    this.fadeDelay = this.global.configStore.get('ripple').timelineDuration * Math.abs(this.pieceObject.position.timeline);
    this.fadeDelay += this.global.configStore.get('ripple').turnDuration * ((this.pieceObject.position.turn * 2 )+ (this.pieceObject.position.player === 'white' ? 0 : 1));
    this.fadeDelay += this.global.configStore.get('ripple').rankDuration * this.pieceObject.position.rank;
    this.fadeDelay += this.global.configStore.get('ripple').fileDuration * this.pieceObject.position.file;
    this.fadeLeft = this.global.configStore.get('piece').fadeDuration;
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
    else if(this.tmpSprite && this.tmpSprite.alpha > 0) {
      this.fadeLeft -= (delta / 60) * 1000;
      if(this.fadeLeft <= 0) {
        this.fadeLeft = 0;
        this.tmpSprite.destroy();
        this.tmpSprite = undefined;
        this.global.app.ticker.remove(this.fadeOutAnimate, this);
      }
      else {
        this.tmpSprite.alpha = 1 - ((this.fadeDuration - this.fadeLeft) / this.fadeDuration);
        this.tmpSprite.width = this.tmpSprite.alpha * this.global.configStore.get('piece').width;
        this.tmpSprite.height = this.tmpSprite.alpha * this.global.configStore.get('piece').height;
      }
    }
  }
}

module.exports = Piece;