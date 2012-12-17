var PlayerEntity = (function(){

var PlayerEntity = CGSGNode.extend({
    initialize: function(x, y, parent) {
        this._super(x, y, 15, 35);

        this.xvel = 0;
        this.yvel = 0;

        this.onGround = false;

        this.height = 35;
        this.width = 15;

        this.parent = parent;

        this._setup();

        this.walkTimer = 0;
        this.ignoreInput = 0;
    },

    _setup: function() {
        this.sprite = new PersonSprite(0, 0);
        this.addChild(this.sprite);

        this.sprite.face = new CGSGNodeSquare(4, 5, 11, 5);
        this.sprite.face.color = "tan";
        this.sprite.head.addChild(this.sprite.face);
    },

    update: function(time, keys, platforms, walls) {
        //console.log(this.position.x + 7.5, this.position.y + 17.5);

        this.yvel += 800.0 * time;
        this.xvel *= 0.5;

        this.handleInput(keys, time);

        this.onGround = false;

        var oldX = this.position.x;
        var oldY = this.position.y;

        this.position.x += this.xvel * time;
        this.position.y += this.yvel * time;

        this.isWallSliding = false;
        this.wallSlidingDirection = 0;

        this.handleCollisions(oldX, oldY, platforms, walls);

        this.handleAnimation(time);

        this.scrollScreen();
    },

    handleAnimation: function(time) {
        this.sprite.animSpeed = 20;

        if (!this.onGround) {
            if (this.yvel < 0) {
                this.sprite.setArmsUp(1.2);
                this.sprite.setHeadTilt(-0.05);
                this.sprite.setLegsUp(0.0);
            } else {
                if (this.isWallSliding) {
                    this.sprite.setHeadTilt(0.0);
                    this.sprite.setArmsTogether(-0.5);
                    this.sprite.setLegsTogether(-0.5);
                } else {
                    this.sprite.setArmsUp(1.5);
                    this.sprite.setHeadTilt(0.05);
                    this.sprite.setLegsUp(0.2);
                }
            }
        } else {
            if (Math.abs(this.xvel) > 0.02) {
                this.walkTimer += time;
                this.sprite.setWalkCycle(this.walkTimer * 3);
            } else {
                this.walkTimer = 0;
                this.sprite.setArmsUp(0.4);
                this.sprite.setLegsUp(0.05);
            }
            this.sprite.setHeadTilt(0.0);
        }

        if (Math.abs(this.xvel) > 0.02) {
            this.sprite.setDirection(this.xvel < 0 ? "left" : "right");
        }

        this.sprite.animate(time);
    },

    scrollScreen: function() {
        var width = this.parent.width;
        var height = this.parent.height;

        var xoff, yoff;

        if (this.position.x < 400) {
            xoff = 0;
        } else if (this.position.x > width - 400) {
            xoff = width - 800;
        } else {
            xoff = this.position.x - 400;
        }

        if (this.position.y < 300) {
            yoff = 0;
        } else if (this.position.y > height - 300) {
            yoff = height - 600;
        } else {
            yoff = this.position.y - 300;
        }

        this.parent.setOffset(-xoff, -yoff);
    },

    handleInput: function(keys, time) {
        if (keys[87] && this.onGround) {
            this.yvel = -380;
        }

        if (keys[87] && this.isWallSliding && this.yvel > 75) {
            this.yvel = -380;
            this.xvel = -800 * this.wallSlidingDirection;
            this.ignoreInput = 0.25;
            this.ignoreInputDirection = this.wallSlidingDirection;
        }

        if (this.ignoreInput > 0) {
            this.ignoreInput -= time;
        }

        if (keys[68]) {
            if (this.ignoreInput <= 0 || this.ignoreInputDirection !== 1) {
                this.sprite.setDirection("right");
                this.xvel += 130.0;
            }
        } else if(keys[65]) {
            if (this.ignoreInput <= 0 || this.ignoreInputDirection !== -1) {
                this.sprite.setDirection("left");
                this.xvel -= 130.0;
            }
        }
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

return PlayerEntity;

})();
