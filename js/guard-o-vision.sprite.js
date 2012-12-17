var GuardOVisionSprite = (function(){

var GuardOVisionSprite = CGSGNode.extend({
    initialize: function(x, y, direction, length, angle) {
        this._super(x, y, 1, 1);

        this.direction = direction;
        this.length = length;
        this.angle = angle;
    },

    render: function(context) {
        this.beforeRender(context);

        var xoff = Math.cos(this.angle) * this.length;
        var yoff = Math.sin(this.angle) * this.length;

        context.beginPath();
        context.moveTo(0, 0);

        if (this.direction > 0) {
            context.lineTo(xoff, yoff);
            context.arc(0, 0, this.length, this.angle, -this.angle, true);
            context.lineTo(0, 0);
        } else {
            context.lineTo(-xoff, yoff);
            context.arc(0, 0, this.length, Math.PI - this.angle, Math.PI + this.angle, false);
            context.lineTo(0, 0);
        }

        var gradient = context.createRadialGradient(0, 0, 0, 0, 0, this.length);

        gradient.addColorStop(0.0, "black");
        gradient.addColorStop(0.8, "rgba(0, 0, 0, 0.6)");
        gradient.addColorStop(1.0, "rgba(0, 0, 0, 0)");

        context.globalAlpha = 0.3;
        context.fillStyle = gradient;
        context.fill();

        this.afterRender(context);
    },
});

return GuardOVisionSprite;

})();
