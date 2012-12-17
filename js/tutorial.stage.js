var TutorialStage = (function(){

var playerSpawn = [30, 840];

var platforms = [
    // Floor and ceiling
    [0, 0, 1600],
    [0, 895, 1600],
    // First stage
    [190, 820, 150],
    [0, 740, 150],
    [190, 660, 150],
    [0, 580, 150],
    [190, 500, 580],
    [0, 420, 150],
    [190, 340, 150],
    [0, 100, 200],
    //Second Stage
    [850, 100, 150],
    [660, 250, 150],
    [0, 100, 200],
    [700, 580, 300],
    [600, 660, 300],
    [700, 740, 300],
    // Third stage
    [1250, 820, 350],
    [1000, 650, 150],
    [1000, 650, 150],
    [1450, 740, 150],
    [1250, 660, 150],
    [1450, 580, 150],
    [1250, 500, 150],
    [1450, 420, 150],
    [1250, 340, 150],
];

var walls = [
    // Side walls
    [0, 0, 900],
    [1595, 0, 900],
    // First stage
    [340, 500, 400],
    [340, 0, 380],
    // Second stage
    [600, 500, 400],
    [1000, 0, 800],
    [660, 0, 250],
    // Third stage
    [1150, 820, 80],
    [1150, 0, 655],
    [1250, 340, 320],
];

var enemies = [
    [700, 555, 50, [[980, 555], [700, 555]]],
    [970, 715, 50, [[980, 715], [700, 715]]],
];

var switches = [
    [20, 80, 340, 380, 120, true],
    [980, 80, 1000, 800, 100, true],
];

var breakableglass = [
    [1155, 820, 95, "horizontal"],
];

var checkpoints = [
    [420, 470],
    [1080, 860],
];

var doors = [
    [1560, 860, "feynman"],
];

var texts = [
    [80, 740, 200, 160, ["Barbara", "Hello, there! I'm your trusty companion, Barbara. Looks like today is just going to be a normal old nab-the-plans-and go. Let's start by getting up these stairs. Jump by pressing 'w'."]],
    [190, 400, 150, 100, ["Barbara", "Hmm, doesn't look like there's a way through here. Maybe try looking up further..."]],
    [190, 240, 150, 100, ["Barbara", "I wonder if you can get to that switch by wall-jumping? Maybe that would help."]],
    [0, 0, 100, 100, ["Barbara", "Press 'e' to flip the switch."]],
    [330, 400, 150, 100, ["Barbara", "Good work! And you even got to a checkpoint. This should help in case we run into anything bad..."]],
    [630, 380, 150, 120, ["Barbara", "Uh oh. Looks like there's some guards up ahead. It would be best to not be spotted. Good thing we have our trusty Guard-O-Vision, to help us know when they can see us."]],
    [600, 780, 400, 120, ["Barbara", "Uhh, you did remember to flip the switch up there, to open this door, right?"]],
    [1000, 780, 150, 120, ["Barbara", "Good work, we're almost at the door! Now if only we could break through this glass somehow..."]],
    [1450, 600, 200, 140, ["Barbara", "Maybe if you try jumping at it from a really high hight, that would work."]],
    [1150, 820, 150, 80, ["Barbara", "Yay! You made it! Now let's move on to the next room."]],
];

var thisStage = "tutorial";

var TutorialStage = CGSGNode.extend({
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

        _.each(this.doors, function(d) {
            d.update(time, this.player);
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
});

return TutorialStage;

})();
