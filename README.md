# 5D Chess Renderer

PIXI.js based renderer to create 5d chess boards based off of 5d-chess-js.

[![Pipeline Status](https://gitlab.com/alexbay218/5d-chess-renderer/badges/master/pipeline.svg)](https://gitlab.com/%{project_path}/-/commits/master)
[![NPM version](https://img.shields.io/npm/v/5d-chess-renderer.svg)](https://www.npmjs.com/package/5d-chess-renderer)

What does 5D Chess Renderer do?
 - Render boards and pieces using 5d-chess-js data
 - Render previous moves and actions as arrows
 - Provide configuration / palette options
 - Handle mouse / touch events for zooming, panning, move selection, and arrow drawing

What does 5D Chess Renderer not do?
 - Does not handle keyboard events
 - Does not handle sound
 - Does not handle additional GUI elements (submitting, undo, forfeit, chess clock, etc.)

## Demo

Live demo available [here](https://alexbay218.gitlab.io/5d-chess-renderer/www/demo.html)

## Installation

### Node.js

Simply install with this command `npm i 5d-chess-renderer`

### In Browser

Include this tag in the HTML before invoking the library:
``` html
<script src="https://unpkg.com/5d-chess-renderer/dist/5d-chess-renderer.js"></script>
```

## API

### Constructor

**ChessRenderer([element, config, palette, PIXI])**

Creates a new instance of the `ChessRenderer` class.

  - element - *[Optional]* HTMLElement to attach the main canvas element to (will resize to element size). Use `null` to skip this process.
  - config - *[Optional]* Object to indicate what configuration values to use during rendering (see Config section for more details).
  - palette - *[Optional]* Object to indicate what color values to use during rendering (see Palette section for more details).
  - PIXI - *[Optional]* PIXI.js instance to use instead of the default `pixi.js-legacy` npm package.

### Functions

**.on(event, callback)**

Assigns event listener to start listening to events specified in Event section.

  - event - String indicating which event to listen to.
  - callback - Function(\[data\]) used to process new events.

    Function arguments:

    - data - *[Optional]* Any data type passed by the event when the callback is called. See the Event section for more information.
  
  - **Return** - Function() used to unbind the listener. Call this function when the listener is no longer needed.

**.destroy()**

Destroy the `ChessRenderer` instance. Use this to free up memory and destroy WebGL / Canvas context. You cannot undo this action.

**.global.attach(element)**

Attach the renderer to a HTMLElement. This is called in the constructor when element is specified. Note that the renderer will resize to element whenever the element resizes (if element resizes often, the renderer will flicker).

  - element - HTMLElement to attach the main canvas element to (will resize to element size).
  - **Return** - Nothing.

**.global.config(config)**

Change internal configuration values to change renderer behavior.

  - config - Object to indicate what configuration values to use during rendering (see Config section for more details).
  - **Return** - Nothing.

**.global.config(key, config)**

Change internal configuration values to change renderer behavior.

  - key - String used to indicate the top level object field.
  - config - Object to indicate what configuration values to use during rendering (see Config section for more details).
  - **Return** - Nothing.

**.global.palette(palette)**

Change internal palette values to change colors / tints used during rendering.

  - palette - Object to indicate what palette color values to use during rendering (see Palette section for more details).
  - **Return** - Nothing.

**.global.palette(key, palette)**

Change internal palette values to change colors / tints used during rendering.

  - key - String used to indicate the top level object field.
  - palette - Object to indicate what palette color values to use during rendering (see Palette section for more details).
  - **Return** - Nothing.

**.global.texture(key, data)**

Change PIXI.Texture to change textures used during rendering.

  - key - String used to indicate the type of sprite to use the texture.
  - data - Any data type used to create a texture via `PIXI.Texture.from(data)`. More information here (https://pixijs.download/dev/docs/PIXI.Texture.html#from).
  - **Return** - Nothing.

**.global.sync(chess)**

Automatically display the board, action history, move buffer, and checks from a `5d-chess-js` Chess instance.

  - chess - `5d-chess-js` Chess instance used to extract board, action history, move buffer, and checks information to render.
  - **Return** - Nothing.

**.global.board(board)**

Change internal board state to render. Used by `.global.sync(chess)` function.

  - board - `5d-chess-js` board field used to update internal board state.
  - **Return** - Nothing.
  
**.global.actionHistory(actionHistory)**

Change internal action history state to render. Used by `.global.sync(chess)` function.

  - actionHistory - `5d-chess-js` actionHistory field used to update internal action history state.
  - **Return** - Nothing.
  
**.global.moveBuffer(moveBuffer)**

Change internal move buffer state to render. Used by `.global.sync(chess)` function.

  - moveBuffer - `5d-chess-js` moveBuffer field used to update internal move buffer state.
  - **Return** - Nothing.

**.global.checks(checks)**

Change internal check moves to render. Used by `.global.sync(chess)` function.

  - checks - Array of `5d-chess-js` Move objects created from calling `chess.checks('object')`.
  - **Return** - Nothing.

**.global.availableMoves(availableMoves)**

Change internal array of moves that indicate what moves are available to play.

  - availableMoves - Array of `5d-chess-js` Move objects.
  - **Return** - Nothing.

**.global.pastAvailableMoves(pastAvailableMoves)**

Change internal array of moves that indicate what past moves were available to play. Showing possible future moves is assigned here too.

  - pastAvailableMoves - Array of `5d-chess-js` Move objects.
  - **Return** - Nothing.

**.render.customArrowManager.drawArrow(arrowObject)**

Draw a custom arrow. Use this to draw custom arrows programmatically.

  - arrowObject - `Arrow `object used to create the custom arrow.
  - **Return** - Nothing.

**.render.customArrowManager.enableCustomArrowMode([color, middleMode])**

Enables custom arrow drawing mode. In this mode, clicking / tapping on squares are used to draw custom arrows.

  - color - *[Optional]* Integer representing the RGB hex value (`'#FFFFFF' => 0xffffff`). Use `null` to use default custom color.
  - middleMode - *[Optional]* Boolean indicating if the arrow should contain a middle point. Defaults to `true`.
  - **Return** - Nothing.

**.render.customArrowManager.disableCustomArrowMode()**

Disables custom arrow drawing mode.

  - **Return** - Nothing.

**.render.customArrowManager.enableEraseMode()**

Enables custom arrow erasing mode. In this mode, clicking / tapping on squares erases the closest arrow (based on distance to start, middle, or end points).

  - **Return** - Nothing.

**.render.customArrowManager.disableEraseMode()**

Disables custom arrow erasing mode.

  - **Return** - Nothing.

**.render.customArrowManager.undo()**

Erase the last custom arrow drawn.

  - **Return** - Nothing.

**.render.customArrowManager.wipe()**

Erase all custom arrows.

  - **Return** - Nothing.

**.zoom.fullBoard([move, zoom])**

Zoom and move the viewport to view the full board.

  - move - *[Optional]* Boolean indicating to move the viewport to the center of the full board. Defaults to `true`.
  - zoom - *[Optional]* Boolean indicating to zoom the viewport to view the full board. Defaults to `true`.

**.zoom.present([move, zoom])**

Zoom and move the viewport to view a present board.

  - move - *[Optional]* Boolean indicating to move the viewport to the center of a present board. Defaults to `true`.
  - zoom - *[Optional]* Boolean indicating to zoom the viewport to view a present board. Defaults to `true`.

**.zoom.board(timeline, turn, player, [move, zoom])**

Zoom and move the viewport to view a specific board.

  - timeline - Integer indicating the timeline number of the board, 0 is neutral, negative integers are for black and positive integers are for white.
  - turn - Integer indicating the turn number of the board, starts from 1.
  - player - String indicating the player that the turn belongs to.
  - move - *[Optional]* Boolean indicating to move the viewport to the center of a specific board. Defaults to `true`.
  - zoom - *[Optional]* Boolean indicating to zoom the viewport to view a specific board. Defaults to `true`.

### Schemas

These schemas define the various object types that the API interacts with.

**Arrow**

``` js
{
  type: String Enum ['move','check','custom'] || Integer,     // String indicating the arrow type to draw (this is used to pick which color to use according to palette). For custom color, use an integer representing the RGB hex value ('#FFFFFF' => 0xffffff).
  start: Position,                                            // 5d-chess-js position object used to indicate the starting point of the arrow
  middle: null || Position,                                   // 5d-chess-js position object used to indicate the middle point of the arrow. Null if no need to display middle point.
  end: Position,                                              // 5d-chess-js position object used to indicate the ending point of the arrow
}
```