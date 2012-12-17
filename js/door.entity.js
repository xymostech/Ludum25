var DoorEntity = (function(){

var DoorEntity = CGSGNode.extend({
    initialize: function(x, y, nextStage, parent) {
        this._super(x, y, 1, 1);

        this.x = x;
        this.y = y;

        this.nextStage = nextStage;
        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        this.spriteNode2 = new CGSGNodeSquare(-12, -12, 24, 47);
        this.spriteNode2.color = "gray";
        this.addChild(this.spriteNode2);

        this.spriteNode = new CGSGNodeSquare(-10, -10, 20, 45);
        this.addChild(this.spriteNode);
    },

    update: function(time, player) {
        var diffx = this.x - player.position.x - 7.5;
        var diffy = this.y - player.position.y - 17.5;

        if (diffx * diffx + diffy * diffy < 400) {
            this.parent.parent.changeScene(this.nextStage);
        }
    },
});

return DoorEntity;

})();
