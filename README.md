# 5D Chess Renderer

PIXI.js based renderer to create 5d chess boards based off of 5d-chess-js.

What does 5D Chess Renderer do?
 - Render boards and pieces using 5d-chess-js data
 - Render previous moves and actions as arrows
 - Provide configuration / palette options
 - Handle mouse / touch events for zooming, panning, move selection, and arrow drawing

What does 5D Chess Renderer not do?
 - Does not handle keyboard events
 - Does not handle sound
 - Does not handle additional GUI elements (submitting, undo, forfeit, chess clock)

# WIP

## API

### Constructor

**ChessRenderer([element, config, palette, PIXI])**

Creates a new instance of the `ChessRenderer` class.

  - element - *[Optional]* HTMLElement to attach the main canvas element to (will resize to element size). Use `null` to skip this process.