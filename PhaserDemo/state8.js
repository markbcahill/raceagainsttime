demo.state8 = function(){};
demo.state8.prototype = {
    preload: function(){},
    create: function(){
        game.stage.backgroundColor = '#888888';

        addChangeStateEventLister();
    },
    update: function(){}
};