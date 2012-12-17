var CGSGNodeLine = (function(){

var CGSGNodeLine = CGSGNode.extend({
    initialize: function(xstart, ystart, xend, yend) {
        this._super(xstart, ystart, xend - xstart, yend - ystart);

        this.xstart = xstart;
        this.ystart = ystart;
        this.xend = xend;
        this.yend = yend;

        this.strokeStyle = "black";
    },

    render: function(context) {
        this.beforeRender(context);

        context.lineWidth = 2;
        context.strokeStyle = this.strokeStyle;

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(this.dimension.width, this.dimension.height);
        context.stroke();

        this.afterRender(context);
    },
});

return CGSGNodeLine;

})();
