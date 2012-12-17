var MatsStage = (function(){

var playerSpawn = [50, 50];

var platforms = [
    // Floor and ceiling
    [0, 0, 1600],
    [0, 1195, 1600],
    // First stage
    [0, 100, 100],
    [0, 700, 100],
    [0, 800, 105],
    [100, 900, 150],
    [245, 800, 400],
    [245, 700, 150],
    // Second part
    [525, 720, 120],
    [395, 640, 120],
    [525, 560, 120],
    [395, 480, 120],
    [645, 400, 100],
    [645, 500, 250],
    [845, 400, 755],
    [395, 320, 350],
    [845, 320, 655],
    [1450, 120, 50],
    [1270, 120, 50],
    [1090, 120, 50],
    [845, 120, 100],
    // Boss
    [1500, 1120, 100],
    [1400, 1040, 100],
    [1500, 960, 100],

    [1200, 1040, 50],
    [1000, 1040, 50],
    [800, 1040, 50],
    [1250, 960, 50],
    [1050, 960, 50],
    [850, 960, 50],
    [1300, 880, 50],
    [1100, 880, 50],
    [900, 880, 50],
    [650, 1120, 100],
];

var walls = [
    // Side walls
    [0, 0, 1200],
    [1595, 0, 1200],
    // First Stage
    [100, 100, 605],
    [245, 0, 705],
    [245, 800, 100],
    [100, 800, 100],
    [395, 0, 705],
    // Second Stage
    [645, 400, 800],
    [1500, 120, 205],
    [845, 120, 205],
    [740, 0, 325],
];

var enemies = [
];

var switches = [
    [50, 770, 245, 700, 100, true],
];

var switches2 = [
    [825, 1020, 935, 880, 50, true],
    [1025, 1020, 1135, 880, 50, true],
    [1225, 1020, 1335, 880, 50, true],
];

var breakableglass = [
    [105, 800, 140, "horizontal"],
    [745, 400, 100, "horizontal"],
    [745, 320, 100, "horizontal"],
];

var checkpoints = [
    [320, 770],
    [800, 470],
];

var doors = [
];

var spikes = [
    // left wall
    [115, 130, "right"],
    [115, 150, "right"],
    [115, 170, "right"],
    [115, 190, "right"],
    [115, 210, "right"],
    // right wall
    [235, 310, "left"],
    [235, 330, "left"],
    [235, 350, "left"],
    [235, 370, "left"],
    [235, 390, "left"],
    [235, 410, "left"],
    [235, 430, "left"],
    [235, 450, "left"],
    [235, 470, "left"],
    [235, 570, "left"],
    [235, 590, "left"],
    // left wall again
    [115, 530, "right"],
    [115, 550, "right"],
    [115, 570, "right"],
    [115, 590, "right"],
    // left wall again
    [115, 530, "right"],
    [115, 550, "right"],
    [115, 570, "right"],
    [115, 590, "right"],
    [115, 610, "right"],
    // pit
    [115, 890, "up"],
    [135, 890, "up"],
    [155, 890, "up"],
    [175, 890, "up"],
    [195, 890, "up"],
    [215, 890, "up"],
    [235, 890, "up"],
    // pit 2
    [860, 310, "up"],
    [880, 310, "up"],
    [900, 310, "up"],
    [920, 310, "up"],
    [940, 310, "up"],
    [960, 310, "up"],
    [980, 310, "up"],
    [1000, 310, "up"],
    [1020, 310, "up"],
    [1040, 310, "up"],
    [1060, 310, "up"],
    [1080, 310, "up"],
    [1100, 310, "up"],
    [1120, 310, "up"],
    [1140, 310, "up"],
    [1160, 310, "up"],
    [1180, 310, "up"],
    [1200, 310, "up"],
    [1220, 310, "up"],
    [1240, 310, "up"],
    [1260, 310, "up"],
    [1280, 310, "up"],
    [1300, 310, "up"],
    [1320, 310, "up"],
    [1340, 310, "up"],
    [1360, 310, "up"],
    [1380, 310, "up"],
    [1400, 310, "up"],
    [1420, 310, "up"],
    [1440, 310, "up"],
    [1460, 310, "up"],
    [1480, 310, "up"],
];

var texts = [
    [0, 0, 100, 100, ["Barbara", "Okay, we just need to get these materials, and then we can rule the world. Watch out for those spikes, though!"]],
    [1400, 0, 200, 200, ["Barbara", "That's a big spike pit! Don't fall in!"]],
    [1400, 1000, 200, 200, ["Barbara", "We've almost got them! The materials are through that door!"]],
];

var thisStage = "mats";

var MatsStage = CGSGNode.extend({
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
        this.height = 1200;

        if (this.checkpoint) {
            this.player = new PlayerEntity(this.checkpoint.x + 10 - 7.5, this.checkpoint.y + 10 - 20, this);
        } else {
            this.player = new PlayerEntity(playerSpawn[0], playerSpawn[1], this);
        }
        this.playerNode.addChild(this.player);

        this.balls = [];

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

        _.each(switches2, function(s) {
            var switc = new Switch2Entity(s[0], s[1], s[2], s[3], s[4], s[5], this);

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

        this.fakeDoor = new FakeDoorEntity(1550, 1160, "", this);
        this.doors.push(this.fakeDoor);
        this.environmentNode.addChild(this.fakeDoor);
    },

    update: function(time, keys) {
        _.each(this.breakableglass, function(b) {
            b.update(time, this.player);
        }, this);

        this.player.update(time, keys, this.platforms, this.walls);

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

        _.each(this.spikes, function(s) {
            s.update(this.player);
        }, this);

        _.each(this.doors, function(d) {
            d.update(time, this.player);
        }, this);

        this.textControl.update(time, keys);

        _.each(this.texts, function(t) {
            t.update(time, this.player);
        }, this);

        if (this.oppen) {
            this.oppen.update(time, this.player, this.platforms, this.walls, [], this.balls);
        }
    },

    restartStage: function() {
        this.parent.changeScene(thisStage, this.checkpoint);
    },

    setOffset: function(x, y) {
        this.stageNode.position.x = x;
        this.stageNode.position.y = y;
    },

    trap: function() {
        this.oppen = new OppenheimerEntity(this);
        this.enemiesNode.addChild(this.oppen);

        this.textControl.queueText(["Barbara", "Seriously, Mutant Zombie Robert Oppenheimer? What's up with all these zombie physicists!?"]);
        this.textControl.queueText(["Mutant Zombie Robert Oppenheimer", "I have been waiting for you, O villainous one."]);
        this.textControl.queueText(["Mutant Zombie Robert Oppenheimer", "Soon, you shall meet your doom at the hands of my giant green zombie fingers!"]);
        this.textControl.queueText(["Barbara", "Let's just get this over with..."]);

        this.parent.playMusic("audio/boss.wav");
    }
});

return MatsStage;

})();
