const ChessRenderer = require('../dist/5d-chess-renderer');
const Chess = require('5d-chess-js');
const delay = require('delay');

describe('Curved arrow test suite', () => {
  it('Rendering standard arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-standard', cr.global.app.view);
  });
  it('Rendering all curved, middle, real-end, split arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: true,
      spatialRealEnd: true,
      spatialSplitCurve: true,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: true,
      nonSpatialRealEnd: true,
      nonSpatialSplitCurve: true,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-middle-realend-split', cr.global.app.view);
  });
  it('Rendering all curved, middle, real-end arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: true,
      spatialRealEnd: true,
      spatialSplitCurve: false,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: true,
      nonSpatialRealEnd: true,
      nonSpatialSplitCurve: false,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-middle-realend', cr.global.app.view);
  });
  it('Rendering all curved, middle, split arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: true,
      spatialRealEnd: false,
      spatialSplitCurve: true,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: true,
      nonSpatialRealEnd: false,
      nonSpatialSplitCurve: true,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-middle-split', cr.global.app.view);
  });
  it('Rendering all curved, middle arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: true,
      spatialRealEnd: false,
      spatialSplitCurve: false,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: true,
      nonSpatialRealEnd: false,
      nonSpatialSplitCurve: false,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-middle', cr.global.app.view);
  });
  it('Rendering all curved, real-end, split arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: false,
      spatialRealEnd: true,
      spatialSplitCurve: true,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: false,
      nonSpatialRealEnd: true,
      nonSpatialSplitCurve: true,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-realend-split', cr.global.app.view);
  });
  it('Rendering all curved, real-end arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: false,
      spatialRealEnd: true,
      spatialSplitCurve: false,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: false,
      nonSpatialRealEnd: true,
      nonSpatialSplitCurve: false,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-realend', cr.global.app.view);
  });
  it('Rendering all curved, split arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: false,
      spatialRealEnd: false,
      spatialSplitCurve: true,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: false,
      nonSpatialRealEnd: false,
      nonSpatialSplitCurve: true,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved-split', cr.global.app.view);
  });
  it('Rendering all curved arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: true,
      spatialMiddle: false,
      spatialRealEnd: false,
      spatialSplitCurve: false,
      showNonSpatial: true,
      nonSpatialCurved: true,
      nonSpatialMiddle: false,
      nonSpatialRealEnd: false,
      nonSpatialSplitCurve: false,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-curved', cr.global.app.view);
  });
});

describe('Straight arrow test suite', () => {
  it('Rendering all straight, middle, real-end arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: false,
      spatialMiddle: true,
      spatialRealEnd: true,
      showNonSpatial: true,
      nonSpatialCurved: false,
      nonSpatialMiddle: true,
      nonSpatialRealEnd: true,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-straight-middle-realend', cr.global.app.view);
  });
  it('Rendering all straight, middle arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: false,
      spatialMiddle: true,
      spatialRealEnd: false,
      showNonSpatial: true,
      nonSpatialCurved: false,
      nonSpatialMiddle: true,
      nonSpatialRealEnd: false,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-straight-middle', cr.global.app.view);
  });
  it('Rendering all straight, real-end arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: false,
      spatialMiddle: false,
      spatialRealEnd: true,
      showNonSpatial: true,
      nonSpatialCurved: false,
      nonSpatialMiddle: false,
      nonSpatialRealEnd: true,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-straight-realend', cr.global.app.view);
  });
  it('Rendering all straight arrows', async () => {
    //Set snapshot comparision threshold
    setThreshold(0.25);

    var chess = new Chess();
    chess.import('1. e4 / e6 2. (0T2)Nb1>>(0T1)b3');
    var cr = new ChessRenderer(null, { app: { preserveDrawingBuffer: true }, viewport: { snapOptions: { time: 10 }, snapZoomOptions: { time: 10 } }, board: { showPresentBlink: false } });
    cr.global.config('arrow', {
      showSpatial: true,
      spatialCurved: false,
      spatialMiddle: false,
      spatialRealEnd: false,
      showNonSpatial: true,
      nonSpatialCurved: false,
      nonSpatialMiddle: false,
      nonSpatialRealEnd: false,
    });
    cr.global.sync(chess);
    await delay(3000);
    cr.zoom.fullBoard();
    await delay(7000);
    await autoShot('arrow-straight', cr.global.app.view);
  });
});