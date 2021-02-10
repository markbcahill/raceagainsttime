demo.state3 = function(){};
demo.state3.prototype = {
    preload: function(){},
    create: function(){
        game.stage.backgroundColor = '#40AA40';

        addChangeStateEventLister();
    },
    update: function(){}
};