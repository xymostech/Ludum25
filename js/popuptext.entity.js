var PopupTextEntity = (function(){

var PopupTextEntity = CGSGNode.extend({
    initialize: function(text) {
        this._super(0, 450, 800, 150);

        this.text = text;

        this._setup();
    },

    _setup: function() {
        this.background = new CGSGNodeSquare(0, 0, 800, 150);
        this.background.globalAlpha = 0.6;
        this.background.color = "lightgray";
        this.addChild(this.background);

        this.textNode = new CGSGNodeText(25, 25, "");
        this.textNode.setSize(14);
        this.textNode.setTypo("Arial");
        this.textNode.setWrapMode(CGSGWrapMode.WORD);
        this.textNode.setTextAlign("left");
        this.textNode.setMaxWidth(700);
        this.addChild(this.textNode);

        this.timer = 0;
        this.textPos = 0;
    },

    update: function(time) {
        this.timer += time;

        if (this.timer > 0.05) {
            this.textPos++;
            this.textNode.setText(this.text[0] + ": " + this.text[1].substr(0, this.textPos));
            this.timer = 0;
        }
    },

    reset: function() {
        this.textNode.setText("");
        this.timer = 0;
    },

    done: function() {
        return this.textPos > this.text[1].length + 30;
    },
});

return PopupTextEntity;

})();
