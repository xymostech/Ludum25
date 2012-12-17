var TextActivatorEntity = (function(){

var TextActivatorEntity = CGSGNode.extend({
    initialize: function(x, y, width, height, text, parent) {
        this._super(x, y, width, height);

        this.text = text;
        this.used = false;

        this.parent = parent;

        //this.show = new CGSGNodeSquare(0, 0, width, height);
        //this.show.globalAlpha = 0.3;
        //this.addChild(this.show);
    },

    update: function(time, player) {
        if (this.used) {
            return;
        }

        var px = player.position.x + 7.5;
        var py = player.position.y + 17.5;

        if (px < this.position.x + this.dimension.width && px > this.position.x &&
            py < this.position.y + this.dimension.height && py > this.position.y) {
            this.parent.textControl.setText(this.text);
            this.used = true;
        }
    },
});

return TextActivatorEntity;

})();
