require('../dist/5d-chess-renderer');
const Chess = require('5d-chess-js');
const delay = require('delay');

describe('Base test suite', () => {
  it('Rendering standard board', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('base-standard', cr.global.app.view);
  });
  it('Rendering turn zero board', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.reset('turn zero');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('base-turn-zero', cr.global.app.view);
  });
  it('Rendering half reflected board', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.reset('half reflected');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('base-half-reflected', cr.global.app.view);
  });
});