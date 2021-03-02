demo.GameOver = function(){};
var label;
demo.GameOver.prototype = {  
    create: function() {    
        this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);    
        label = game.add.text(centerX / 2 , centerY / 2, 'Score: '+assistants+'\nGAME OVER\nPress SPACE to restart',{ font: '22px Lucida Console', fill: '#fff', align: 'center'});    
        label.anchor.setTo(0.5, 0.5);  
    },  
    update: function() {    score = 0;    
            if (this.spacebar.isDown)      game.state.start('state0');  
        }
    };