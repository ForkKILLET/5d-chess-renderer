require('../dist/5d-chess-renderer');
const Chess = require('5d-chess-js');
const delay = require('delay');

describe('Base test suite', () => {
  it('Test rendering Standard board', async () => {
    var chess = new Chess();
    var cr = new ChessRenderer();
    cr.global.sync(chess);
    await delay(2500);
    cr.zoom.zoomFullBoard();
    await delay(2500);
    await autoShot('base-standard', cr.global.app.view);
  });
});