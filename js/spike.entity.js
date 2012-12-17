var SpikeEntity = (function(){

var SpikeEntity = CGSGNode.extend({
    initialize: function(x, y, direction, parent) {
        this._super(x - 10, y - 10, 20, 20);

        this.x = x;
        this.y = y;

        this.direction = direction;

        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        this.sprite = new SpikesSprite(0, 0, this.direction);
        this.addChild(this.sprite);
    },

    update: function(player) {
        if (this.collidesWith(player.position.x + 7.5, player.position.y + 17.5)) {
            this.parent.restartStage();
        }
    },

    collidesWith: function(x, y) {
        var diffx = this.x - x;
        var diffy = this.y - y;

        return (Math.abs(diffx) < 17.5) && (Math.abs(diffy) < 27.5);
    },
});

return SpikeEntity;

})();
