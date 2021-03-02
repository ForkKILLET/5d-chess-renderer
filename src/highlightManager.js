class HighlightManager {
  constructor(global) {
    this.global = global;
    this.emitter = this.global.emitter;
    
    this.availableMoves = [];
    this.pastAvailableMoves = [];
  }
}

module.exports = HighlightManager;
