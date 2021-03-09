const positionFuncs = require('@local/position');
const OMEGA = 1e24;

const deepequal = require('fast-deep-equal');

class Background {
  constructor(global) {
    this.global = global;
    this.layer = this.global.layers.layers.background;
    this.emitter = this.global.emitter;
    this.sprite = null;
    this.spriteStripedWhite = null; // Hard to pronounce :)
    this.spriteStripedBlack = null;
    this.texture = null;
    this.textureStripedWhite = null;
    this.textureStripedBlack = null;
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.activeLow = null;
    this.activeHigh = null;
    this.twoBoards = true; // True if there are two boards per turn, false otherwise
    this.flipTimeline = false;
    this.emitter = this.global.emitter;
    this.update();
    this.emitter.on('boardUpdate', this.update.bind(this));
    this.emitter.on('configUpdate', this.update.bind(this));
    this.emitter.on('paletteUpdate', this.update.bind(this));
  }
  refresh() {
    this.destroy();
    this.update();
  }
  update() {
    var coordinates = positionFuncs.toCoordinates({
      timeline: 0,
      turn: 1,
      player: 'white',
      coordinate: 'a1',
      rank: 1,
      file: 1
    }, this.global);
    if(
      positionFuncs.compare(coordinates, this.coordinates) !== 0 ||
      !deepequal(this.configBackground, this.global.config.get('background')) ||
      !deepequal(this.paletteBackground, this.global.palette.get('background')) ||
      (this.global.config.get('board').showWhite === this.global.config.get('board').showBlack) !== this.twoBoards ||
      this.flipTimeline !== this.global.config.get('board').flipTimeline
    ) {
      this.destroy();
      this.coordinates = coordinates;
      this.configBackground = this.global.config.get('background');
      this.paletteBackground = this.global.palette.get('background');
      this.twoBoards = this.global.config.get('board').showWhite === this.global.config.get('board').showBlack;
      this.flipTimeline = this.global.config.get('board').flipTimeline;

      this.baseWidth = this.coordinates.boardWithMargins.width * (this.twoBoards ? 2 : 1);
      this.baseHeight = this.coordinates.boardWithMargins.height;
    }

    //Generate texture if needed
    if(this.texture === null) {
      var graphics = new this.global.PIXI.Graphics();
      graphics.beginFill(this.global.palette.get('background').darkRectangle);
      graphics.drawRect(0, 0, this.baseWidth * 2, this.baseHeight * 2);
      graphics.endFill();
      graphics.beginFill(this.global.palette.get('background').lightRectangle);
      graphics.drawRect(this.baseWidth * 0, this.baseHeight * 1, this.baseWidth, this.baseHeight);
      graphics.drawRect(this.baseWidth * 1, this.baseHeight * 0, this.baseWidth, this.baseHeight);
      graphics.endFill();
      this.texture = this.global.app.renderer.generateTexture(graphics);
    }

    let generateStripedTexture = (whiteColor, blackColor) => {
      var graphics = new this.global.PIXI.Graphics();
      graphics.beginFill(this.global.palette.get('background').darkRectangle);
      graphics.drawRect(0, 0, this.baseWidth * 2, this.baseHeight * 2);
      graphics.endFill();
      graphics.beginFill(this.global.palette.get('background').lightRectangle);
      graphics.drawRect(this.baseWidth * 0, this.baseHeight * 1, this.baseWidth, this.baseHeight);
      graphics.drawRect(this.baseWidth * 1, this.baseHeight * 0, this.baseWidth, this.baseHeight);
      graphics.endFill();

      // Board half-width, used for stripes
      var stripe_w = this.baseWidth / (this.twoBoards ? 4 : 2);
      // Board half-height, used for stripes
      var stripe_h = this.baseHeight / 2;
      // Stripe width at its intersection with background tile borders; the actual width will be `stripe_delta / √2`
      const stripe_delta = this.baseWidth / (this.twoBoards ? 12 : 6);
      const stripe_delta_2 = stripe_delta / this.baseWidth * this.baseHeight * (this.twoBoards ? 2 : 1);

      for (let n = 0; n < 4; n++) {
        let sx = (n % 2) * this.baseWidth;
        let sy = (n >> 1) * this.baseHeight;

        // Maybe add new palette entries
        if(n === 0 || n === 3) {
          graphics.beginFill(blackColor);
        }
        else {
          graphics.beginFill(whiteColor);
        }

        // Polygon time!
        // See https://cdn.discordapp.com/attachments/810644929754824734/812268140993314846/Screenshot_2021-02-19_11-23-24.png

        if (this.twoBoards) {
          // Stripe A, two boards per turn
          graphics.drawPolygon([
            [0, stripe_h - stripe_delta_2],
            [stripe_w - stripe_delta, 0],
            [stripe_w + stripe_delta, 0],
            [0, stripe_h + stripe_delta_2],
          ].map(([x, y]) => new this.global.PIXI.Point(sx + x, sy + y)));

          // Stripe B, two boards per turn
          graphics.drawPolygon([
            [stripe_w - stripe_delta, 2 * stripe_h],
            [stripe_w + stripe_delta, 2 * stripe_h],
            [3 * stripe_w + stripe_delta, 0],
            [3 * stripe_w - stripe_delta, 0],
          ].map(([x, y]) => new this.global.PIXI.Point(sx + x, sy + y)));

          // Stripe C, two boards per turn
          graphics.drawPolygon([
            [3 * stripe_w - stripe_delta, 2 * stripe_h],
            [3 * stripe_w + stripe_delta, 2 * stripe_h],
            [4 * stripe_w, stripe_h + stripe_delta_2],
            [4 * stripe_w, stripe_h - stripe_delta_2],
          ].map(([x, y]) => new this.global.PIXI.Point(sx + x, sy + y)));
        } else {
          // Stripe A, one board per turn
          graphics.drawPolygon([
            [0, stripe_h - stripe_delta_2],
            [stripe_w - stripe_delta, 0],
            [stripe_w + stripe_delta, 0],
            [0, stripe_h + stripe_delta_2],
          ].map(([x, y]) => new this.global.PIXI.Point(sx + x, sy + y)));

          // Stripe B, one board per turn
          graphics.drawPolygon([
            [stripe_w - stripe_delta, 2 * stripe_h],
            [stripe_w + stripe_delta, 2 * stripe_h],
            [2 * stripe_w, stripe_h + stripe_delta_2],
            [2 * stripe_w, stripe_h - stripe_delta_2],
          ].map(([x, y]) => new this.global.PIXI.Point(sx + x, sy + y)));
        }

        graphics.endFill();
      }
      return this.global.app.renderer.generateTexture(graphics);
    };

    if (this.textureStripedBlack === null) {
      this.textureStripedBlack = generateStripedTexture(
        this.global.palette.get('background').lightStripeBlack,
        this.global.palette.get('background').darkStripeBlack,
      );
    }

    if (this.textureStripedWhite === null) {
      this.textureStripedWhite = generateStripedTexture(
        this.global.palette.get('background').lightStripeWhite,
        this.global.palette.get('background').darkStripeWhite,
      );
    }

    //Drawing background stripes
    if(this.spriteStripedBlack === null && this.global.config.get('background').striped && this.global.config.get('background').showRectangle) {
      this.spriteStripedBlack = new this.global.PIXI.TilingSprite(
        this.textureStripedBlack,
        this.baseWidth * 250,
        this.baseHeight * 500
      );
      this.spriteStripedBlack.anchor.set(0.5, this.flipTimeline ? 0 : 1);
      this.spriteStripedBlack.x = this.coordinates.boardWithMargins.x;
      this.spriteStripedBlack.y = this.coordinates.boardWithMargins.y;
      if(this.global.config.get('background').blur) {
        var blurFilter = new this.global.PIXI.filters.BlurFilter(this.global.config.get('background').blurStrength);
        blurFilter.quality = this.global.config.get('background').blurQuality;
        this.spriteStripedBlack.filters = [blurFilter];
      }
      this.layer.addChild(this.spriteStripedBlack);
    }

    if(this.spriteStripedWhite === null && this.global.config.get('background').striped && this.global.config.get('background').showRectangle) {
      this.spriteStripedWhite = new this.global.PIXI.TilingSprite(
        this.textureStripedWhite,
        this.baseWidth * 250,
        this.baseHeight * 500
      );
      this.spriteStripedWhite.anchor.set(0.5, this.flipTimeline ? 1 : 0);
      this.spriteStripedWhite.x = this.coordinates.boardWithMargins.x;
      this.spriteStripedWhite.y = this.coordinates.boardWithMargins.y;
      if(this.global.config.get('background').blur) {
        var blurFilter = new this.global.PIXI.filters.BlurFilter(this.global.config.get('background').blurStrength);
        blurFilter.quality = this.global.config.get('background').blurQuality;
        this.spriteStripedWhite.filters = [blurFilter];
      }
      this.layer.addChild(this.spriteStripedWhite);
    }

    //Drawing background squares
    if(this.sprite === null && this.global.config.get('background').showRectangle) {
      this.sprite = new this.global.PIXI.TilingSprite(
        this.texture,
        this.baseWidth * 250,
        this.baseHeight * 250
      );
      this.sprite.anchor.set(0.5, 0.5);
      this.sprite.x = this.coordinates.boardWithMargins.x;
      this.sprite.y = this.coordinates.boardWithMargins.y;
      if(this.global.config.get('background').blur) {
        var blurFilter = new this.global.PIXI.filters.BlurFilter(this.global.config.get('background').blurStrength);
        blurFilter.quality = this.global.config.get('background').blurQuality;
        this.sprite.filters = [blurFilter];
      }

      this.layer.addChild(this.sprite);
    }
    else if(this.sprite !== null && !this.global.config.get('background').showRectangle) {
      this.destroy();
    }

    // "Mask" the non-striped layer to only show it on the active timelines
    if (this.global.config.get('background').striped && this.global.board && this.global.config.get('background').showRectangle) {
      let minTimeline = Math.min();
      let maxTimeline = Math.max();

      for (let timeline of this.global.board.timelines) {
        minTimeline = Math.min(minTimeline, timeline.timeline);
        maxTimeline = Math.max(maxTimeline, timeline.timeline);
      }

      let activeLow = -maxTimeline - 1;
      let activeHigh = -minTimeline + 1;

      if (this.flipTimeline) {
        activeLow = minTimeline - 1;
        activeHigh = maxTimeline + 1;
      }

      if(this.activeLow !== activeLow || this.activeHigh !== activeHigh) {
        this.prevActiveLow = this.activeLow;
        this.prevActiveHigh = this.activeHigh;
        this.activeLow = activeLow;
        this.activeHigh = activeHigh;

        if(this.prevActiveLow === null || this.prevActiveHigh === null) {
          this.sprite.y = this.coordinates.boardWithMargins.height * this.activeLow;
          this.sprite.height = this.coordinates.boardWithMargins.height * (this.activeHigh - this.activeLow + 1);
          this.sprite.anchor.set(0.5,0);
          if(Math.abs(this.activeLow) % 2 === 0) { this.sprite.tilePosition.set(0,0); }
          else { this.sprite.tilePosition.set(0, this.coordinates.boardWithMargins.height); }
        }
        else {
          //Trigger expansion animation
          this.expandLeft = this.global.config.get('background').expandDuration * Math.abs(Math.abs(this.activeHigh - this.activeLow) - Math.abs(this.prevActiveHigh - this.prevActiveLow));
          this.expandDuration = this.expandLeft;
          this.global.PIXI.Ticker.shared.add(this.expandAnimate, this);
        }
      }
    }
  }
  expandAnimate(delta) {
    this.expandLeft -= (delta / 60) * 1000;
    if(this.expandLeft <= 0) {
      this.expandLeft = 0;
      this.sprite.y = this.coordinates.boardWithMargins.height * this.activeLow;
      this.sprite.height = this.coordinates.boardWithMargins.height * (this.activeHigh - this.activeLow + 1);
      this.sprite.anchor.set(0.5,0);
      if(Math.abs(this.activeLow) % 2 === 0) { this.sprite.tilePosition.set(0,0); }
      else { this.sprite.tilePosition.set(0, this.coordinates.boardWithMargins.height); }
      this.global.PIXI.Ticker.shared.remove(this.expandAnimate, this);
    }
    else {
      var progress = (this.expandDuration - this.expandLeft) / this.expandDuration;
      this.sprite.y = this.coordinates.boardWithMargins.height * (this.prevActiveLow + ((this.activeLow - this.prevActiveLow) * progress));
      var prevHeight = (this.prevActiveHigh - this.prevActiveLow + 1);
      var height = (this.activeHigh - this.activeLow + 1);
      this.sprite.height = this.coordinates.boardWithMargins.height * (prevHeight + ((height - prevHeight) * progress));
      this.sprite.anchor.set(0.5,0);
      this.sprite.tilePosition.set(0,-this.sprite.y);
    }
  }
  destroy() {
    this.coordinates = undefined;
    this.baseWidth = 0;
    this.baseHeight = 0;
    this.prevActiveLow = null;
    this.prevActiveHigh = null;
    this.activeLow = null;
    this.activeHigh = null;
    if(this.texture !== null) {
      this.texture.destroy();
      this.texture = null;
    }
    if(this.sprite !== null) {
      this.sprite.destroy();
      this.sprite = null;
    }
    if(this.textureStripedBlack !== null) {
      this.textureStripedBlack.destroy();
      this.textureStripedBlack = null;
    }
    if(this.spriteStripedBlack !== null) {
      this.spriteStripedBlack.destroy();
      this.spriteStripedBlack = null;
    }
    if(this.textureStripedWhite !== null) {
      this.textureStripedWhite.destroy();
      this.textureStripedWhite = null;
    }
    if(this.spriteStripedWhite !== null) {
      this.spriteStripedWhite.destroy();
      this.spriteStripedWhite = null;
    }
  }
}

module.exports = Background;
