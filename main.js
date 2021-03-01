var game = new Phaser.Game(800, 800, Phaser.AUTO);
var score;
var poros = 0;
game.state.add('state0', demo.state0);
game.state.start('state0')

