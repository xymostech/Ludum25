var SpikesSprite = (function(){

var SpikesSprite = CGSGNode.extend({
    initialize: function(x, y, direction) {
        this._super(x, y, 20, 20);

        this.direction = direction;
    },

    render: function(context) {
        this.beforeRender(context);

        context.beginPath();

        if (this.direction === "up") {
            context.moveTo(0, 20);
            context.lineTo(10, 0);
            context.lineTo(20, 20);
            context.lineTo(0, 20);
        } else if (this.direction === "down") {
            context.moveTo(0, 0);
            context.lineTo(10, 20);
            context.lineTo(20, 0);
            context.lineTo(0, 0);
        } else if (this.direction === "left") {
            context.moveTo(20, 0);
            context.lineTo(0, 10);
            context.lineTo(20, 20);
            context.lineTo(20, 0);
        } else if (this.direction === "right") {
            context.moveTo(0, 0);
            context.lineTo(20, 10);
            context.lineTo(0, 20);
            context.lineTo(0, 0);
        }
        context.closePath();
        context.stroke();

        this.afterRender(context);
    },
});

return SpikesSprite;

})();
