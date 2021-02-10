var demo = {};
var centerX = 1500/2;
var centerY = 1000/2;
var speed = 10;
var Michael;
var scaleNum = 0;
var increment = 2;
demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        //game.load.image('Michael','assets/Sprites/Michael.png');
        game.load.spritesheet('Michael', 'assets/SpriteSheets/MichaelSpriteSheet.png', 320, 320);
        game.load.image('SR', 'assets/backgrounds/SummorsRift.png');
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);

        game.stage.backgroundColor = '#80ff80';

        addChangeStateEventLister();
        game.world.setBounds(0,0, 2813, 1000);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        var bg = game.add.sprite(0,0, 'SR');

        Michael = game.add.sprite(centerX, centerY, 'Michael');
        Michael.anchor.setTo(0.5,0.5);
        Michael.scale.setTo(.7,.7);
        game.physics.enable(Michael);
        Michael.body.collideWorldBounds = true;
        Michael.animations.add('walk', [0,1,2,3]);

        game.camera.follow(Michael);
        game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 0, 600, 1000);
    },
    update: function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            Michael.x -= speed;
            Michael.animations.play('walk', 12, true);
            if(Michael.angle >= 15 || Michael.angle <= -15){
                increment = increment * -1;
            }
            Michael.angle = Michael.angle + increment;
            Michael.scale.setTo(-.7,.7);
        }
        
        else if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            Michael.x += speed;
            Michael.animations.play('walk', 12, true);
            if(Michael.angle >= 15 || Michael.angle <= -15){
                increment *= -1;
            }
            Michael.angle = Michael.angle + increment;
            Michael.scale.setTo(.7,.7);
            
        }

        else if(game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            if(Michael.y >= 650){
                Michael.y -= speed;
                Michael.animations.play('walk', 12, true);
                if(Michael.angle >= 15 || Michael.angle <= -15){
                    increment *= -1;
                }
                Michael.angle = Michael.angle + increment;
            }    
            
        }
        else if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            Michael.y += speed;
            Michael.animations.play('walk', 12, true);
            if(Michael.angle >= 15 || Michael.angle <= -15){
                increment *= -1;
            }
            Michael.angle = Michael.angle + increment;
        }

        else{
            Michael.angle = 0;
            Michael.animations.stop('walk');
            Michael.frame = 0;
        }
    }
};

function changeState(i, stateNum){
    console.log('State' + stateNum);
    game.state.start('state' + stateNum)
}

function addKeyCallback(key, fn, args){
    game.input.keyboard.addKey(key).
        onDown.add(fn, null, null, args);

}

function addChangeStateEventLister(){
    addKeyCallback(Phaser.Keyboard.ZERO, changeState, 0);
    addKeyCallback(Phaser.Keyboard.ONE, changeState, 1);
    addKeyCallback(Phaser.Keyboard.TWO, changeState, 2);
    addKeyCallback(Phaser.Keyboard.THREE, changeState, 3);
    addKeyCallback(Phaser.Keyboard.FOUR, changeState, 4);
    addKeyCallback(Phaser.Keyboard.FIVE, changeState, 5);
    addKeyCallback(Phaser.Keyboard.SIX, changeState, 6);
    addKeyCallback(Phaser.Keyboard.SEVEN, changeState, 7);
    addKeyCallback(Phaser.Keyboard.EIGHT, changeState, 8);
    addKeyCallback(Phaser.Keyboard.NINE, changeState, 9);
}