demo.state5 = function(){};
demo.state5.prototype = {
    preload: function(){},
    create: function(){
        game.stage.backgroundColor = '#555555';
    
        addChangeStateEventLister();
    },
    update: function(){}
};