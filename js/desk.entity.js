var DeskEntity = (function(){

var DeskEntity = CGSGNode.extend({
    initialize: function(x, y, parent) {
        this._super(x, y, 40, 30);

        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        this.top = new CGSGNodeSquare(1.5, 5, 37, 15);
        this.top.color = "#5E2A07";
        this.addChild(this.top);
        this.toptop = new CGSGNodeSquare(0, 5, 40, 4);
        this.toptop.color = "#5E2A07";
        this.addChild(this.toptop);
        this.lleg = new CGSGNodeSquare(1.5, 20, 5, 10);
        this.lleg.color = "#5E2A07";
        this.addChild(this.lleg);
        this.rleg = new CGSGNodeSquare(33.5, 20, 5, 10);
        this.rleg.color = "#5E2A07";
        this.addChild(this.rleg);

        this.used = false;
    },

    update: function(player) {
        if (this.used) {
            return;
        }

        var diffx = this.position.x + 20 - player.position.x - 7.5;
        var diffy = this.position.y + 15 - player.position.y - 17.5;

        if (Math.abs(diffx) < 15 && Math.abs(diffy) < 15) {
            this.parent.activateTrap();
            this.used = true;
        }
    },
});

return DeskEntity;

})();
