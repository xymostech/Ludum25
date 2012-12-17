var BreakableGlassEntity = (function(){

var BreakableGlassEntity = CGSGNode.extend({
    initialize: function(x, y, length, direction, parent) {
        this._super(0, 0, 1, 1);

        this.x = x;
        this.y = y;
        this.length = length;
        this.direction = direction;
        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        if (this.direction === "vertical") {
            this.width = 5;
            this.height = this.length;
        } else {
            this.width = this.length;
            this.height = 5;
        }

        this.glass = new CGSGNodeSquare(this.x, this.y, this.width, this.height);

        this.glass.color = "blue";
        this.glass.globalAlpha = 0.5;

        this.addChild(this.glass);
        this.parent.walls.push(this.glass);
    },

    update: function(time, player) {
        var oldPlayerX = player.position.x;
        var newPlayerX = player.position.x + player.xvel * time;
        var oldPlayerY = player.position.y;
        var newPlayerY = player.position.y + player.yvel * time;

        if (this.direction === "vertical") {
            if (player.xvel > 250) {
                if (Util.isColliding(oldPlayerX + player.width, newPlayerX + player.width, oldPlayerY, newPlayerY, player.height, this.glass.position.x, this.glass.position.y, this.glass.position.y + this.length)) {
                    this.shatter();
                }
            } else if (player.xvel < -210) {
                if (Util.isColliding(oldPlayerX, newPlayerX, oldPlayerY, newPlayerY, player.height, this.glass.position.x + 5, this.glass.position.y, this.glass.position.y + this.length)) {
                    this.shatter();
                }
            }
        } else {
            if (player.yvel > 600) {
                if (Util.isColliding(oldPlayerY + player.height, newPlayerY + player.height, oldPlayerX, newPlayerX, player.width, this.glass.position.y, this.glass.position.x, this.glass.position.x + this.length)) {
                    this.shatter();
                }
            }
        }
    },

    shatter: function() {
        this.removeChild(this.glass);
        this.parent.walls = _.reject(this.parent.walls, function(w) {
            return w === this.glass;
        }, this);
    },
});

return BreakableGlassEntity;

})();
