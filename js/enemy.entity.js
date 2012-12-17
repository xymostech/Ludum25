var EnemyEntity = (function(){

var EnemyEntity = CGSGNode.extend({
    initialize: function(x, y, speed, path) {
        this._super(x, y, 25, 25);

        this.speed = speed;
        this.path = path;

        this._setup();
    },

    _setup: function() {
        this.direction = [1, 0];
        this.pathpart = 0;

        this.line = new GuardOVisionSprite(9, 0, 1, 150, Math.PI / 6);
        this.addChild(this.line);

        this.body = new PersonSprite(0, -10);
        this.body.head.color = "tan";
        this.body.body.color = "#000";
        this.body.larm.color = "#000";
        this.body.rarm.color = "#000";
        this.body.lleg.color = "#103761";
        this.body.rleg.color = "#103761";
        this.addChild(this.body);

        this.runTimer = 0;
    },

    update: function(time, player, platforms, walls) {
        var moveto = this.path[this.pathpart];

        var diffx = moveto[0] - this.position.x;
        var diffy = moveto[1] - this.position.y;

        var dist = Math.sqrt(diffx * diffx + diffy * diffy);

        diffx /= dist;
        diffy /= dist;

        this.direction = [diffx, diffy];

        this.line.direction = diffx;

        this.line.dimension.width = diffx * 150;
        this.line.dimension.height = diffy * 150;

        if (dist < this.speed * time) {
            this.position.x = moveto[0];
            this.position.y = moveto[1];

            this.pathpart = (this.pathpart + 1) % this.path.length;
        } else {
            this.position.x += this.speed * diffx * time;
            this.position.y += this.speed * diffy * time;
        }

        this.runTimer += time;

        this.body.setWalkCycle(this.runTimer * 2);
        this.body.animate(time);

        if (this.canSee(player.position.x + player.width / 2, player.position.y + player.height / 2, platforms, walls)) {
            this.exclamation = new ExclamationSprite(3, -38);
            this.addChild(this.exclamation);
        }
    },

    canSee: function(x, y, platforms, walls) {
        var diffx = x - (this.position.x + 12.5);
        var diffy = y - (this.position.y + 12.5);

        var dot = diffx * this.direction[0] + diffy * this.direction[1];

        if (dot < 0) {
            return false;
        }

        var dist = Math.sqrt(diffx * diffx + diffy * diffy);

        if (dist > 150) {
            return false;
        }

        var angle = Math.acos((diffx * this.direction[0] + diffy * this.direction[1]) / dist);

        if (angle > Math.PI / 6) {
            return false;
        }

        if (_.any(platforms, function(plat) {
            return Util.vectorDoesCollideHoriz(this.position.x + 12.5, this.position.y + 12.5, x, y, plat.position.x, plat.position.x + plat.dimension.width, plat.position.y);
        }, this)) {
            return false;
        }

        if (_.any(walls, function(plat) {
            return Util.vectorDoesCollideHoriz(this.position.y + 12.5, this.position.x + 12.5, y, x, plat.position.y, plat.position.y + plat.dimension.height, plat.position.x);
        }, this)) {
            return false;
        }

        return true;
    },
});

return EnemyEntity;

})();
