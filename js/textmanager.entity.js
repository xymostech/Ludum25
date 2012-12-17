var TextManagerEntity = (function(){

var TextManagerEntity = CGSGNode.extend({
    initialize: function() {
        this._super(0, 0, 1, 1);

        this.text = null;
        this.queue = [];
    },

    setText: function(text) {
        if (this.text) {
            this.removeChild(this.text);
        }

        this.text = new PopupTextEntity(text);
        this.addChild(this.text);
    },

    queueText: function(text) {
        this.queue.push(text);
    },

    update: function(time, keys) {
        if (this.text) {
            this.text.update(keys[32] ? time * 4 : time);

            if (this.text.done()) {
                this.removeChild(this.text);
                this.text = null;

                if (this.queue.length > 0) {
                    var text = this.queue.shift();

                    this.setText(text);
                }
            }
        } else if(this.queue.length > 0) {
            var text = this.queue.shift();

            this.setText(text);
        }
    },

    stop: function() {
        this.removeChild(this.text);
        this.text = null;
    },

    done: function() {
        return this.text == null && this.queue.length === 0;
    },
});

return TextManagerEntity;

})();
