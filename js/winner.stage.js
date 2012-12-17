var WinnerStage = (function(){

var WinnerStage = CGSGNode.extend({
    initialize: function(parent) {
        this._super(0, 0, 1, 1);

        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        this.selection = 0;
        this.selections = [];

        this.list = new CGSGNode(0, 0, 1, 1);
        this.addChild(this.list);

        this.page = new CGSGNodeSquare(0, 0, 800, 600);
        this.page.color = "white";
        this.list.addChild(this.page);

        this.winText = new CGSGNodeText(150, 150, "YOU WIN!");
        this.winText.setSize(80);
        this.page.addChild(this.winText);

        this.sprite = new PersonSprite(350, 400);
        this.addChild(this.sprite);

        this.sprite.scale.x = 5;
        this.sprite.scale.y = 5;

        this.sprite.face = new CGSGNodeSquare(4, 5, 11, 5);
        this.sprite.face.color = "tan";
        this.sprite.head.addChild(this.sprite.face);

        this.sprite.head.rotation.angle = -0.05;
        this.sprite.larm.rotation.angle = 2.3;
        this.sprite.larm.position.x += 2;
        this.sprite.rarm.rotation.angle = -2.3;
    },

    update: function(time, keys) {
    },
});

return WinnerStage;

})();
