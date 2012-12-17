var Switch2Entity = (function(){

var Switch2Entity = CGSGNode.extend({
    initialize: function(sx, sy, dx, dy, dh, start, parent) {
        this._super(0, 0, 1, 1);

        this.sx = sx;
        this.sy = sy;
        this.dx = dx;
        this.dy = dy;
        this.dh = dh;
        this.startState = start;

        this.parent = parent;

        this.keyWasPressed = true;
        this.wasColliding = true;

        this._setup();
    },

    _setup: function() {
        this.switchNode = new CGSGNodeSquare(this.sx - 5, this.sy - 5, 10, 10);
        this.switchNode.color = "green";
        this.addChild(this.switchNode);

        this.doorNode = new CGSGNodeSquare(this.dx, this.dy, 5, this.dh);
        this.sphereNode = new CGSGNodeRealCircle(this.dx + 2.5, this.dy + this.dh, 30);

        this.state = false;

        this.setState(this.startState);

        this.used = false;
    },

    setState: function(state) {
        if (this.used) return;

        if (this.state != state) {
            if (this.state) {
                this.removeChild(this.doorNode);
                this.switchNode.color = "green";
                this.sphereNode.color = "red";

                this.parent.balls.push(this.sphereNode);

                this.sphereNode.yvel = 0;

                this.parent.walls = _.filter(this.parent.walls, function(e) {
                    return e != this.doorNode;
                }, this);

                this.used = true;
            } else {
                this.addChild(this.doorNode);
                this.addChild(this.sphereNode);
                this.switchNode.color = "red";

                this.parent.walls.push(this.doorNode);
            }

            this.state = state;
        }
    },

    update: function(time, keys, player) {
        if (this.keyWasPressed && !keys[69]) {
            this.keyWasPressed = false;
        }

        var diffx = this.switchNode.position.x - player.position.x;
        var diffy = this.switchNode.position.y - player.position.y;

        var collides = Math.sqrt(diffx * diffx + diffy * diffy) < 20;

        if (keys[69] && collides && !this.keyWasPressed) {
            this.setState(!this.state);
            this.keyWasPressed = true;
        }

        if (this.used) {
            if (this.sphereNode._center.y < 1160) {
                this.sphereNode.yvel += 800 * time;
                this.sphereNode.position.y += this.sphereNode.yvel * time;
                this.sphereNode._center.y += this.sphereNode.yvel * time;
            } else {
                this.sphereNode.position.y = 1135;
            }

            if (this.sphereNode.used) {
                this.removeChild(this.sphereNode);
            }
        }
    },
});

return Switch2Entity;

})();
