const Global = require('@local/global');
const Render = require('@local/render');

class ChessRenderer {
  constructor(customElement = null, customConfig = null, customPalette = null, customPIXI = null) {
    this.global = new Global(customConfig, customPalette, customPIXI);
    this.render = new Render(this.global);
    
    if(customElement !== null) {
      this.global.attach(customElement);
    }
  }
  on(event, callback) {
    return this.global.emitter.on(event, callback);
  }
}

module.exports = ChessRenderer;
