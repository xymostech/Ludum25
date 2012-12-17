var WallEntity = (function(){

var WallEntity = CGSGNodeSquare.extend({
    initialize: function(x, y, height) {
        this._super(x, y, 5, height);
    },
});

return WallEntity;

})();
