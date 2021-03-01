var demo = {};
var centerX = 800/2, centerY = 800/2;
var Humphrey, vel = 400, humScale = .2, increment = 2;
var assistant, assistantGroup, assistScale = .2;
var map;
var Land, CurrentTime = 1, spacebar;
//Jumping Variables
var jumpTimer = 0, jumpVelocity = 250, jumpDelay = 500;

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.tilemap('LevelOne', 'assets/tilemaps/FirstLevel.json', 
        null, Phaser.Tilemap.TILED_JSON);
        game.load.image('GroundTileSet' , 'assets/tilemaps/GroundTileSet.png');
        game.load.spritesheet('Humphrey', 'assets/SpriteSheets/HumphreySpriteSheet.png', 350, 560);
        game.load.image('SR', 'assets/backgrounds/BandalCity.png');
        game.load.spritesheet('assistant', 'assets/SpriteSheets/AssistantsSpriteSheet.png', 350, 560);
    },
    create: function(){
        //Start scene
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#80ff80';
        addChangeStateEventLister();
        game.world.setBounds(0,0, 3200, 800);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        var bg = game.add.sprite(0,0, 'SR');

        map = game.add.tilemap('LevelOne');
        map.addTilesetImage('GroundTileSet');
        
        Land = map.createLayer('Land');
        Land.resizeWorld();

        Slopes = map.createLayer('Slopes');

        map.setCollisionBetween(1, 5, true, Land);

        //Create Humphrey
        Humphrey = game.add.sprite(centerX, centerY - 100, 'Humphrey');
        Humphrey.anchor.setTo(0.5,0.5);
        Humphrey.scale.setTo(humScale,humScale);
        game.physics.enable(Humphrey);
        Humphrey.body.gravity.y = 1500;
        //Humphrey.body.bounce.y = .3;
        Humphrey.body.drag.x = 600;
        Humphrey.body.collideWorldBounds = true;
        Humphrey.animations.add('walk', [0,1,2,3]);

        //Add input
        cursors = game.input.keyboard.createCursorKeys();
        spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spacebar.onDown.add(this.changeTime);

        //Create assistants
        assistantGroup = game.add.group();
        assistantGroup.enableBody = true;
        assistantGroup.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(assistantGroup);

        //Place in world according to save state
        assistantGroup.create(150, 200, 'assistant');
        assistantGroup.create(325, 300, 'assistant');
        assistantGroup.create(550, 400, 'assistant'); 

        //Animate assistants
        assistantGroup.setAll('body.gravity.y', 500);
        assistantGroup.setAll('body.bounce.y', .2);
        assistantGroup.setAll('scale.x', assistScale);
        assistantGroup.setAll('scale.y', assistScale);
        assistantGroup.callAll('animations.add', 'animations', 'idel', [0,1]);
        assistantGroup.callAll('play', null, 'idel', 10, true);

        //Set up camera
        game.camera.follow(Humphrey);
        //game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 0, 300, 300);

        //Set up score
        score = game.add.text(game.camera.x+200, game.camera.y+200, 'assistants:' + assistants);
        score.fixedToCamera = true;
        score.cameraOffset.setTo(600,0);

        // //Create help text
        // helpText = game.add.text(game.camera.x+200, game.camera.y+200, '');
    },
    update: function(){
        game.physics.arcade.collide(Humphrey, Land, function(){});
        game.physics.arcade.collide(assistantGroup, Land, function(){});
        //Humphrey.body.aabb.collideAABBVsTile(Slopes)

        //Walk animiation
        if(cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown){
            Humphrey.animations.play('walk', 10, true);
            // if(Humphrey.angle >= 15 || Humphrey.angle <= -15){
            //     increment = increment * -1;
            // }
            // Humphrey.angle = Humphrey.angle + increment;  
        }
        else{
            Humphrey.animations.stop('walk');
            Humphrey.frame = 0;
            // Humphrey.angle = 0;
        }

        //Movement 
        if(cursors.up.isDown && Humphrey.body.onFloor() && game.time.now > jumpTimer){
            Humphrey.body.velocity.y = -jumpVelocity;
            jumpTimer = game.time.now + jumpDelay;
        }
        
        if(cursors.left.isDown){
            Humphrey.body.velocity.x = -vel;
            Humphrey.scale.setTo(-humScale,humScale);
            
        }
        else if(cursors.right.isDown){
            Humphrey.body.velocity.x = vel;
            Humphrey.scale.setTo(humScale,humScale);
        }
        else{
            Humphrey.body.velocity.x = 0;
        }
        // //Check to leave Area
        // if(Humphrey.x < 150 || Humphrey.x > 2600){
        //     this.leaveArea();
        // }
        // else{
        //     helpText.setText('')
        // }

        //Check for assistant Pick up
        game.physics.arcade.overlap(Humphrey, assistantGroup, this.collectassistant);
    },
    collectassistant: function(M, p){
        assistants += 1;
        p.kill();
        score.setText('assistants:' + assistants);
        console.log(assistantGroup.getIndex(p));
    },
    changeTime: function(){
        console.log('spacebar');
        console.log(map.currentLayer);
        if(CurrentTime == 1){
            map.swap(1, 3);
            CurrentTime = 3;
        }
        else{
            map.swap(3,1);
            CurrentTime = 1;
        }
        
    }
    // leaveArea: function(){
    //     helpText.x = Humphrey.x-100;
    //     helpText.y = Humphrey.y-200;
    //     helpText.setText('Press E to exit');
    //     if(game.input.keyboard.isDown(Phaser.Keyboard.E)){
    //         changeState(null, 1);
    //         helpText.setText('');
    //     } 
    // }
};
function changeState(i, stateNum){
    console.log('State' + stateNum);
    game.state.start('state' + stateNum);

}

function addKeyCallback(key, fn, args){
    game.input.keyboard.addKey(key).onDown.add(fn, null, null, args);

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