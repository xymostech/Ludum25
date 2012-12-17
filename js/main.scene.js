var MainScene = (function(){

var scenes = {
    "menu1": Menu1Stage,
    "menu2": Menu2Stage,
    "menu3": Menu3Stage,
    "test": TestStage,
    "tutorial": TutorialStage,
    "feynman": FeynmanStage,
    "goat": GoatStage,
    "mats": MatsStage,
    "winner": WinnerStage,
};

var startStage = "menu1";

var MainScene = CGSGScene.extend({
    initialize: function(canvas) {
        this._super(canvas);

        this._setup();

        this.keys = {};
        for (var i = 0; i < 128; ++i) this.keys[i] = false;

        var that = this;
        $(document).keydown(function(event) { that.onKeyDownHandler(event); });
        $(document).keyup(function(event) { that.onKeyUpHandler(event); });

        this.lastTime = new Date();

        this.onRenderStart = this.onRenderStartHandler;

        this.startPlaying();
    },

    _setup: function() {
        this.rootNode = new CGSGNode(0, 0, 1, 1);
        this.sceneGraph.addNode(this.rootNode);

        this.sceneNode = new CGSGNode(0, 0, 1, 1);
        this.rootNode.addChild(this.sceneNode);

        this.currStage = new scenes[startStage](this);
        this.sceneNode.addChild(this.currStage);

        this.fadeNode = new CGSGNodeSquare(0, 0, 800, 600);
        this.fadeNode.globalAlpha = 0.0;
        this.fadeNode.color = "black";
        this.rootNode.addChild(this.fadeNode);

        this.changingScene = false;
        this.sceneFade = 0;
        this.nextScene = null;
        this.checkpoint = null;
    },

    onRenderStartHandler: function() {
        var currTime = new Date();
        var timePassed = (currTime - this.lastTime) / 1000;

        if (timePassed > 0.1) {
            timePassed = 0.1;
        }

        if (this.changingScene) {
            this.sceneFade -= timePassed;

            if (this.sceneFade < 0.5) {
                this.fadeNode.globalAlpha = (0.27 - Math.abs(this.sceneFade - 0.25)) / 0.27;

                if (this.sceneFade < 0) {
                    this.changingScene = false;
                }

                if (!this.doneSceneChange && this.sceneFade < 0.25) {
                    this.doneSceneChange = true;

                    var stage = scenes[this.nextScene];

                    this.sceneNode.removeChild(this.currStage);
                    this.currStage = new stage(this, this.checkpoint);
                    this.sceneNode.addChild(this.currStage);
                    this.checkpoint = null;

                    this.currStage.update(0.0001, this.keys);
                }
            }
        } else {
            this.fadeNode.globalAlpha = 0.0;

            this.currStage.update(timePassed, this.keys);
        }

        this.lastTime = currTime;
    },

    onKeyDownHandler: function(event) {
        this.keys[event.keyCode] = true;
    },

    onKeyUpHandler: function(event) {
        this.keys[event.keyCode] = false;
    },

    changeScene: function(scene, checkpoint) {
        this.nextScene = scene;
        this.checkpoint = checkpoint;
        this.changingScene = true;
        this.doneSceneChange = false;
        this.sceneFade = 1.0;
        this.stopMusic();
    },

    playMusic: function(clip) {
        if (!this.music) {
            this.music = new Audio(clip);
        } else {
            this.music.currentTime = 0;
        }
        this.music.play();
    },

    stopMusic: function() {
        if (this.music) {
            this.music.pause();
        }
    },
});

return MainScene;

})();
