const deepcopy = require('deepcopy');
const deepmerge = require('deepmerge');

class Config {
  constructor(customConfig = null) {
    this.config = {
      app: {
        height: 600,
        width: 800,
        preserveDrawingBuffer: false,
        antialias: true,
        forceCanvas: false,
      },
      viewport: {
        drag: true,
        dragDirection: 'all',
        dragPressDrag: true,
        dragWheel: true,
        dragWheelScroll: 1,
        dragReverse: false,
        dragClampWheel: false,
        dragUnderflow: 'center',
        dragFactor: 1,
        dragMouseButtons: 'all',
        pinch: true,
        pinchNoDrag: false,
        pinchPercent: 1,
        pinchFactor: 1,
        wheel: true,
        wheelPercent: 0.1,
        wheelSmooth: false,
        wheelReverse: false,
        decelerate: true,
        decelerateFriction: 0.95,
        decelerateBounce: 0.8,
        decelerateMinSpeed: 0.01,
        bounce: true,
        bounceHeightFactor: 0.5,
        bounceWidthFactor: 0.5,
        bounceFriction: 0.5,
        bounceTime: 150,
        bounceEase: 'easeInOutSine',
        clampZoom: true,
        clampZoomHeightFactor: 1.1,
        clampZoomWidthFactor: 1.1,
        snapFriction: 0.8,
        snapTime: 1000,
        snapEase: 'easeInOutSine',
        snapZoomTime: 1000,
        snapZoomEase: 'easeInOutSine',
      },
      fps: {
        show: false,
        align: 'center',
        fontFamily: 'Arial',
        fontSize: 30,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textBaseline: 'alphabetic',
        min: 20,
        max: 0,
      },
      background: {
        showRectangle: true,
        blur: true,
        blurStrength: 3,
        blurQuality: 3,
        /// If set to true, a background with diagonal stripes will be shown behind timelines that would be inactive.
        /// This makes it easy to see how many inactive timelines there are and how many timelines can be created before they become inactive.
        striped: true,
        /// Value between `0` and `1`, representing the ratio between shaded/non-shaded areas of the striped background.
        /// A value of `0` will cause the background to not show any stripes, a value of `1` to have the background be a flat shade of the stripe colors.
        /// A value of `0.5` will cause the stripes to take up half of the area. Default is `0.333`.
        stripeRatio: 0.333,
        expandDuration: 1000,
      },
      board: {
        showWhite: true,
        showBlack: true,
        showGhost: true,
        showPresentBlink: true,
        marginHeight: 140,
        marginWidth: 140,
        borderHeight: 50,
        borderWidth: 50,
        borderRadius: 45,
        borderLineWidth: 12,
        flipTimeline: false,
        flipTurn: false,
        flipRank: false,
        flipFile: false,
        ghostAlpha: 0.4,
        slideBoard: false,
        fadeDuration: 450,
        blinkDuration: 750,
      },
      boardLabel: {
        showTimeline: true,
        showMiddleTimeline: false,
        rotateTimelineLabel: true,
        timelineTextOptions: {
          align: 'center',
          fontFamily: 'Times New Roman',
          fontSize: 96,
          fontStyle: 'italic',
          fontWeight: 'bold',
          textBaseline: 'alphabetic',
        },
        showTurn: true,
        turnTextOptions: {
          align: 'center',
          fontFamily: 'Times New Roman',
          fontSize: 96,
          fontStyle: 'italic',
          fontWeight: 'bold',
          textBaseline: 'alphabetic',
        },
        showFile: true,
        fileTextOptions: {
          align: 'center',
          fontFamily: 'Times New Roman',
          fontSize: 36,
          fontStyle: 'normal',
          fontWeight: 'bold',
          textBaseline: 'bottom',
        },
        showRank: true,
        rankTextOptions: {
          align: 'center',
          fontFamily: 'Times New Roman',
          fontSize: 36,
          fontStyle: 'normal',
          fontWeight: 'bold',
          textBaseline: 'bottom',
        },
        fadeDuration: 250,
      },
      boardShadow: {
        show: true,
        offsetX: 40,
        offsetY: 40,
        alpha: 0.25,
      },
      square: {
        height: 100,
        width: 100,
        fadeDuration: 150,
      },
      piece: {
        fadeDuration: 150,
        roundPixel: true,
      },
      arrow: {
        lutInterval: 10,
        headSize: 35,
        size: 12,
        midpointRadius: 11,
        outlineSize: 22,
        animateDuration: 650,
        alpha: 0.6,
        showSpatial: true,
        spatialCurved: true,
        spatialSplitCurve: false,
        spatialMiddle: false,
        spatialRealEnd: false,
        showNonSpatial: true,
        nonSpatialCurved: true,
        nonSpatialSplitCurve: true,
        nonSpatialMiddle: true,
        nonSpatialRealEnd: true,
        showCustom: true,
        customCurved: true,
        customSplitCurve: true,
      },
      highlight: {
        hoverAlpha: 0.4,
        pastHoverAlpha: 0.2,
        selectedAlpha: 0.6,
        pastSelectedAlpha: 0.4,
        fadeDuration: 75,
      },
      ripple: {
        timelineDuration: 40,
        turnDuration: 20,
        rankDuration: 15,
        fileDuration: 15,
      },
    };

    if(customConfig !== null) {
      this.set(customConfig);
    }
  }
  set(key, value = null) {
    if(value === null) {
      this.config = deepmerge(this.config, deepcopy(key));
    }
    else {
      this.config[key] = deepmerge(this.config[key], deepcopy(value));
    }
  }
  get(key = null) {
    if(key === null) {
      return this.config;
    }
    return this.config[key];
  }
}

module.exports = Config;
