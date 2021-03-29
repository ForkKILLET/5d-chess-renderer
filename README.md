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
 - Does not handle additional GUI elements (submitting, undo, forfeit, chess clock)

## Installation

### Node.js

Simply install with this command `npm i 5d-chess-renderer`

### In Browser

Include this tag in the HTML before invoking the library:
``` html
<script src="https://unpkg.com/5d-chess-renderer/dist/5d-chess-renderer.js"></script>
```

# WIP

## API

### Constructor

**ChessRenderer([element, config, palette, PIXI])**

Creates a new instance of the `ChessRenderer` class.

  - element - *[Optional]* HTMLElement to attach the main canvas element to (will resize to element size). Use `null` to skip this process.
  - config - *[Optional]* Object to indicate what configuration values to use during rendering (see Config section for more details)
  - palette - *[Optional]* Object to indicate what color values to use during rendering (see Palette section for more details)
  