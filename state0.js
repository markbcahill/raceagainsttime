var demo = {};
var centerX = 800/2, centerY = 800/2;
var Humphrey, vel = 400, humScale = .2, increment = 2, playerDead;
var assistant, assistantGroup, assistScale = .2;
var map;
var bg;
//Timer Variables
var startingTime = 5;
var LevelTime, sec, mil, runTimer = false;
var Land, Winter, Summer, CurrentTimeFrame = 1, spacebar, pauseBtn, pauseText, killBtn, endText;
//Jumping Variables
var jumpTimer = 0, jumpVelocity = 900, jumpDelay = 500;
var drawbridgeDown, nextShift = 0, shiftRate=1000;
var sound, music;

demo.state0 = function(){};
demo.state0.prototype = {
    preload: function(){
        game.load.tilemap('LevelOne', 'assets/tilemaps/FirstLevel.json', 
        null, Phaser.Tilemap.TILED_JSON);
        game.load.image('GroundTileSet' , 'assets/tilemaps/GroundTileSet.png');
        game.load.image('treeTiles', 'assets/tilemaps/treeTiles.png');
        //game.load.image('winterTreeTiles', 'assets/tilemaps/winterTreeTiles.png');
        game.load.image('stallTiles', 'assets/tilemaps/stallTiles.png');
        game.load.image('ice', 'assets/tilemaps/ice.png');
        game.load.image('WaterAnimated', 'assets/tilemaps/WaterAnimated.png');
        game.load.spritesheet('Humphrey', 'assets/SpriteSheets/HumphreySpriteSheet.png', 350, 560);
        game.load.image('SummerBg', 'assets/backgrounds/SummerBackground.png');
        game.load.image('WinterBg', 'assets/backgrounds/WinterBackground.png');
        game.load.spritesheet('assistant', 'assets/SpriteSheets/AssistantsSpriteSheet.png', 350, 560);
        game.load.spritesheet('lever', 'assets/SpriteSheets/lever.png', 240, 165);
        //game.load.image('drawbridgeUp', 'assets/Sprites/drawbridgeUp.png',25,213);
        game.load.image('drawbridgeDown', 'assets/Sprites/drawbridgeDown.png',213,25);
        game.load.image('winterTreeTiles', 'assets/tilemaps/winterTreeTiles.png', 288, 288);
        //game.load.image('SpawnTiles', 'assets/tilemaps/SpawnTiles.png', 32, 32);
        
        game.load.audio('ding','assets/sounds/ding.mp3');
        game.load.audio('music', 'assets/sounds/music.mp3');
        
    },
    create: function(){
        //Start scene
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#80ff80';
        addChangeStateEventLister();
        //game.world.setBounds(0,0, 3520, 1280);
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        bg = game.add.sprite(0,0);
        bg.loadTexture('WinterBg');
        bg.loadTexture('SummerBg');
        assistants = 0;
        LevelTime = startingTime;
        sec = 0;
        mil = 0; 
        runTimer = false;

        //sound
        sound = game.add.audio('ding');
        music = game.add.audio('music');
        music.play();

        map = game.add.tilemap('LevelOne');
        map.addTilesetImage('GroundTileSet');
        map.addTilesetImage('treeTiles');
        map.addTilesetImage('winterTreeTiles')
        map.addTilesetImage('stallTiles');
        map.addTilesetImage('ice');
        map.addTilesetImage('WaterAnimated');
        //map.addTilesetImage('SpawnTiles');

        //SpawnTiles = map.createLayer('SpawnTiles');
        //SpawnTiles.kill();

        Winter = map.createLayer('Winter'); 
        Winter.kill();
        // WinterTree = game.add.sprite(1140, 565, 'WinterTree');
        // WinterTree.visible = false
        // WinterTree.anchor.setTo(0.5,0.5);
        // WinterTree.scale.setTo(1.0);
        // WinterTree.enableBody = true;
        // WinterTree.physicsBodyType = Phaser.Physics.ARCADE;
        // game.physics.enable(WinterTree);
        // WinterTree.body.immovable = true;
        // WinterTree.body.setSize(168, 190, 50, 25);
        
        
        Summer = map.createLayer('Summer');
        Land = map.createLayer('Base');
        Land.resizeWorld();

        map.setCollisionBetween(1, 5, true, Land);

        //Create Humphrey
        var tempObject = map.objects.SpawnLocation[0];
        Humphrey = game.add.sprite(tempObject.x, tempObject.y, tempObject.properties[0].value);
        Humphrey.anchor.setTo(0.5,0.5);
        Humphrey.scale.setTo(humScale,humScale);
        game.physics.enable(Humphrey);
        Humphrey.body.gravity.y = 1500;
        playerDead = false;
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
        killBtn = game.input.keyboard.addKey(Phaser.Keyboard.K);
        killBtn.onDown.add(this.killPlayer);

        //Create assistants
        assistantGroup = game.add.group();
        assistantGroup.enableBody = true;
        assistantGroup.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(assistantGroup);
    
        //Add drawbridge/lever
        /*drawbridge = game.add.sprite(2500, 270, 'drawbridgeUp');
        drawbridge.anchor.setTo(0.5,0.5);
        drawbridge.scale.setTo(2,);
        drawbridge.enableBody = true;
        drawbridge.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(drawbridge);
        drawbridge.body.immovable = true;*/
        
        lever = game.add.sprite(2070, 100, 'lever');
        lever.anchor.setTo(0.5,0.5);
        lever.scale.setTo(0.4,0.4);
        lever.enableBody = true;
        lever.physicsBodyType = Phaser.Physics.ARCADE;
        game.physics.enable(lever);



        //Place in world according to save state
        map.createFromObjects('SpawnLocation', 'AssistantSpawn', 'assistant', 0, true,false, assistantGroup);

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
        map.setCollisionBetween(15,18, true, 'Winter');
        //tree
        map.setCollisionBetween(27, 28, true, 'Winter');
        map.setCollisionBetween(33, 34, true, 'Winter');
        map.setCollisionBetween(39, 41, true, 'Winter');
        map.setCollisionBetween(54, 56, true, 'Winter');
        map.setCollisionBetween(83, 84, true, 'Winter');
        map.setCollisionBetween(87, 88, true, 'Winter');
        
        map.forEach(function(tile) {if (tile.index === 27 || tile.index === 28) {
                tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);
        map.forEach(function(tile) {if (tile.index === 33 || tile.index === 34) {
                tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);
        map.forEach(function(tile) {if (tile.index === 39 || tile.index === 40 || tile.index === 41) {
                tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);
        map.forEach(function(tile) {if (tile.index === 54 || tile.index === 55 || tile.index === 56) {
                tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);
        map.forEach(function(tile) {if (tile.index === 83 || tile.index === 84) {
                tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);
        map.forEach(function(tile) {if (tile.index === 87 || tile.index === 88) {
                tile.collideDown = false;  }}, this, 0, 0, map.width, map.height, Winter);
        
        //stall
        map.setCollisionBetween(264,266, true, 'Summer');


        //Set up camera
        game.camera.follow(Humphrey);
        game.camera.deadzone = new Phaser.Rectangle(centerX, 0, 0, 640);

        //Set up timer
        timer = game.add.text(game.camera.x+100, game.camera.y+200, LevelTime + ":" + sec + ":" + mil);
        timer.fixedToCamera = true;
        timer.cameraOffset.setTo(50,0);

        //Set up score
        score = game.add.text(game.camera.x+200, game.camera.y+200, 'assistants:' + assistants);
        score.fixedToCamera = true;
        score.cameraOffset.setTo(600,0);

        endText = game.add.text(game.camera.x+400, game.camera.y+400, " ");
        endText.fixedToCamera = true;
        endText.anchor.setTo(0.5, 0.5);
        // //Create help text
        // helpText = game.add.text(game.camera.x+200, game.camera.y+200, '');
    },
    update: function(){
        game.physics.arcade.collide(Humphrey, Land, function(){});
        game.physics.arcade.collide(assistantGroup, Land, function(){});
        //game.physics.arcade.collide(Humphrey, drawbridge, function(){});
        game.physics.arcade.collide(Humphrey, drawbridgeDown, function(){});
        game.physics.arcade.collide(Humphrey, Winter, function(){});
        //game.physics.arcade.collide(Humphrey, WinterTree, function(){});
        game.physics.arcade.collide(Humphrey, Summer, function(){});
        game.physics.arcade.overlap(Humphrey, lever, this.hitLever);
        //Humphrey.body.aabb.collideAABBVsTile(Slopes)
        if(Humphrey.body.y >=800){
            //game.camera.unfollow();
        }
        else{
            game.camera.follow(Humphrey);
            game.camera.deadzone = new Phaser.Rectangle(centerX, 0, 0, 640);
        }
        
        if(Humphrey.body.y >=960){
            game.camera.unfollow();
            this.killPlayer();
            music.stop();
        }

        if(playerDead == true){
            music.stop()
            if (spacebar.isDown){
                game.paused = false;
                game.state.start('state0');  
            }
        }
        else{
            if(assistants >= 5){
                runTimer = false;
                music.stop();
                endText.setText('Score: '+assistants+'\nCongratulations!\nYou collected all the assistants!\nPress SPACE to restart');                
                if (spacebar.isDown){
                    game.state.start('state0');
                }
            }

            //Game timer
            if(runTimer == true){
                if(LevelTime == 0){
                    runTimer == false;
                    this.killPlayer();
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
                runTimer = true;
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
        }
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
            console.log('winter');
            map.swap(1, 3);
            CurrentTimeFrame = 3;
            Summer.kill();
            Winter.revive();
            bg.loadTexture("WinterBg");
            //WinterTree.visible = true;
        }
        else{
            console.log('summer');
            map.swap(3,1);
            CurrentTimeFrame = 1;
            Winter.kill();
            Summer.revive();
            bg.loadTexture("SummerBg");
            //WinterTree.visible = false;
        }
        
    },
    hitLever: function(h, l) {
        
        if (game.time.now > nextShift) {
            nextShift = game.time.now + shiftRate;
            
            if (lever.frame == 0) {
                lever.animations.play('shift', 6, true);
                lever.animations.stop('shift');
                //drawbridge.visible =false;
                lever.frame = 2;
    
                drawbridgeDown = game.add.sprite(2780, 340, 'drawbridgeDown');
                drawbridgeDown.anchor.setTo(0.5,0.5);
                drawbridgeDown.scale.setTo(1,1);
                drawbridgeDown.enableBody = true;
                drawbridgeDown.physicsBodyType = Phaser.Physics.ARCADE;
                game.physics.enable(drawbridgeDown);
                drawbridgeDown.body.immovable = true;
            }
            else if (lever.frame == 2) {
                lever.animations.play('shift', 6, true);
                lever.animations.stop('shift');
                lever.frame = 0;
                //drawbridge.frame = 0;
                drawbridgeDown.visible = false;
                //drawbridge.visible =true;
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
    },
    killPlayer: function(){
        music.stop();
        game.add.tween(Humphrey).to({y: Humphrey.y - 800}, 10000, 'Linear', true);
        Humphrey.angle = 90;
        gameOverText = game.add.text(centerX / 2 , centerY / 2, 'Score: '+assistants+'\nGAME OVER\nPress SPACE to restart',{ font: '22px Lucida Console', fill: '#fff', align: 'center'});    
        gameOverText.anchor.setTo(0.5, 0.5);  
        gameOverText.fixedToCamera = true;
        assistants = 0;    
        playerDead = true;
        runTimer = false;

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