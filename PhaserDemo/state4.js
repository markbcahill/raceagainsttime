demo.state4 = function(){};
demo.state4.prototype = {
    preload: function(){},
    create: function(){
        game.stage.backgroundColor = '#444444';

        addChangeStateEventLister();
    },
    update: function(){}
};