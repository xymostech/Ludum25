var GoatEntity = (function(){

var GoatEntity = CGSGNode.extend({
    initialize: function(x, y, parent) {
        this._super(x, y, 30, 30);

        this.parent = parent;

        this.scale.x = 1.5;
        this.scale.y = 1.5;

        this.used = false;
    },

    render: function(context) {
        if (this.used) {
            return;
        }

        this.beforeRender(context);

        context.beginPath();

        context.moveTo(3, 0);
        context.lineTo(20, 0);
        context.lineTo(22, -10);
        context.lineTo(25, -11);
        context.lineTo(33, -3);
        context.lineTo(30, 0);
        context.lineTo(25, -3);
        context.lineTo(26, -12/5);
        context.lineTo(26, 5);
        context.lineTo(28, 15);
        context.lineTo(26, 15.5);
        context.lineTo(23, 6);
        context.lineTo(13, 8);
        context.lineTo(5, 7);
        context.lineTo(3, 15.5);
        context.lineTo(1, 15);
        context.lineTo(2, 5);
        context.lineTo(1, 1);
        context.lineTo(-2, -1);
        context.lineTo(-1, -2);

        context.closePath();
        context.stroke();
        context.fill();

        this.afterRender(context);
    },

    update: function(time, player) {
        if (this.used) {
            return;
        }

        var diffx = this.position.x + 6 - player.position.x - 7.5;
        var diffy = this.position.y + 10 - player.position.y - 17.5;

        if (Math.abs(diffx) < 15 && Math.abs(diffy) < 20) {
            this.parent.trap();
            this.used = true;
        }
    },
});

return GoatEntity;

})();
