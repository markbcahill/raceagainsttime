var demo = {};
var centerX = 800/2, centerY = 800/2;
var Humphrey, vel = 400, humScale = .2, increment = 2;
var assistant, assistantGroup, assistScale = .2;
var map;
var bg;
//Timer Variables
var LevelTime = 5, sec = 0, mil = 0, start = false;
var Land, Winter, Summer, CurrentTimeFrame = 1, spacebar, pauseBtn, pauseText;
//Jumping Variables
var jumpTimer = 0, jumpVelocity = 900, jumpDelay = 500;

var drawbridge, drawbridgeDown, nextShift = 0, shiftRate=1000;
var sound;

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.tilemap('LevelOne', 'assets/tilemaps/FirstLevel.json', 
        null, Phaser.Tilemap.TILED_JSON);
        game.load.image('GroundTileSet' , 'assets/tilemaps/GroundTileSet.png');
        game.load.image('treeTiles', 'assets/tilemaps/treeTiles.png');
        //game.load.image('winterTreeTiles', 'assets/tilemaps/winterTreeTiles.png');
        game.load.image('stall', 'assets/tilemaps/stall2.png');
        game.load.image('ice', 'assets/tilemaps/ice.png');
        game.load.image('WaterAnimated', 'assets/tilemaps/WaterAnimated.png');
        game.load.spritesheet('Humphrey', 'assets/SpriteSheets/HumphreySpriteSheet.png', 350, 560);
        game.load.image('SummerBg', 'assets/backgrounds/SummerBackground.png');
        game.load.image('WinterBg', 'assets/backgrounds/WinterBackground.png');
        game.load.spritesheet('assistant', 'assets/SpriteSheets/AssistantsSpriteSheet.png', 350, 560);
        game.load.spritesheet('lever', 'assets/SpriteSheets/lever.png', 240, 165);
        game.load.image('drawbridgeUp', 'assets/Sprites/drawbridgeUp.png',25,213);
        game.load.image('drawbridgeDown', 'assets/Sprites/drawbridgeDown.png',213,25);
        game.load.image('WinterTree', 'assets/tilemaps/winterTreeTiles.png', 288, 288);
        
        game.load.audio('ding','assets/sounds/ding.mp3');
    },
    create: function(){
        //Start scene
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#80ff80';
        addChangeStateEventLister();
        game.world.setBounds(0,0, 3200, 800);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        bg = game.add.sprite(0,0);
        bg.loadTexture('WinterBg');
        bg.loadTexture('SummerBg');
        
        //sound
        sound = game.add.audio('ding');

        map = game.add.tilemap('LevelOne');
        map.addTilesetImage('GroundTileSet');
        map.addTilesetImage('treeTiles');
        //map.addTilesetImage('winterTreeTiles')
        map.addTilesetImage('stall');
        map.addTilesetImage('ice');
        map.addTilesetImage('WaterAnimated');
        
        Winter = map.createLayer('Winter'); 
        Winter.kill();
        
        WinterTree = game.add.sprite(1140, 565, 'WinterTree');
        WinterTree.visible = false
        WinterTree.anchor.setTo(0.5,0.5);
        WinterTree.scale.setTo(1.0);
        WinterTree.enableBody = true;
        WinterTree.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(WinterTree);
        WinterTree.body.immovable = true;
        WinterTree.body.setSize(168, 190, 50, 25);
        
        
        Summer = map.createLayer('Summer');
        Land = map.createLayer('Base');
        Land.resizeWorld();

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
        pauseBtn = game.input.keyboard.addKey(Phaser.Keyboard.P);
        pauseBtn.onDown.add(this.pauseGame);
        game.input.onDown.add(unpause, self);

        //Create assistants
        assistantGroup = game.add.group();
        assistantGroup.enableBody = true;
        assistantGroup.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(assistantGroup);
    
        //Add drawbridge/lever
        drawbridge = game.add.sprite(2290, 300, 'drawbridgeUp');
        drawbridge.anchor.setTo(0.5,0.5);
        drawbridge.scale.setTo(1.6,1.6);
        drawbridge.enableBody = true;
        drawbridge.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(drawbridge);
        drawbridge.body.immovable = true;
        
        lever = game.add.sprite(1625, 195, 'lever');
        lever.anchor.setTo(0.5,0.5);
        lever.scale.setTo(0.4,0.4);
        lever.enableBody = true;
        lever.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(lever);

        //Place in world according to save state
        assistantGroup.create(150, 500, 'assistant');
        //assistantGroup.create(325, 300, 'assistant');
        assistantGroup.create(550, 500, 'assistant'); 
        assistantGroup.create(1000, 500, 'assistant');
        assistantGroup.create(1400, 100, 'assistant');
        assistantGroup.create(2400, 100, 'assistant');

        //Animate assistants
        assistantGroup.setAll('body.gravity.y', 500);
        assistantGroup.setAll('body.bounce.y', .2);
        assistantGroup.setAll('scale.x', assistScale);
        assistantGroup.setAll('scale.y', assistScale);
        assistantGroup.callAll('animations.add', 'animations', 'idel', [0,1]);
        assistantGroup.callAll('play', null, 'idel', 10, true);

        //Animating lever
        lever.animations.add('shift', [0,1,2]);
    
        //Set collisions between Humprey and tilemap
        //stall
        map.setCollisionBetween(100, 108, true, 'Summer');
        //ice
        map.setCollisionBetween(96, 98, true, 'Winter');
        //tree
        //map.setCollisionBetween(94,96, true, 'Winter');
        //map.forEach(function(tile) {  if (tile.index === 94 || tile.index === 95 || tile.index === 96 || tile.index === 97) {    tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);


        //Set up camera
        game.camera.follow(Humphrey);
        //game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 0, 300, 300);

        //Set up timer
        timer = game.add.text(game.camera.x+100, game.camera.y+200, LevelTime + ":" + sec + ":" + mil);
        timer.fixedToCamera = true;
        timer.cameraOffset.setTo(50,0);

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
        game.physics.arcade.collide(Humphrey, drawbridge, function(){});
        game.physics.arcade.collide(Humphrey, drawbridgeDown, function(){});
        game.physics.arcade.collide(Humphrey, Winter, function(){});
        game.physics.arcade.collide(Humphrey, WinterTree, function(){});
        game.physics.arcade.collide(Humphrey, Summer, function(){});
        game.physics.arcade.overlap(Humphrey, lever, this.hitLever);
        //Humphrey.body.aabb.collideAABBVsTile(Slopes)

        if(assistants >= 5){
            start = false;
        }

        //Game timer
        if(start == true){
            if(LevelTime == 0){
                start == false;
            }
            if(sec == 0){
                LevelTime -= 1;
                sec = 60;
            }
            if(mil == 0){
                sec -= 1;
                mil = 60;
            }
            mil -= 1;
            timer.setText(LevelTime + ":" + sec + ":" + mil);
        }
        //Walk animiation
        if(cursors.up.isDown || cursors.down.isDown || cursors.left.isDown || cursors.right.isDown){
            Humphrey.animations.play('walk', 10, true);
            start = true;
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
        sound.play();
        
    },
    changeTime: function(){
        console.log('spacebar');
        console.log(map.currentLayer);
        if(CurrentTimeFrame == 1){
            map.swap(1, 3);
            CurrentTimeFrame = 3;
            Summer.kill();
            Winter.revive();
            bg.loadTexture("WinterBg");
            WinterTree.visible = true;
        }
        else{
            map.swap(3,1);
            CurrentTimeFrame = 1;
            Winter.kill();
            Summer.revive();
            bg.loadTexture("SummerBg");
            WinterTree.visible = false;
        }
        
    },
    hitLever: function(h, l) {
        
        if (game.time.now > nextShift) {
            nextShift = game.time.now + shiftRate;
            
            if (lever.frame == 0) {
                lever.animations.play('shift', 6, true);
                lever.animations.stop('shift');
                drawbridge.visible =false;
                lever.frame = 2;
    
                drawbridgeDown = game.add.sprite(2140, 460, 'drawbridgeDown');
                drawbridgeDown.anchor.setTo(0.5,0.5);
                drawbridgeDown.scale.setTo(1.6,1.6);
                drawbridgeDown.enableBody = true;
                drawbridgeDown.physicsBodyType = Phaser.Physics.ARCADE;
                game.physics.enable(drawbridgeDown);
                drawbridgeDown.body.immovable = true;
            }
            else if (lever.frame == 2) {
                lever.animations.play('shift', 6, true);
                lever.animations.stop('shift');
                lever.frame = 0;
                drawbridge.frame = 0;
                drawbridgeDown.visible = false;
                drawbridge.visible =true;
            };
            
        }
        
    },
    pauseGame: function(){
        
        if(game.paused == false){
            console.log('pause');
            game.paused = true;
            pauseText = game.add.text(game.camera.x+400, game.camera.y+400, 'Paused');
        }
        else if(game.paused == true){
            game.paused = false;
            pauseText.setText('');
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

function unpause(event){
    // Only act if paused
    game.paused = false;
    
};

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