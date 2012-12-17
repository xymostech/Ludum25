var OppenheimerEntity = (function(){

var platforms = [
    // Floor and ceiling
    [0, 0, 1600],
    [0, 1195, 1600],
];

var walls = [
    // Side walls
    [0, 0, 1200],
    [1595, 0, 1200],
    [645, 400, 800],
];

var lifeQuotes = [
    ["Mutant Zombie Robert Oppenheimer", "RAAARRRGGHHHH.... Bleh."],
    ["Mutant Zombie Robert Oppenheimer", "Darn it, stop throwing these balls at me! Just come a little closer!"],
    ["Mutant Zombie Robert Oppenheimer", "Curse my slowness! I shall catch you!"],
];

var OppenheimerEntity = CGSGNode.extend({
    initialize: function(parent) {
        this._super(1200, 1000, 15, 35);

        this.parent = parent;

        this.xvel = 0;
        this.yvel = 0;

        this.onGround = false;

        this.height = 175;
        this.width = 75;

        this.scale.x = 5;
        this.scale.y = 5;

        this._setup();

        this.walkTimer = 0;

        this.time = 0;
    },

    _setup: function() {
        this.platforms = [];
        this.walls = [];

        this.life = 3;

        _.each(platforms, function(p) {
            var plat = new PlatformEntity(p[0], p[1], p[2]);

            this.platforms.push(plat);
        }, this);

        _.each(walls, function(w) {
            var wall = new WallEntity(w[0], w[1], w[2]);

            this.walls.push(wall);
        }, this);

        this.sprite = new PersonSprite(0, 0);
        this.addChild(this.sprite);

        this.sprite.lcoatarm = new CGSGNodeSquare(0, 0, 4, 5);
        this.sprite.lcoatarm.color = "white";
        this.sprite.larm.addChild(this.sprite.lcoatarm);
        this.sprite.rcoatarm = new CGSGNodeSquare(0, 0, 3.5, 5);
        this.sprite.rcoatarm.color = "white";
        this.sprite.rarm.addChild(this.sprite.rcoatarm);

        this.sprite.hair = new CGSGNodeSquare(0, 0, 15, 3);
        this.sprite.hair.color = "tan";
        this.sprite.head.addChild(this.sprite.hair);

        this.sprite.head.color = "green";
        this.sprite.lleg.color = "black";
        this.sprite.rleg.color = "black";
        this.sprite.larm.color = "green";
        this.sprite.rarm.color = "green";
        this.sprite.body.color = "white";
    },

    update: function(time, player, fdisjo, disfjo, spikes, balls) {
        if (this.life === 0) {
            if (this.parent.textControl.done()) {
                this.parent.parent.changeScene("winner");
            } else {
                this.deathTime -= time;
            }
            return;
        }

        this.yvel += 800.0 * time;
        this.xvel *= 0.5;

        if (!this.parent.textControl.done()) {
            this.time += time;
        } else {
            var diffx = this.position.x + this.width/2 - player.position.x - 7.5;
            if (Math.abs(diffx) < 1.0) {
            } else if (diffx < 0) {
                this.xvel += 25;
            } else {
                this.xvel -= 25;
            }
        }

        this.onGround = false;

        var oldX = this.position.x;
        var oldY = this.position.y;

        this.position.x += this.xvel * time;
        this.position.y += this.yvel * time;

        this.isWallSliding = false;
        this.wallSlidingDirection = 0;

        this.handleCollisions(oldX, oldY, this.platforms, this.walls);

        var diffx = this.position.x + this.width/2 - player.position.x - 7.5;
        var diffy = this.position.y + this.height/2 - player.position.y - 17.5;

        if (Math.abs(diffx) < (this.width + player.width) / 2 && Math.abs(diffy) < (this.height + player.height) / 2 - 5) {
            this.parent.restartStage();
        }

        _.each(balls, function(b) {
            if (b.used) return;
            var diffx = this.position.x + this.width / 2 - b._center.x;

            if (b._center.y < 1100) {
                return;
            }

            if (Math.abs(diffx) < this.width / 2 + b._radius) {
                this.life -= 1;
                this.time = 3;

                b.used = true;

                this.parent.textControl.setText(lifeQuotes[this.life]);

                if (this.life === 0) {
                    this.die();
                }
            }
        }, this);

        this.handleAnimation(time);
    },

    die: function() {
        this.rotation.angle = Math.PI / 2;
        this.deathTime = 9;
        this.position.y += 100;
        this.position.x += 100;
        this.parent.textControl.queueText(["Barbara", "Congratulations! You killed him! Now let's get out of here!"]);
    },

    handleAnimation: function(time) {
        this.sprite.animSpeed = 20;

        if (!this.onGround) {
            if (this.yvel < 0) {
                this.sprite.setHeadTilt(-0.05);
                this.sprite.setLegsUp(0.0);
            } else {
                if (this.isWallSliding) {
                    this.sprite.setHeadTilt(0.0);
                    this.sprite.setLegsTogether(-0.5);
                } else {
                    this.sprite.setHeadTilt(0.05);
                    this.sprite.setLegsUp(0.2);
                }
            }
        } else {
            if (Math.abs(this.xvel) > 0.02) {
                this.walkTimer += time;
                this.sprite.setWalkCycle(this.walkTimer * 2);
            } else {
                this.walkTimer = 0;
                this.sprite.setLegsUp(0.05);
            }
            this.sprite.setHeadTilt(0.0);
        }

        this.sprite.setArmsTogether(-1.0);

        if (Math.abs(this.xvel) > 0.02) {
            this.sprite.setDirection(this.xvel < 0 ? "left" : "right");
        }

        this.sprite.animate(time);
    },

    handleCollisions: function(oldX, oldY, platforms, walls) {
        var newX = this.position.x;
        var newY = this.position.y;

        _.each(walls.concat(platforms), function(wall) {
            var lwallX = wall.position.x;
            var rwallX = wall.position.x + wall.dimension.width;
            var twallY = wall.position.y;
            var bwallY = wall.position.y + wall.dimension.height;

            if (this.xvel < 0) {
                if (!(oldX >= rwallX && newX <= rwallX)) {
                    return;
                }

                var collideY = (rwallX - oldX) / (newX - oldX) * (newY - oldY) + oldY;

                if (collideY < bwallY && collideY + this.height > twallY) {
                    this.xvel = 0;
                    newX = rwallX;

                    if (this.yvel > -100) {
                        this.yvel *= 0.87;
                        this.isWallSliding = true;
                        this.wallSlidingDirection = -1;
                    }
                }
            } else {
                if (!(oldX + this.width <= lwallX && newX + this.width >= lwallX)) {
                    return;
                }

                var collideY = (lwallX - (oldX + this.width)) / (newX - oldX) * (newY - oldY) + oldY;

                if (collideY < bwallY && collideY + this.height > twallY) {
                    this.xvel = 0;
                    newX = lwallX - this.width;

                    if (this.yvel > -100) {
                        this.yvel *= 0.87;
                        this.isWallSliding = true;
                        this.wallSlidingDirection = 1;
                    }
                }
            }
        }, this);

        _.each(platforms.concat(walls), function(plat) {
            var lplatX = plat.position.x;
            var rplatX = plat.position.x + plat.dimension.width;
            var tplatY = plat.position.y;
            var bplatY = plat.position.y + plat.dimension.height;

            if (this.yvel > 0) {
                if (tplatY < oldY + this.height || tplatY > newY + this.height) {
                    return;
                }

                var collideX = (tplatY - (oldY + this.height)) / (newY - oldY) * (newX - oldX) + oldX;

                if (collideX < rplatX && collideX + this.width > lplatX) {
                    newY = tplatY - this.height;

                    this.yvel = 0;
                    this.onGround = true;
                }
            } else {
                if (bplatY > oldY || bplatY < newY) {
                    return;
                }

                var collideX = (bplatY - oldY) / (newY - oldY) * (newX - oldX) + oldX;

                if (collideX < rplatX && collideX + this.width > lplatX) {
                    newY = bplatY;

                    this.yvel = 0;
                }
            }

        }, this);

        this.position.x = newX;
        this.position.y = newY;
    },
});

return OppenheimerEntity;

})();
