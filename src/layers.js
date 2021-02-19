const PIXI = require('pixi.js-legacy');

var layers = {
  viewport: null,
  root: new PIXI.Container(),
  background: new PIXI.Container(),
  present: new PIXI.Container(),
  boardBorder: new PIXI.Container(),
  squares: new PIXI.Container(),
  labels: new PIXI.Container(),
  pieces: new PIXI.Container(),
  squareHighlights: new PIXI.Container(),
  moveArrows: new PIXI.Container(),
  customArrows: new PIXI.Container()
};

exports.layers = layers;

exports.addLayers = (viewport) => {
  layers.root.addChild(layers.background);
  layers.background.interactiveChildren = false;

  layers.root.addChild(layers.present);
  layers.present.interactiveChildren = false;
  
  layers.root.addChild(layers.boardBorder);
  layers.boardBorder.interactiveChildren = false;

  layers.root.addChild(layers.squares);
  layers.root.addChild(layers.labels);
  layers.labels.interactiveChildren = false;

  layers.root.addChild(layers.pieces);
  layers.root.addChild(layers.squareHighlights);
  layers.root.addChild(layers.moveArrows);
  layers.moveArrows.interactiveChildren = false;

  layers.root.addChild(layers.customArrows);
  layers.customArrows.interactiveChildren = false;
  
  layers.viewport = viewport;
  viewport.addChild(layers.root);
}