var GoatStage = (function(){

var playerSpawn = [700, 840];
//var playerSpawn = [700, 740];

var platforms = [
    // Floor and ceiling
    [0, 0, 1600],
    [0, 895, 1600],
    // Main floor
    [400, 840, 605],
    // Far left
    [0, 680, 80],
    [120, 600, 80],
    [0, 520, 80],
    [120, 440, 80],
    [0, 360, 80],
    [120, 280, 80],
    [0, 200, 80],
    [120, 120, 80],
    // Second
    [200, 840, 80],
    [320, 760, 80],
    [200, 680, 80],
    [320, 600, 80],
    [200, 520, 80],
    [320, 440, 80],
    [200, 360, 80],
    [320, 280, 80],
    [200, 200, 80],
    [320, 120, 80],
    // Third
    [520, 735, 80],
    [400, 680, 80],
    [520, 600, 80],
    [400, 520, 80],
    [520, 440, 80],
    [400, 360, 80],
    [520, 280, 80],
    [400, 200, 80],
    [520, 120, 80],
    // Fourth
    // Fifth
    [800, 735, 80],
    [920, 680, 80],
    [800, 600, 80],
    [920, 520, 80],
    [800, 440, 80],
    [920, 360, 80],
    [800, 280, 80],
    [920, 200, 80],
    [800, 120, 80],
    // Sixth
    [1120, 840, 80],
    [1000, 760, 80],
    [1120, 680, 80],
    [1000, 600, 80],
    [1120, 520, 80],
    [1000, 440, 80],
    [1120, 360, 80],
    [1000, 280, 80],
    [1120, 200, 80],
    [1000, 120, 80],
    // Right
    [1200, 760, 80],
    [1320, 680, 80],
    [1200, 600, 80],
    [1320, 520, 80],
    [1200, 440, 80],
    [1320, 360, 80],
    [1200, 280, 80],
    [1320, 200, 80],
    [1200, 120, 80],
    // Far right
    [1400, 800, 200],
];

var walls = [
    // Side walls
    [0, 0, 900],
    [1595, 0, 900],
    // Main walls
    [200, 120, 780],
    [400, 120, 720],
    [600, 120, 620],
    [800, 120, 620],
    [1000, 120, 720],
    [1200, 120, 780],
    [1400, 0, 800],
];

var enemies = [
    [410, 815, 50, [[570, 815], [410, 815]]],
    [980, 815, 50, [[830, 815], [980, 815]]],
    [560, 815, 50, [[570, 815], [410, 815]]],
    [850, 815, 50, [[830, 815], [980, 815]]],
];

var switches = [
    [100, 880, 600, 740, 100, false],
    [560, 720, 1400, 800, 100, true],
    [840, 720, 1430, 800, 100, true],
    [1550, 870, 800, 740, 100, false],
];

var breakableglass = [
    [0, 800, 200, "horizontal"],
];

var checkpoints = [
    //[420, 470],
    //[1080, 860],
];

var doors = [
    //[1560, 860, "test"],
];

var texts = [
    [600, 840, 200, 60, ["Barbara", "Wow, they've really got your goat under lock and key. It isn't going to be easy getting it out of there..."]],
    //[190, 400, 150, 100, ["Barbara", "Hmm, doesn't look like there's a way through here. Maybe try looking up further..."]],
    //[190, 240, 150, 100, ["Barbara", "I wonder if you can get to that switch by wall-jumping? Maybe that would help."]],
    //[0, 0, 100, 100, ["Barbara", "Press 'e' to flip the switch."]],
    //[330, 400, 150, 100, ["Barbara", "Good work! And you even got to a checkpoint. This should help in case we run into anything bad..."]],
    //[630, 380, 150, 120, ["Barbara", "Uh oh. Looks like there's some guards up ahead. It would be best to not be spotted. Good thing we have our trusty Guard-O-Vision, to help us know when they can see us."]],
    //[600, 780, 400, 120, ["Barbara", "Uhh, you did remember to flip the switch up there, to open this door, right?"]],
    //[1000, 780, 150, 120, ["Barbara", "Good work, we're almost at the door! Now if only we could break through this glass somehow..."]],
    //[1450, 600, 200, 140, ["Barbara", "Maybe if you try jumping at it from a really high hight, that would work."]],
    //[1150, 820, 150, 80, ["Barbara", "Yay! You made it! Now let's move on to the next room."]],
];

var thisStage = "goat";

var GoatStage = CGSGNode.extend({
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

        var spikes = [
        ];

        _.each(spikes, function(s) {
            var spike = new SpikesSprite(s[0], s[1], s[2]);

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

        this.goat = new GoatEntity(670, 815, this);
        this.environmentNode.addChild(this.goat);
    },

    update: function(time, keys) {
        _.each(this.breakableglass, function(b) {
            b.update(time, this.player);
        }, this);

        this.player.update(time, keys, this.platforms, this.walls);

        this.goat.update(time, this.player);

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

        this.textControl.update(time, keys);

        _.each(this.texts, function(t) {
            t.update(time, this.player);
        }, this);

        if (this.curie) {
            this.curie.update(time, this.player, this.platforms, this.walls);
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
        this.curie = new CurieEntity(this);
        this.enemiesNode.addChild(this.curie);

        var door = new DoorEntity(700, 860, "menu3", this);
        this.doors.push(door);
        this.environmentNode.addChild(door);

        this.textControl.queueText(["Barbara", "Oh no, it's zombie Marie Curie!"]);
        this.textControl.queueText(["Zombie Marie Curie", "You may have outsmarted Feynman, but you'll never get past me, villain!"]);
        this.textControl.queueText(["Zombie Marie Curie", "I may be slow, but I can still catch you!"]);
        this.textControl.queueText(["Barbara", "Quickly, get to the door before it's too late!"]);

        this.parent.playMusic("audio/boss.wav");
    }
});

return GoatStage;

})();
