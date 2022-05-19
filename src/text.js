const deepequal = require('fast-deep-equal');
const deepcopy = require('deepcopy');

class Text {
  constructor(PIXI) {
    this.PIXI = PIXI;

    //Create text storage
    this.texts = {};
  }
  getText(text, textOptions) {
    for(var i = 0;i < this.texts.length;i++) {
      if(typeof this.texts[i][text.toString()] !== 'undefined') {
        if(deepequal(this.texts[i].textOptions, textOptions)) {
          return this.texts[i].textObject;
        }
      }
    }
    var newText = {
      text: text.toString(),
      textOptions: deepcopy(textOptions),
      textObject: new this.PIXI.Text(text, textOptions)
    };
    newText.textObject.updateText();
    this.texts[newText.text] = newText;
    return newText.textObject;
  }
  get(text, textObject) {
    return new this.PIXI.Sprite(this.getText(text, textObject).texture);
  }
  destroy() {
    //TODO Detect if no more users and destroy if needed
    for(var i = 0;i < this.texts.length;i++) {
      this.texts[i].textObject.destroy();
      this.texts.splice(i,1);
      i--;
    }
    this.texts = [];
  }
}

module.exports = Text;
