var ExclamationSprite = (function(){

var ExclamationSprite = CGSGNode.extend({
    initialize: function(x, y) {
        this._super(x, y, 1, 1);
    },

    render: function(context) {
        this.beforeRender(context);

        context.beginPath();
        context.moveTo(0, 0);

        context.lineTo(8, 0);
        context.lineTo(6, 14);
        context.lineTo(2, 14);
        context.lineTo(0, 0);

        context.fillStyle = "red";
        context.fill();

        context.beginPath();
        context.moveTo(2, 16);

        context.lineTo(6, 16);
        context.lineTo(6, 20);
        context.lineTo(2, 20);
        context.lineTo(2, 16);

        context.fillStyle = "red";
        context.fill();

        this.afterRender(context);
    },
});

return ExclamationSprite;

})();
