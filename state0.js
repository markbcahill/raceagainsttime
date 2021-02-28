var demo = {};
var centerX = 1500/2, centerY = 1000/2;
var Michael, vel = 400, scaleNum = .2, increment = 2;
var poro, poroGroup;
var map;
var Land;
//Jumping Variables
var jumpTimer = 0, jumpVelocity = 750, jumpDelay = 500;

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.tilemap('Runeterra', 'assets/tilemaps/FirstLevel.json', 
        null, Phaser.Tilemap.TILED_JSON);
        game.load.image('GroundTileSet' , 'assets/tilemaps/GroundTileSet.png');
        //game.load.image('Michael','assets/Sprites/Michael.png');
        game.load.spritesheet('Michael', 'assets/SpriteSheets/MichaelSpriteSheet.png', 320, 320);
        game.load.image('SR', 'assets/backgrounds/BandalCity.png');
        game.load.spritesheet('Poro', 'assets/SpriteSheets/PoroSpriteSheet.png', 320, 320);
    },
    create: function(){
        //Start scene
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#80ff80';
        addChangeStateEventLister();
        game.world.setBounds(0,0, 640, 640);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //var bg = game.add.sprite(0,0, 'SR');

        map = game.add.tilemap('Runeterra');
        map.addTilesetImage('GroundTileSet');

        Land = map.createLayer('Land');

        map.setCollisionBetween(1, 10, true, Land);

        //Create Michael
        Michael = game.add.sprite(centerX, centerY - 100, 'Michael');
        Michael.anchor.setTo(0.5,0.5);
        Michael.scale.setTo(.2,.2);
        game.physics.enable(Michael);
        Michael.body.gravity.y = 1500;
        //Michael.body.bounce.y = .3;
        Michael.body.drag.x = 600;
        Michael.body.collideWorldBounds = true;
        Michael.animations.add('walk', [0,1,2,3]);
        cursors = game.input.keyboard.createCursorKeys();
        // poro = game.add.sprite(750, 750, 'Poro');
        // poro.scale.setTo(.3,.3);
        // game.physics.enable(poro);

        //Create poros
        poroGroup = game.add.group();
        poroGroup.enableBody = true;
        poroGroup.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(poroGroup);

        //Place in world according to save state
        poroGroup.create(150, 200, 'Poro');
        poroGroup.create(325, 300, 'Poro');
        poroGroup.create(550, 400, 'Poro'); 

        //Animate Poros
        poroGroup.setAll('body.gravity.y', 500);
        poroGroup.setAll('body.bounce.y', .2);
        poroGroup.setAll('scale.x', .3);
        poroGroup.setAll('scale.y', .3);
        poroGroup.callAll('animations.add', 'animations', 'idel', [0,1,2,3,4,5,6,7,8,9]);
        poroGroup.callAll('play', null, 'idel', 6, true);

        //Set up camera
        game.camera.follow(Michael);
        game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 0, 600, 1000);

        //Set up score
        score = game.add.text(game.camera.x+200, game.camera.y+200, 'Poros:' + poros);
        score.fixedToCamera = true;
        score.cameraOffset.setTo(600,0);

        // //Create help text
        // helpText = game.add.text(game.camera.x+200, game.camera.y+200, '');
    },
    update: function(){
        game.physics.arcade.collide(Michael, Land, function(){touchingGround = true});
        game.physics.arcade.collide(poroGroup, Land, function(){});

        //Walk animiation
        if(cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown){
            Michael.animations.play('walk', 12, true);
            if(Michael.angle >= 15 || Michael.angle <= -15){
                increment = increment * -1;
            }
            Michael.angle = Michael.angle + increment;  
        }
        else{
            Michael.animations.stop('walk');
            Michael.frame = 0;
            Michael.angle = 0;
        }

        //Movement 
        if(cursors.up.isDown && Michael.body.onFloor() && game.time.now > jumpTimer){
            Michael.body.velocity.y = -jumpVelocity;
            jumpTimer = game.time.now + jumpDelay;
        }
        
        if(cursors.left.isDown){
            Michael.body.velocity.x = -vel;
            Michael.scale.setTo(-.2,.2);
            
        }
        else if(cursors.right.isDown){
            Michael.body.velocity.x = vel;
            Michael.scale.setTo(.2,.2);
        }
        else{
            Michael.body.velocity.x = 0;
        }

        // //Check to leave Area
        // if(Michael.x < 150 || Michael.x > 2600){
        //     this.leaveArea();
        // }
        // else{
        //     helpText.setText('')
        // }

        //Check for Poro Pick up
        game.physics.arcade.overlap(Michael, poroGroup, this.collectPoro);
    },
    collectPoro: function(M, p){
        poros += 1;
        p.kill();
        score.setText('Poros:' + poros);
        console.log(poroGroup.getIndex(p));
        poroArry[poroGroup.getIndex(p)] = 1;
    },
    // leaveArea: function(){
    //     helpText.x = Michael.x-100;
    //     helpText.y = Michael.y-200;
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