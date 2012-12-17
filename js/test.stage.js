var TestStage = (function(){

var playerSpawn = [200, 200];

var platforms = [
    [50, 140, 150],
    //[0, 595, 1600],
    //[101, 520, 99],
    //[200, 440, 100],
    //[300, 360, 100],
    //[400, 280, 300],
    //[300, 200, 100],
    //[0, 60, 100],
];

var walls = [
    //[0, 0, 600],
    //[1595, 0, 600],
    //[100, 420, 105],
    //[500, 0, 200],
];

var enemies = [
    [100, 115, 50, [[175, 115], [50, 115]]]
];

var switches = [
    //[15, 40, 500, 200, 80, true],
];

var breakableglass = [
    //[100, 300, 80, "vertical"],
    [100, 295, 150, "horizontal"],
];

var checkpoints = [
    [200, 200],
];

var TestStage = CGSGNode.extend({
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
        this.height = 600;

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
    },

    update: function(time, keys) {
        _.each(this.breakableglass, function(b) {
            b.update(time, this.player);
        }, this);

        this.player.update(time, keys, this.platforms, this.walls);

        _.each(this.enemies, function(e) {
            e.update(time, this.player, this.platforms, this.walls);

            if (e.canSee(this.player.position.x + this.player.width / 2, this.player.position.y + this.player.height / 2, this.platforms, this.walls)) {
                this.parent.changeScene("test", this.checkpoint);
            }
        }, this);

        _.each(this.switches, function(s) {
            s.update(time, keys, this.player);
        }, this);

        _.each(this.checkpoints, function(c) {
            c.update(time, this.player);
        }, this);
    },

    setOffset: function(x, y) {
        this.stageNode.position.x = x;
        this.stageNode.position.y = y;
    },
});

return TestStage;

})();
