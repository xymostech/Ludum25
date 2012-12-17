var Util = (function(){

var Util = {
    lerp: function(from, to, lerp) {
        return lerp * (to - from) + from;
    },

    vectorDoesCollideHoriz: function(x1, y1, x2, y2, x3, x4, y4) {
        if (((y1 - y4) < 0) === ((y2 - y4) < 0)) {
            return false;
        }

        var cx = (y4 - y1) / (y2 - y1) * (x2 - x1) + x1;

        var dist = (cx - x3) / (x4 - x3);

        return (dist >= 0) && (dist <= 1.0);
    },

    isColliding: function(oldX, newX, oldLowerY, newLowerY, height, collideX, collideLowerY, collideUpperY) {
        if (((oldX - collideX) < 0) === ((newX - collideX) < 0)) {
            return false;
        }

        var oldUpperY = oldLowerY + height;
        var newUpperY = newLowerY + height;

        var lerp = (oldX - collideX) / (newX - oldX);

        var lerpLowerY = Util.lerp(oldLowerY, newLowerY, lerp);
        var lerpUpperY = Util.lerp(oldUpperY, newUpperY, lerp);

        return (lerpLowerY < collideUpperY) && (lerpUpperY > collideLowerY);
    },
};

return Util;

})();
