const deepcopy = require('deepcopy');
const deepmerge = require('deepmerge');

class Config {
  constructor(customConfig = null) {
    this.config = {
      app: {
        height: 600,                          //This option will only be used on creation, updating this value will not resize the renderer
                                              //Use this for when not attaching the canvas element to a HTMLElement (server-side, headless, etc.). No need to change if used normally.
        width: 800,                           //This option will only be used on creation, updating this value will not resize the renderer
                                              //Use this for when not attaching the canvas element to a HTMLElement (server-side, headless, etc.). No need to change if used normally.
        preserveDrawingBuffer: false,         //This option will only be used on creation, updating this will not change PIXI.Application instance behavior
                                              //Enables drawing buffer preservation, enable this if you need to call toDataUrl on the WebGL context.
        antialias: true,                      //This option will only be used on creation, updating this will not change PIXI.Application instance behavior
                                              //Sets antialias option inside PIXI.Application constructor (see https://pixijs.download/dev/docs/PIXI.Application.html#constructor)
        forceCanvas: false,                   //This option will only be used on creation, updating this will not change PIXI.Application instance behavior
                                              //Forces the usage of canvas based rendering instead of webgl. Using canvas based rendering is not recommended, as many effects such as transparency and blur do not work correctly.
        backgroundAlpha: 1,                   //Sets alpha of the solid background (does not effect squares background)
                                              //This option will only be used on creation, updating this will not change PIXI.Application instance behavior
        interactive: true,                    //Enables mouse / touch events
      },
      viewport: {
        drag: true,                           //Enables viewport mouse / touch drag (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#drag)
        dragOptions: {                        //Options object for viewport drag plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#DragOptions)
          direction: 'all',
          pressDrag: true,
          wheel: true,
          wheelScroll: 1,
          reverse: false,
          clampWheel: false,
          underflow: 'center',
          factor: 1,
          mouseButtons: 'all',
        },
        pinch: true,                          //Enables viewport two-finger zoom / touch drag (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#pinch)
        pinchOptions: {                       //Options object for viewport pinch plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#PinchOptions)
          noDrag: false,
          percent: 1,
          factor: 1,
        },
        wheel: true,                          //Enables mouse wheel zoom (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#wheel)
        wheelOptions: {                       //Options object for viewport wheel plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#WheelOptions)
          percent: 0.1,
          smooth: false,
          reverse: false,
        },
        decelerate: true,                     //Enables move deceleration (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#decelerate)
        decelerateOptions: {                  //Options object for viewport decelerate plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#DecelerateOptions)
          friction: 0.95,
          bounce: 0.8,
          minSpeed: 0.01,
        },
        bounce: true,                         //Enables bouncing on borders (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#bounce)
        bounceOptions: {                      //Options object for viewport bounce plugin (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#bounce)
          sides: 'all',
          friction: 0.5,
          time: 150,
          ease: 'easeInOutSine',
          underflow: 'center',
        },
        bounceHeightFactor: 0.5,              //Percent of full board height to keep visible in bounding box (assuming zoomed out fully)
        bounceWidthFactor: 0.5,               //Percent of full board width to keep visible in bounding box (assuming zoomed out fully)
        clampZoom: true,                      //Enables clamping zoom on viewport (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#clampZoom)
        clampZoomHeightFactor: 1.1,           //Factor for multiply with full board height during zoom clamping
        clampZoomWidthFactor: 1.1,            //Factor for multiply with full board width during zoom clamping
        snapOptions: {                        //Options object during viewport snap move (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#SnapOptions)
          friction: 0.8,
          time: 1000,
          ease: 'easeInOutSine',
        },
        snapZoomOptions: {                    //Options object during viewport snap zooming (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#SnapZoomOptions)
          time: 1000,
          ease: 'easeInOutSine',
        }
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
        striped: true,                        //If set to true, a background with diagonal stripes will be shown behind timelines that would be inactive.
                                              //This makes it easy to see how many inactive timelines there are and how many timelines can be created before they become inactive.
        stripeRatio: 0.333,                   //Value between `0` and `1`, representing the ratio between shaded/non-shaded areas of the striped background.
                                              //A value of `0` will cause the background to not show any stripes, a value of `1` to have the background be a flat shade of the stripe colors.
                                              //A value of `0.5` will cause the stripes to take up half of the area. Default is `0.333`.
        expandDuration: 1000,
      },
      board: {
        showWhite: true,
        showBlack: true,
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
        slideBoard: false,
        fadeDuration: 450,
        showGhost: true,
        ghostAlpha: 0.4,
        showPresentBlink: true,
        blinkDuration: 350,
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
      promotion: {
        borderHeight: 35,
        borderWidth: 35,
        borderRadius: 32,
        borderLineWidth: 12,
        fadeDuration: 150,
      },
      promotionShadow: {
        show: true,
        offsetX: 25,
        offsetY: 25,
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
        showSpatial: false,
        spatialCurved: true,
        spatialSplitCurve: false,
        spatialMiddle: false,
        spatialRealEnd: false,
        showNonSpatial: true,
        nonSpatialCurved: true,
        nonSpatialSplitCurve: true,
        nonSpatialMiddle: true,
        nonSpatialRealEnd: true,
        showCheck: true,
        checkCurved: true,
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
