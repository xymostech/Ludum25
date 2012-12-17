var PersonSprite = (function(){

var PersonSprite = CGSGNode.extend({
    initialize: function(x, y) {
        this._super(x, y, 15, 35);

        this.behind = new CGSGNode(0, 0, 1, 1);
        this.addChild(this.behind);

        this.rarm = new CGSGNodeSquare(10, 15, 3.5, 11);
        this.rarm.rotation.angle = -0.7;
        this.addChild(this.rarm);

        this.rleg = new CGSGNodeSquare(9, 25, 4, 10);
        this.rleg.rotation.angle = -0.1;
        this.addChild(this.rleg);

        this.body = new CGSGNodeSquare(3, 15, 10, 10.5);
        this.addChild(this.body);

        this.larm = new CGSGNodeSquare(3, 15, 4, 9);
        this.larm.rotation.angle = 0.7;
        this.addChild(this.larm);

        this.lleg = new CGSGNodeSquare(3, 25, 5, 10);
        this.lleg.rotation.angle = 0.1;
        this.addChild(this.lleg);

        this.head = new CGSGNodeSquare(0, 0, 15, 15.5);
        this.addChild(this.head);

        this.animRotations = {
            head: 0.0,
            body: 0.0,
            rarm: -0.7,
            larm: 0.7,
            rleg: -0.1,
            lleg: 0.1,
        };

        this.animSpeed = 20;

        this.x = x;

        this.direction = "right";
    },

    setDirection: function(direction) {
        if (direction === "right") {
            this.position.x = this.x;
            this.scale.x = 1;
        } else {
            this.position.x = this.x + 15;
            this.scale.x = -1;
        }
    },

    setHeadTilt: function(angle) {
        this.animRotations.head = angle;
    },

    setArmsUp: function(angle) {
        this.animRotations.rarm = -angle;
        this.animRotations.larm = angle;
    },

    setArmsTogether: function(angle) {
        this.animRotations.rarm = angle;
        this.animRotations.larm = angle;
    },

    setLegsUp: function(angle) {
        this.animRotations.rleg = -angle;
        this.animRotations.lleg = angle;
    },

    setLegsTogether: function(angle) {
        this.animRotations.rleg = angle;
        this.animRotations.lleg = angle;
    },

    setWalkCycle: function(angle) {
        angle = angle % 2;

        angle = 0.5 - Math.abs(angle - 1);
        angle *= 3;

        this.setArmsUp(angle * 0.7);
        this.setLegsUp(angle * 0.2);
    },

    animate: function(time) {
        _.each(this.animRotations, function(v, k) {
            this[k].rotation.angle = Util.lerp(this[k].rotation.angle, v, time * this.animSpeed);
        }, this);
    }
});

return PersonSprite;

})();
