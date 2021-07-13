# Overview

PIXI.js based renderer to create 5d chess boards based off of 5d-chess-js.

What does 5D Chess Renderer do?
 - Render boards and pieces using 5d-chess-js data
 - Render previous moves and actions as arrows
 - Provide configuration / palette options
 - Handle mouse / touch events for zooming, panning, move selection, and arrow drawing

What does 5D Chess Renderer not do?
 - Does not handle keyboard events
 - Does not handle sound
 - Does not handle additional GUI elements (submitting, undo, forfeit, chess clock, etc.)

# Demo

Live demo available [here](https://5d-chess.gitlab.io/5d-chess-renderer/www/demo.html)

# Installation

## Node.js

Simply install with this command `npm i 5d-chess-renderer`

## In Browser

Include this tag in the HTML before invoking the library:
``` html
<script src="https://unpkg.com/5d-chess-renderer/dist/5d-chess-renderer.js"></script>
```

# API

## Constructor

### ChessRenderer([element, config, palette, PIXI])

Creates a new instance of the `ChessRenderer` class.

  - element - *[Optional]* HTMLElement to attach the main canvas element to (will resize to element size). Use `null` to skip this process.
  - config - *[Optional]* Object to indicate what configuration values to use during rendering (see Config section for more details).
  - palette - *[Optional]* Object to indicate what color values to use during rendering (see Palette section for more details).
  - PIXI - *[Optional]* PIXI.js instance to use instead of the default `pixi.js-legacy` npm package.

## Functions

### .on(event, callback)

Assigns event listener to start listening to events specified in Event section.

  - event - String indicating which event to listen to.
  - callback - Function(\[data\]) used to process new events.

    Function arguments:

    - data - *[Optional]* Any data type passed by the event when the callback is called. See the Event section for more information.
  - **Return** - Function() used to unbind the listener. Call this function when the listener is no longer needed.

### .destroy()

Destroy the `ChessRenderer` instance. Use this to free up memory and destroy WebGL / Canvas context. You cannot undo this action.

### .global

Sub-object containing global palette and configuration functions / data.

#### .global.attach(element)

Attach the renderer to a HTMLElement. This is called in the constructor when element is specified. Note that the renderer will resize to element whenever the element resizes (if element resizes often, the renderer will flicker).

  - element - HTMLElement to attach the main canvas element to (will resize to element size).
  - **Return** - Nothing.

#### .global.config(config)

Change internal configuration values to change renderer behavior.

  - config - Object to indicate what configuration values to use during rendering (see Config section for more details).
  - **Return** - Nothing.

#### .global.config(key, config)

Change internal configuration values to change renderer behavior.

  - key - String used to indicate the top level object field.
  - config - Object to indicate what configuration values to use during rendering (see Config section for more details).
  - **Return** - Nothing.

#### .global.palette(palette)

Change internal palette values to change colors / tints used during rendering.

  - palette - Object to indicate what palette color values to use during rendering (see Palette section for more details).
  - **Return** - Nothing.

#### .global.palette(key, palette)

Change internal palette values to change colors / tints used during rendering.

  - key - String used to indicate the top level object field.
  - palette - Object to indicate what palette color values to use during rendering (see Palette section for more details).
  - **Return** - Nothing.

#### .global.texture(key, data)

Change PIXI.Texture to change textures used during rendering.

  - key - String used to indicate the type of sprite to use the texture.
  - data - Any data type used to create a texture via `PIXI.Texture.from(data)`. More information here (https://pixijs.download/dev/docs/PIXI.Texture.html#from).
  - **Return** - Nothing.

#### .global.sync(chess)

Automatically display the board, action history, move buffer, and checks from a `5d-chess-js` Chess instance.

  - chess - `5d-chess-js` Chess instance used to extract board, action history, move buffer, and checks information to render.
  - **Return** - Nothing.

#### .global.board(board)

Change internal board state to render. Used by `.global.sync(chess)` function.

  - board - `5d-chess-js` board field used to update internal board state.
  - **Return** - Nothing.

#### .global.actionHistory(actionHistory)

Change internal action history state to render. Used by `.global.sync(chess)` function.

  - actionHistory - `5d-chess-js` actionHistory field used to update internal action history state.
  - **Return** - Nothing.

#### .global.moveBuffer(moveBuffer)

Change internal move buffer state to render. Used by `.global.sync(chess)` function.

  - moveBuffer - `5d-chess-js` moveBuffer field used to update internal move buffer state.
  - **Return** - Nothing.

#### .global.checks(checks)

Change internal check moves to render. Used by `.global.sync(chess)` function.

  - checks - Array of `5d-chess-js` Move objects created from calling `chess.checks('object')`.
  - **Return** - Nothing.

#### .global.availableMoves(availableMoves)

Change internal array of moves that indicate what moves are available to play.

  - availableMoves - Array of `5d-chess-js` Move objects.
  - **Return** - Nothing.

#### .global.pastAvailableMoves(pastAvailableMoves)

Change internal array of moves that indicate what past moves were available to play. Showing possible future moves is assigned here too.

  - pastAvailableMoves - Array of `5d-chess-js` Move objects.
  - **Return** - Nothing.

### .render

Sub-object containing custom rendering functions and PIXI objects.

#### .render.customArrowManager.drawArrow(arrowObject)

Draw a custom arrow. Use this to draw custom arrows programmatically.

  - arrowObject - `Arrow `object used to create the custom arrow.
  - **Return** - Nothing.

#### .render.customArrowManager.enableCustomArrowMode([color, middleMode])

Enables custom arrow drawing mode. In this mode, clicking / tapping on squares are used to draw custom arrows.

  - color - *[Optional]* Integer representing the RGB hex value (`'#FFFFFF' => 0xffffff`). Use `null` to use default custom color.
  - middleMode - *[Optional]* Boolean indicating if the arrow should contain a middle point. Defaults to `true`.
  - **Return** - Nothing.

#### .render.customArrowManager.disableCustomArrowMode()

Disables custom arrow drawing mode.

  - **Return** - Nothing.

#### .render.customArrowManager.enableEraseMode()

Enables custom arrow erasing mode. In this mode, clicking / tapping on squares erases the closest arrow (based on distance to start, middle, or end points).

  - **Return** - Nothing.

#### .render.customArrowManager.disableEraseMode()

Disables custom arrow erasing mode.

  - **Return** - Nothing.

#### .render.customArrowManager.undo()

Erase the last custom arrow drawn.

  - **Return** - Nothing.

#### .render.customArrowManager.wipe()

Erase all custom arrows.

  - **Return** - Nothing.

#### .selector.selectPiece(pieceObject)

Used to programatically select pieces.

  - board - `5d-chess-js` piece object used to update selected piece.
  - **Return** - Nothing.

### .zoom

Sub-object containing zoom / pan management functions.

#### .zoom.fullBoard([move, zoom, offset])

Zoom and move the viewport to view the full board.

  - move - *[Optional]* Boolean indicating to move the viewport to the center of the full board. Defaults to `true`.
  - zoom - *[Optional]* Boolean or number indicating to zoom the viewport to view the full board. If number, it is used as the zoom factor. Defaults to `true`.
  - offset - *[Optional]* Object indicating offset values to use to change the position and zoom level.

    Object fields are:

    - x - Integer indicating how many board widths to offset from the initial x position.
    - y - Integer indicating how many board heights to offset from the initial y position.
    - width - Integer indicating how many board widths to change from the initial fullboard width.
    - height - Integer indicating how many board heights to change from the initial fullboard height.
  - **Return** - Nothing.

#### .zoom.present([move, zoom])

Zoom and move the viewport to view a present board.

  - move - *[Optional]* Boolean indicating to move the viewport to the center of a present board. Defaults to `true`.
  - zoom - *[Optional]* Boolean or number indicating to zoom the viewport to view a present board. If number, it is used as the zoom factor. Defaults to `true`.
  - **Return** - Nothing.

#### .zoom.board(timeline, turn, player, [move, zoom])

Zoom and move the viewport to view a specific board.

  - timeline - Integer indicating the timeline number of the board, 0 is neutral, negative integers are for black and positive integers are for white.
  - turn - Integer indicating the turn number of the board, starts from 1.
  - player - String indicating the player that the turn belongs to.
  - move - *[Optional]* Boolean indicating to move the viewport to the center of a specific board. Defaults to `true`.
  - zoom - *[Optional]* Boolean or number indicating to zoom the viewport to view a specific board. If number, it is used as the zoom factor. Defaults to `true`.
  - **Return** - Nothing.

## Events

These events are emitted to be used both internally and externally. Use the `.on(event, callback)` endpoint to listen to events.

### 'resizeEvent'

Fires when renderer element is resized.

Callback arguments:

  - None

### 'moveSelect'

Fires when a move is selected.

Callback arguments:

  - move - The move being selected in the form of a `5d-chess-js` object.

### 'configUpdate'

Fires when the configuration object is modified.

Callback arguments:

  - None

### 'paletteUpdate'

Fires when the palette object is modified.

Callback arguments:

  - None

### 'textureUpdate'

Fires when the texture store is modified.

Callback arguments:

  - None

### 'boardUpdate'

Fires when the internal board state is modified.

Callback arguments:

  - board - The new board state in the form of a `5d-chess-js` object. Note that ghost and check boards are added / modified, since this board state is used for rendering purposes.

### 'actionHistoryUpdate'

Fires when the action history is updated, triggering rendering of move arrows.

Callback arguments:

  - actionHistory - The new `5d-chess-js` style action history object used to update the internal move arrow states.

### 'moveBufferUpdate'

Fires when the move buffer is updated, triggering rendering of move arrows.

Callback arguments:

  - moveBuffer - The new `5d-chess-js` style move buffer object used to update the internal move arrow states.

### 'checksUpdate'

Fires when the array of check moves is updated, triggering rendering of check arrows.

Callback arguments:

  - checks - The new `5d-chess-js` style move objects used to update the internal check arrow states.

### 'availableMovesUpdate'

Fires when the array of available moves is updated, triggering rendering of move highlights when needed.

Callback arguments:

  - checks - The new `5d-chess-js` style move objects used to update the internal available moves.

### 'pastAvailableMovesUpdate'

Fires when the array of past available moves is updated, triggering rendering of move highlights when needed.

Callback arguments:

  - checks - The new `5d-chess-js` style move objects used to update the internal past available moves.

## Schemas

These schemas define the various object types that the API interacts with.

### Arrow

``` js
{
  type: String Enum ['move','check','custom'] || Integer,     // String indicating the arrow type to draw (this is used to pick which color to use according to palette). For custom color, use an integer representing the RGB hex value ('#FFFFFF' => 0xffffff).
                                                              // Note: if the palette has the corresponding value, numbered custom arrows are supported (i.e. 'custom1', 'custom2', 'custom3', etc.)
  start: Position,                                            // 5d-chess-js position object used to indicate the starting point of the arrow
  middle: null || Position,                                   // 5d-chess-js position object used to indicate the middle point of the arrow. Null if no need to display middle point.
  end: Position,                                              // 5d-chess-js position object used to indicate the ending point of the arrow
}
```

## Palette

The palette object is defined under `palette.js`. The following code block may not be up to date, so double check with the `palette.js` file for actual implementation.

### fps

#### text

FPS counter text color

 - Default Value: `0x000000`

### background

#### single

Background color for solid backgrounds

 - Default Value: `0xE2E5F7`

#### lightRectangle

Color for light rectangles of checkered background

 - Default Value: `0xE2E5F7`

#### lightStripeBlack

Color for black side stripes on light rectangles of the checkered background

 - Default Value: `0xBCB6CE`

#### lightStripeWhite

Color for white side stripes on light rectangles of the checkered background

 - Default Value: `0xE5EEF6`

#### lightStripePast

Color for past side stripes on light rectangles of the checkered background

 - Default Value: `0xdddddd`

#### darkRectangle

Color for dark rectangles of the checkered background

 - Default Value: `0xCED4F1`

#### darkStripeBlack

Color for black side stripes on dark rectangles of the checkered background

 - Default Value: `0xAFA3BD`

#### darkStripeWhite

Color for white side stripes on dark rectangles of the checkered background

 - Default Value: `0xDDE5F4`

#### darkStripePast

Color for past side stripes on dark rectangles of the checkered background

 - Default Value: `0xbbbbbb`

### board

#### whiteBorder

Tint for white board borders

 - Default Value: `0xdddddd`

#### blackBorder

Tint for black board borders

 - Default Value: `0x222222`

#### checkBorder

Tint for board borders that are involved in checks

 - Default Value: `0xc50000`

#### inactiveBorder

Tint for boards that are inactive

 - Default Value: `0x777777`

#### whiteBorderOutline

Color of outlines of white boards

 - Default Value: `0x222222`

#### blackBorderOutline

Color of outlines of black boards

 - Default Value: `0xdddddd`

#### checkBorderOutline

Color of outlines of boards involved in checks

 - Default Value: `0xaf0000`

#### inactiveBorderOutline

Color of outlines of inactive boards

 - Default Value: `0x777777`

### boardLabel

#### timeline

Color of timeline labels

 - Default Value: `0x000000`

#### turn

Color of turn labels

 - Default Value: `0x000000`

#### whiteBoard

Color of board labels on white board

 - Default Value: `0x000000`

#### blackBoard

Color of board labels on black board

 - Default Value: `0xffffff`

#### checkBoard

Color of board labels on boards involved in checks

 - Default Value: `0xffffff`

#### inactiveBoard

Color of board labels on inactive boards

 - Default Value: `0xffffff`

### boardShadow

#### shadow

Color of board shadows

 - Default Value: `0x000000`

### square

#### white

Tint for white square

 - Default Value: `0xbababa`

#### black

Tint for black square

 - Default Value: `0x868686`

### arrow

#### move

Color of move arrows

 - Default Value: `0xd3a026`

#### moveOutline

Color of move arrow outlines

 - Default Value: `0x000000`

#### check

Color of check arrows

 - Default Value: `0xf50000`

#### checkOutline

Color of check arrow outlines

 - Default Value: `0x000000`

#### custom

Color of custom arrows. This is the default color used if no color is specified when turning on custom arrow mode

 - Default Value: `0x32dcfa`

#### customOutline

Color of custom arrow outlines

 - Default Value: `0x000000`

### highlight

#### self

Tint for square highlights on selected pieces

 - Default Value: `0x0083be`

#### move

Tint for square highlights on available moves

 - Default Value: `0x6fc326`

#### pastMove

Tint for square highlights on past available moves

 - Default Value: `0x6fc326`

#### capture

Tint for square highlights on available capture moves

 - Default Value: `0xf50000`

#### pastCapture

Tint for square highlights on past available capture moves

 - Default Value: `0xf50000`

## Config

The configuration object is defined under `config.js`. The following code block may not be up to date, so double check with the `config.js` file for actual implementation.
### app

#### height

This option will only be used on creation, updating this value will not resize the renderer. Use this for when not attaching the canvas element to a HTMLElement (server-side, headless, etc.). No need to change if used normally.

 - Default Value: `600`

#### width

This option will only be used on creation, updating this value will not resize the renderer. Use this for when not attaching the canvas element to a HTMLElement (server-side, headless, etc.). No need to change if used normally.

 - Default Value: `800`

#### preserveDrawingBuffer

This option will only be used on creation, updating this will not change PIXI.Application instance behavior. Enables drawing buffer preservation, enable this if you need to call toDataUrl on the WebGL context.

 - Default Value: `false`

#### antialias

This option will only be used on creation, updating this will not change PIXI.Application instance behavior. Sets antialias option inside PIXI.Application constructor (see https://pixijs.download/dev/docs/PIXI.Application.html#constructor)

 - Default Value: `true`

#### forceCanvas

This option will only be used on creation, updating this will not change PIXI.Application instance behavior. Forces the usage of canvas based rendering instead of webgl. Using canvas based rendering is not recommended, as many effects such as transparency and blur do not work correctly.

 - Default Value: `false`

#### backgroundAlpha

Sets alpha of the solid background (does not effect squares background). This option will only be used on creation, updating this will not change PIXI.Application instance behavior

 - Default Value: `1`

#### interactive

Enables mouse / touch events

 - Default Value: `true`

### viewport

#### drag

Enables viewport mouse / touch drag (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#drag)

 - Default Value: `true`

#### dragOptions

Options object for viewport drag plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#DragOptions)

##### direction

 - Default Value: `'all'`

##### pressDrag

 - Default Value: `true`

##### wheel

 - Default Value: `true`

##### wheelScroll

 - Default Value: `1`

##### reverse

 - Default Value: `false`

##### clampWheel

 - Default Value: `false`

##### underflow

 - Default Value: `'center'`

##### factor

 - Default Value: `1`

##### mouseButtons

 - Default Value: `'all'`

#### pinch

Enables viewport two-finger zoom / touch drag (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#pinch)

 - Default Value: `true`

#### pinchOptions

Options object for viewport pinch plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#PinchOptions)

##### noDrag

 - Default Value: `false`

##### percent

 - Default Value: `1`

##### factor

 - Default Value: `1`

#### wheel

Enables mouse wheel zoom (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#wheel)

 - Default Value: `true`

#### wheelOptions

Options object for viewport wheel plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#WheelOptions)

##### percent

 - Default Value: `0.1`

##### smooth

 - Default Value: `false`

##### reverse

 - Default Value: `false`

#### decelerate

Enables move deceleration (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#decelerate)

 - Default Value: `true`

#### decelerateOptions

Options object for viewport decelerate plugin (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#DecelerateOptions)

##### friction

 - Default Value: `0.95`

##### bounce

 - Default Value: `0.8`

##### minSpeed

 - Default Value: `0.01`

#### bounce

Enables bouncing on borders (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#bounce)

 - Default Value: `true`

#### bounceOptions

Options object for viewport bounce plugin (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#bounce)

##### sides

 - Default Value: `'all'`

##### friction

 - Default Value: `0.75`

##### time

 - Default Value: `150`

##### ease

 - Default Value: `'easeInOutSine'`

##### underflow

 - Default Value: `'center'`

#### clampZoom

Enables clamping zoom on viewport (https://davidfig.github.io/pixi-viewport/jsdoc/Viewport.html#clampZoom)

 - Default Value: `true`

#### clampZoomHeightFactor

Factor for multiply with full board height during zoom clamping

 - Default Value: `1.1`

#### clampZoomWidthFactor

Factor for multiply with full board width during zoom clamping

 - Default Value: `1.1`

#### snapOptions

Options object during viewport snap move (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#SnapOptions)

##### friction

 - Default Value: `0.8`

##### time

 - Default Value: `1000`

##### ease

 - Default Value: `'easeInOutSine'`

#### snapZoomOptions

Options object during viewport snap zooming (https://davidfig.github.io/pixi-viewport/jsdoc/global.html#SnapZoomOptions)

##### time

 - Default Value: `1000`

##### ease

 - Default Value: `'easeInOutSine'`

### fps

#### show

Enables FPS counter

 - Default Value: `false`

#### fpsTextOptions

Text options for FPS counter (https://pixijs.download/dev/docs/PIXI.TextStyle.html)

##### align

 - Default Value: `'center'`

##### fontFamily

 - Default Value: `'Arial'`

##### fontSize

 - Default Value: `30`

##### fontStyle

 - Default Value: `'normal'`

##### fontWeight

 - Default Value: `'normal'`

##### textBaseline

 - Default Value: `'alphabetic'`

#### min

Set minimum fps (https://pixijs.download/dev/docs/PIXI.Ticker.html#minFPS)

 - Default Value: `20`

#### max

Set maximum fps (https://pixijs.download/dev/docs/PIXI.Ticker.html#maxFPS)

 - Default Value: `0`

### background

#### showRectangle

Show checkered rectangle background instead of solid background

 - Default Value: `true`

#### blur

Apply blur filter on the background

 - Default Value: `true`

#### blurStrength

Blur strength

 - Default Value: `3`

#### blurQuality

Blur quality (how many gaussian blur passes to apply)

 - Default Value: `3`

#### striped

If set to true, a background with diagonal stripes will be shown behind timelines that would be inactive. This makes it easy to see how many inactive timelines there are and how many timelines can be created before they become inactive.

 - Default Value: `true`

#### stripeRatio

Value between `0` and `1`, representing the ratio between shaded/non-shaded areas of the striped background.

A value of `0` will cause the background to not show any stripes, a value of `1` to have the background be a flat shade of the stripe colors. A value of `0.5` will cause the stripes to take up half of the area. Default is `0.333`.

 - Default Value: `0.333`

#### expandDuration

Duration for the non-striped expansion animation

 - Default Value: `350`

### board

#### showWhite

Show white turn boards

 - Default Value: `true`

#### showBlack

Show black turn boards

 - Default Value: `true`

#### marginHeight

Board margin height

 - Default Value: `160`

#### marginWidth

Board margin width

 - Default Value: `160`

#### borderHeight

Board border height

 - Default Value: `50`

#### borderWidth

Board border width

 - Default Value: `50`

#### borderRadius

Board border radius (for rounded rectangle)

 - Default Value: `45`

#### borderLineWidth

Board border outline width

 - Default Value: `12`

#### flipTimeline

Flip the boards along the timelines axis

 - Default Value: `false`

#### flipTurn

Flip the boards along the turn axis

 - Default Value: `false`

#### flipRank

Flip the pieces / squares along the rank axis

 - Default Value: `false`

#### flipFile

Flip the pieces / squares along the file axis

 - Default Value: `false`

#### slideBoard

Enables the sliding board animation

 - Default Value: `false`

#### fadeDuration

Duration for the fade in / fade out animation

 - Default Value: `450`

#### showGhost

Show ghost board

 - Default Value: `true`

#### ghostAlpha

Alpha value for ghost board

 - Default Value: `0.4`

#### showPresentBlink

Enable blinking animation for present board

 - Default Value: `true`

#### blinkDuration

Duration each blink cycle

 - Default Value: `350`

### boardLabel

#### showTimeline

Show timeline labels

 - Default Value: `true`

#### showMiddleTimeline

Show timeline labels in the middle boards

 - Default Value: `false`

#### rotateTimelineLabel

Rotate timeline labels 90 degrees

 - Default Value: `true`

#### timelineTextOptions

Text options for timeline labels (https://pixijs.download/dev/docs/PIXI.TextStyle.html)

##### align

 - Default Value: `'center'`

##### fontFamily

 - Default Value: `'Times New Roman'`

##### fontSize

 - Default Value: `96`

##### fontStyle

 - Default Value: `'italic'`

##### fontWeight

 - Default Value: `'bold'`

##### textBaseline

 - Default Value: `'alphabetic'`

#### showTurn

Show turn labels

 - Default Value: `true`

#### turnTextOptions

Text options for turn labels (https://pixijs.download/dev/docs/PIXI.TextStyle.html)

##### align

 - Default Value: `'center'`

##### fontFamily

 - Default Value: `'Times New Roman'`

##### fontSize

 - Default Value: `96`

##### fontStyle

 - Default Value: `'italic'`

##### fontWeight

 - Default Value: `'bold'`

##### textBaseline

 - Default Value: `'alphabetic'`

#### showFile

Show file labels

 - Default Value: `true`

#### fileTextOptions

Text options for file labels (https://pixijs.download/dev/docs/PIXI.TextStyle.html)

##### align

 - Default Value: `'center'`

##### fontFamily

 - Default Value: `'Times New Roman'`

##### fontSize

 - Default Value: `36`

##### fontStyle

 - Default Value: `'normal'`

##### fontWeight

 - Default Value: `'bold'`

##### textBaseline

 - Default Value: `'alphabetic'`

#### showRank

Show rank labels

 - Default Value: `true`

#### rankTextOptions

Text options for rank labels (https://pixijs.download/dev/docs/PIXI.TextStyle.html)

##### align

 - Default Value: `'center'`

##### fontFamily

 - Default Value: `'Times New Roman'`

##### fontSize

 - Default Value: `36`

##### fontStyle

 - Default Value: `'normal'`

##### fontWeight

 - Default Value: `'bold'`

##### textBaseline

 - Default Value: `'alphabetic'`

#### fadeDuration

Duration for fade in / fade out animation

 - Default Value: `250`

### boardShadow

#### show

Show board shadow

 - Default Value: `true`

#### offsetX

Offset x position

 - Default Value: `40`

#### offsetY

Offset y position

 - Default Value: `40`

#### alpha

Alpha value of the board shadow

 - Default Value: `0.25`

### promotion

#### borderHeight

Promotion menu border height

 - Default Value: `30`

#### borderWidth

Promotion menu border width

 - Default Value: `30`

#### borderRadius

Promotion menu border radius (for rounded rectangle)

 - Default Value: `28`

#### borderLineWidth

Promotion menu border outline width

 - Default Value: `8`

#### fadeDuration

Duration for fade in / fade out animation

 - Default Value: `150`

### promotionShadow

#### show

Show promotion menu shadow

 - Default Value: `true`

#### offsetX

Offset x position

 - Default Value: `25`

#### offsetY

Offset y position

 - Default Value: `25`

#### alpha

Alpha value of the promotion menu shadow

 - Default Value: `0.25`

### square

#### height

Board square height

 - Default Value: `100`

#### width

Board square width

 - Default Value: `100`

#### fadeDuration

Duration for fade in / fade out animation

 - Default Value: `150`

### piece

#### height

Piece height height

 - Default Value: `90`

#### width

Piece height width

 - Default Value: `90`

#### fadeDuration

Duration for fade in / fade out animation

 - Default Value: `150`

#### roundPixel

Disable pixel interpolation (https://pixijs.download/dev/docs/PIXI.settings.html#ROUND_PIXELS)

 - Default Value: `true`

### arrow

#### lutInterval

Bezier lookup table density, only applies to curved arrows (http://pomax.github.io/bezierjs/#getLUT)

 - Default Value: `10`

#### headSize

Arrowhead size

 - Default Value: `35`

#### size

Arrow line width

 - Default Value: `12`

#### midpointRadius

Radius of the middle point

 - Default Value: `11`

#### outlineSize

Arrow outline width

 - Default Value: `22`

#### animateDuration

Duration for arrow animations (animate in and out)

 - Default Value: `650`

#### alpha

Alpha value of the arrow

 - Default Value: `0.6`

#### showSpatial

Show spatial move arrows

 - Default Value: `false`

#### spatialCurved

Use curved arrows for spatial moves

 - Default Value: `true`

#### spatialSplitCurve

Split the curved arrow into two bezier curves

 - Default Value: `false`

#### spatialMiddle

Draw arrow with middle point

 - Default Value: `false`

#### spatialRealEnd

Use the real end position of a 5d-chess-js move object

 - Default Value: `false`

#### showNonSpatial

Show non-spatial move arrows

 - Default Value: `true`

#### nonSpatialCurved

Use curved arrows for non-spatial moves

 - Default Value: `true`

#### nonSpatialSplitCurve

Split the curved arrow into two bezier curves

 - Default Value: `true`

#### nonSpatialMiddle

Draw arrow with middle point

 - Default Value: `true`

#### nonSpatialRealEnd

Use the real end position of a 5d-chess-js move object

 - Default Value: `true`

#### showCheck

Show check arrows

 - Default Value: `true`

#### checkCurved

Use curved arrows for check arrows

 - Default Value: `true`

#### showCustom

Show custom arrows

 - Default Value: `true`

#### customCurved

Use curved arrows for custom arrows

 - Default Value: `false`

#### customSplitCurve

Split the curved arrow into two bezier curves

 - Default Value: `true`

#### customMiddleCurved

Use curved arrows for custom arrows (in middle mode)

 - Default Value: `true`

#### customMiddleSplitCurve

Split the curved arrow into two bezier curves (in middle mode)

 - Default Value: `true`

### highlight

#### hoverAlpha

Alpha value for available move highlight (while hovering)

 - Default Value: `0.4`

#### pastHoverAlpha

Alpha value for past available move highlight (while hovering)

 - Default Value: `0.2`

#### selectedAlpha

Alpha value for available move highlight (while selected)

 - Default Value: `0.6`

#### pastSelectedAlpha

Alpha value for past available move highlight (while selected)

 - Default Value: `0.4`

#### fadeDuration

Duration for fade in / fade out animation

 - Default Value: `75`

### ripple

#### timelineDuration

Delay for ripple animation (increasing by timeline)

 - Default Value: `0`

#### turnDuration

Delay for ripple animation (increasing by turn)

 - Default Value: `0`

#### rankDuration

Delay for ripple animation (increasing by rank)

 - Default Value: `15`

#### fileDuration

Delay for ripple animation (increasing by file)

 - Default Value: `15`

### selector

#### deselectOnMove

Deselect piece on move selection

 - Default Value: `true`

# Copyright

All source code is released under AGPL v3.0 (license can be found under the LICENSE file).

Chess piece images were derived from SVG files released under CC BY-SA v3.0 (license can be found under the PIECE_LICENSE file).

Any addition copyrightable material not covered under AGPL v3.0 is released under CC BY-SA v3.0.
