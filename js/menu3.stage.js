var Menu3Stage = (function(){

var Menu3Stage = CGSGNode.extend({
    initialize: function(parent) {
        this._super(0, 0, 1, 1);

        this.parent = parent;

        this._setup();
    },

    _setup: function() {
        this.selection = 0;
        this.selections = [];

        this.list = new CGSGNode(70, 50, 1, 1);
        this.addChild(this.list);

        this.textControl = new TextManagerEntity();
        this.addChild(this.textControl);

        this.list.rotation.angle = -Math.PI / 30;

        this.page = new CGSGNodeSquare(50, 0, 500, 600);
        this.page.color = "white";
        this.list.addChild(this.page);

        for (var i = 60; i < 600; i += 25) {
            var line = new CGSGNodeLine(50, i, 550, i);
            line.strokeStyle = "lightblue";
            this.list.addChild(line);
        }

        var line = new CGSGNodeLine(130, 0, 130, 600);
        line.strokeStyle = "red";
        this.list.addChild(line);

        this.todo = new CGSGNodeText(240, 20, "Villain's TODO List");
        this.list.addChild(this.todo);

        this.instructions = new CGSGNodeText(240, 50, "(w/s to move, space to select)");
        this.instructions.setSize(11);
        this.list.addChild(this.instructions);

        this.plans = new CGSGNodeSquare(100, 100, 100, 100);
        this.plans.color = "#E67575";
        this.plans.lineWidth = 2;
        this.plans.strokeStyle = "black";
        this.list.addChild(this.plans);

        this.selections.push(this.plans);

        this.planstext = new CGSGNodeText(220, 130, "Steal Atomic Bomb Plans");
        this.list.addChild(this.planstext);

        this.goat = new CGSGNodeSquare(100, 250, 100, 100);
        this.goat.color = "#E67575";
        this.goat.lineWidth = 2;
        this.goat.strokeStyle = "black";
        this.list.addChild(this.goat);

        this.selections.push(this.goat);

        this.goattext = new CGSGNodeText(220, 280, "Rescue Pet Goat");
        this.list.addChild(this.goattext);

        this.mats = new CGSGNodeSquare(100, 400, 100, 100);
        this.mats.color = "white";
        this.mats.lineWidth = 2;
        this.mats.strokeStyle = "black";
        this.list.addChild(this.mats);

        this.selections.push(this.mats);

        this.matstext = new CGSGNodeText(220, 430, "Acquire Bomb Materials");
        this.list.addChild(this.matstext);

        this.selection = 2;
        this.select(2);

        this.keyPressed = true;
    },

    update: function(time, keys) {
        //_.each(keys, function(v, s) { if (v) console.log(s); });
        if (this.keyPressed && !keys[87] && !keys[83] && !keys[32]) {
            this.keyPressed = false;
        }

        if (!this.keyPressed) {
            if (keys[87]) {
                if (this.selection > 2) {
                    this.select(this.selection - 1);
                }
                this.keyPressed = true;
            } else if(keys[83]) {
                if (this.selection < 2) {
                    this.select(this.selection + 1);
                }
                this.keyPressed = true;
            } else if(keys[32]) {
                this.choose();
            }
        }

        this.textControl.update(time);
    },

    select: function(selection) {
        this.selections[this.selection].color = "white";
        this.selection = selection;
        this.selections[this.selection].color = "lightblue";
    },

    choose: function() {
        if (this.selection === 0) {
            this.selections[this.selection].color = "#E67575";
            this.parent.changeScene("tutorial");
        } else if (this.selection === 1) {
            this.selections[this.selection].color = "#E67575";
            this.parent.changeScene("goat");
        } else if (this.selection === 2) {
            this.selections[this.selection].color = "#E67575";
            this.parent.changeScene("mats");
        }
    },
});

return Menu3Stage;

})();
