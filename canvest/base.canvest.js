const ChessRenderer = require('../dist/5d-chess-renderer-test');
const Chess = require('5d-chess-js');

describe('Base test suite', () => {
  it('Test rendering Standard board', async () => {
    var chess = new Chess();
    console.log(Chess);
    console.log(ChessRenderer);
    var cr = new ChessRenderer();
    cr.global.sync(chess);
    
    await autoShot('base-standard', cr.global.app.view);
  });
});