var CheckpointEntity = (function(){

var CheckpointEntity = CGSGNode.extend({
    initialize: function(x, y, parent) {
        this._super(0, 0, 2, 2);

        this.x = x;
        this.y = y;

        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        this.used = false;

        this.shape = new CGSGNodeRealCircle(this.x, this.y, 15);
        this.shape.color = "blue";
        this.shape.globalAlpha = 0.5;
        this.addChild(this.shape);
    },

    update: function(time, player) {
        if (this.used) {
            return;
        }

        var diffx = this.x - player.position.x - 7.5;
        var diffy = this.y - player.position.y - 17.5;

        if (diffx * diffx + diffy * diffy < 400) {
            this.use();
        }
    },

    use: function() {
        this.parent.checkpoint = this;
        this.used = true;
        this.shape.globalAlpha = 0.2;
    },
});

return CheckpointEntity;

})();
