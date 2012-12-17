var FeynmanStage = (function(){

var playerSpawn = [30, 840];
//var playerSpawn = [1400, 300];

var thisStage = "feynman";

var platforms = [
    // Floor and ceiling
    [0, 160, 1600],
    [0, 895, 1600],
    // First stage
    [190, 820, 150],
    [0, 740, 150],
    [190, 660, 150],
    [0, 580, 150],
    [190, 500, 150],
    [0, 420, 150],
    [190, 340, 480],
    [0, 260, 150],
    // Second stage
    [670, 640, 265],
    [1035, 640, 195],
    [1330, 640, 270],
    [760, 480, 150],
    [1370, 480, 150],
    //[1060, 560, 150],
    [1060, 400, 150],
];

var walls = [
    // Side walls
    [0, 0, 900],
    [1595, 0, 900],
    // First stage
    [340, 160, 80],
    [340, 340, 560],
    [670, 160, 80],
    [670, 340, 560],
    // Second stage
    [930, 640, 260],
    [1035, 640, 260],
    [1225, 640, 260],
    [1330, 640, 260],
];

var enemies = [
];

var switches = [
    [20, 240, 340, 240, 100, true],
    [540, 320, 670, 240, 100, true],
];

var breakableglass = [
    [935, 640, 100, "horizontal"],
    [1230, 640, 100, "horizontal"],
];

var checkpoints = [
];

var spikes = [
    [945, 885, "up"],
    [965, 885, "up"],
    [985, 885, "up"],
    [1005, 885, "up"],
    [1025, 885, "up"],
    [1240, 885, "up"],
    [1260, 885, "up"],
    [1280, 885, "up"],
    [1300, 885, "up"],
    [1320, 885, "up"],
];

var doors = [
];

var texts = [
    [80, 740, 200, 160, ["Barbara", "Okay, you know the drill this time."]],
    [400, 200, 150, 150, ["Barbara", "Wow, they have double doors? Well, I guess you can never be too careful..."]],
    [700, 240, 200, 400, ["Barbara", "Wow, and spike pits too! Be careful you don't break the glass above them, or else you might fall in!"]],
    [1300, 400, 300, 400, ["Barbara", "There's the plans! Take them and let's get out of here!"]],
    //[330, 400, 150, 100, "Good work! And you even got to a checkpoint. This should help in case we run into anything bad..."],
    //[630, 380, 150, 120, "Uh oh. Looks like there's some guards up ahead. It would be best to not be spotted. Good thing we have our trusty Guard-O-Vision, to help us know when they can see us."],
    //[600, 780, 400, 120, "Uhh, you did remember to flip the switch up there, to open this door, right?"],
    //[1000, 780, 150, 120, "Good work, we're almost at the door! Now if only we could break through this glass somehow..."],
    //[1450, 600, 200, 140, "Maybe if you try jumping at it from a really high hight, that would work."],
    //[1150, 820, 150, 80, "Yay! You made it! Now let's move on to the next room."],
];

var FeynmanStage = CGSGNode.extend({
    initialize: function(parent, checkpoint) {
        this._super(0, 0, 1, 1);

        this.parent = parent;
        this.checkpoint = checkpoint;

        this._setup();
    },

    _setup: function() {
        // Highest level nodes
        // Stage node moves with stage
        this.stageNode = new CGSGNode(0, 0, 1, 1);
        this.addChild(this.stageNode);

        // Text node for text that doesn't move
        this.textNode = new CGSGNode(0, 0, 1, 1);
        this.addChild(this.textNode);

        this.textControl = new TextManagerEntity();
        this.textNode.addChild(this.textControl);

        // Second level nodes for drawing entities to
        // background node for background pictures, etc
        this.backgroundNode = new CGSGNode(0, 0, 1, 1);
        this.stageNode.addChild(this.backgroundNode);

        // Environment; walls, switches, etc
        this.environmentNode = new CGSGNode(0, 0, 1, 1);
        this.stageNode.addChild(this.environmentNode);

        // Enemies
        this.enemiesNode = new CGSGNode(0, 0, 1, 1);
        this.stageNode.addChild(this.enemiesNode);

        // The player
        this.playerNode = new CGSGNode(0, 0, 1, 1);
        this.stageNode.addChild(this.playerNode);

        this.width = 1600;
        this.height = 900;

        if (this.checkpoint) {
            this.player = new PlayerEntity(this.checkpoint.x + 10 - 7.5, this.checkpoint.y + 10 - 20, this);
        } else {
            this.player = new PlayerEntity(playerSpawn[0], playerSpawn[1], this);
        }
        this.playerNode.addChild(this.player);

        this.platforms = [];
        this.walls = [];

        _.each(platforms, function(p) {
            var plat = new PlatformEntity(p[0], p[1], p[2]);

            this.platforms.push(plat);
            this.environmentNode.addChild(plat);
        }, this);

        _.each(walls, function(w) {
            var wall = new WallEntity(w[0], w[1], w[2]);

            this.walls.push(wall);
            this.environmentNode.addChild(wall);
        }, this);

        this.enemies = [];

        _.each(enemies, function(e) {
            var enemy = new EnemyEntity(e[0], e[1], e[2], e[3]);

            this.enemies.push(enemy);
            this.enemiesNode.addChild(enemy);
        }, this);

        this.switches = [];

        _.each(switches, function(s) {
            var switc = new SwitchEntity(s[0], s[1], s[2], s[3], s[4], s[5], this);

            this.switches.push(switc);
            this.environmentNode.addChild(switc);
        }, this);

        this.breakableglass = [];

        _.each(breakableglass, function(b) {
            var breakable = new BreakableGlassEntity(b[0], b[1], b[2], b[3], this);

            this.breakableglass.push(breakable);
            this.environmentNode.addChild(breakable);
        }, this);

        this.spikes = [];

        _.each(spikes, function(s) {
            var spike = new SpikeEntity(s[0], s[1], s[2], this);

            this.spikes.push(spike);
            this.environmentNode.addChild(spike);
        }, this);

        this.checkpoints = [];

        _.each(checkpoints, function(c) {
            var checkpoint = new CheckpointEntity(c[0], c[1], this);

            this.checkpoints.push(checkpoint);
            this.environmentNode.addChild(checkpoint);
        }, this);

        this.doors = [];

        _.each(doors, function(d) {
            var door = new DoorEntity(d[0], d[1], d[2], this);

            this.doors.push(door);
            this.environmentNode.addChild(door);
        }, this);

        this.texts = [];

        _.each(texts, function(t) {
            var text = new TextActivatorEntity(t[0], t[1], t[2], t[3], t[4], this);

            this.texts.push(text);
            this.environmentNode.addChild(text);
        }, this);

        this.desk = new DeskEntity(1550, 610, this);
        this.environmentNode.addChild(this.desk);
    },

    update: function(time, keys) {
        _.each(this.breakableglass, function(b) {
            b.update(time, this.player);
        }, this);

        this.desk.update(this.player);

        this.player.update(time, keys, this.platforms, this.walls);

        if (this.feynman) {
            this.feynman.update(time, this.player, this.platforms, this.walls, this.spikes);
        }

        _.each(this.enemies, function(e) {
            e.update(time, this.player, this.platforms, this.walls);

            if (e.canSee(this.player.position.x + this.player.width / 2, this.player.position.y + this.player.height / 2, this.platforms, this.walls)) {
                this.restartStage();
            }
        }, this);

        _.each(this.switches, function(s) {
            s.update(time, keys, this.player);
        }, this);

        _.each(this.checkpoints, function(c) {
            c.update(time, this.player);
        }, this);

        _.each(this.doors, function(d) {
            d.update(time, this.player);
        }, this);

        _.each(this.spikes, function(s) {
            s.update(this.player);
        }, this);

        this.textControl.update(time, keys);

        _.each(this.texts, function(t) {
            t.update(time, this.player);
        }, this);
    },

    restartStage: function() {
        this.parent.changeScene(thisStage, this.checkpoint);
    },

    setOffset: function(x, y) {
        this.stageNode.position.x = x;
        this.stageNode.position.y = y;
    },

    activateTrap: function() {
        _.each(this.switches, function(s) {
            s.setState(true);
        }, this);

        this.feynman = new FeynmanEntity(this);
        this.enemiesNode.addChild(this.feynman);

        this.textControl.stop();
        this.textControl.queueText(["Barbara", "Oh no, it's zombie Richard Feynman!"]);
        this.textControl.queueText(["Zombie Richard Feynman", "Muahaha, you've fallen right into my trap! Prepare to meet the swift hands of zombie justice!"]);
        this.textControl.queueText(["Barbara", "It's a trap, get out of there!"]);

        this.parent.playMusic("audio/boss.wav");
    },
});

return FeynmanStage;

})();
