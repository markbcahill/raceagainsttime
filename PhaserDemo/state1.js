demo.state1 = function(){};

var cursors, vel = 500, water, rocks;

demo.state1.prototype = {
    preload: function(){
        game.load.tilemap('Runeterra', 'assets/tilemaps/testmap.json', 
        null, Phaser.Tilemap.TILED_JSON);
        game.load.image('Grass' , 'assets/tilemaps/Grass.png');
        game.load.image('Water', 'assets/tilemaps/Water.png');
        game.load.image('IceTileSet' , 'assets/tilemaps/IceTileSet.png');
        game.load.image('MichaelSprite', 'assets/Sprites/Michael.png')
        
    },
    create: function(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(0,0, 3200, 3200);
        game.stage.backgroundColor = '#DDDDDD';
        addChangeStateEventLister();

        var map = game.add.tilemap('Runeterra');
        map.addTilesetImage('Grass');
        map.addTilesetImage('Water');
        map.addTilesetImage('IceTileSet');

        var grass = map.createLayer('Tile Layer 1');
        

        Michael = game.add.sprite(200, 200, 'MichaelSprite');
        Michael.scale.setTo(.2,.2);
        game.physics.enable(Michael);
        Michael.body.collideWorldBounds = true;
        cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(Michael);
        game.camera.deadzone = new Phaser.Rectangle(centerX - 300, 300, 600, 400);
    },
    update: function(){
        if(cursors.up.isDown){
            Michael.body.velocity.y = -vel;
        }
        else if(cursors.down.isDown){
            Michael.body.velocity.y = vel;
        }
        else{
            Michael.body.velocity.y = 0;
        }
        if(cursors.left.isDown){
            Michael.body.velocity.x = -vel;
        }
        else if(cursors.right.isDown){
            Michael.body.velocity.x = vel;
        }
        else{
            Michael.body.velocity.x = 0;
        }
    }
};