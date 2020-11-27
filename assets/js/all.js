"use strict";

var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {
  preload: preload,
  create: create,
  update: update
});
var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var lives = 3;
var livesText;
var lifeLostText;
var textStyle = {
  font: '18px Arial',
  fill: '#0095DD'
};
var playing = false;
var startButton;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = '#333';
  game.load.image('ball', 'assets/images/ball.png');
  game.load.image('paddle', 'assets/images/paddle.png');
  game.load.image('brick', 'assets/images/brick.png');
  game.load.spritesheet('ball', 'assets/images/wobble.png', 20, 20);
  game.load.spritesheet('button', 'assets/images/button.png', 120, 40);
}

function create() {
  // * 初始化Arcade Physics引擎
  game.physics.startSystem(Phaser.Physics.ARCADE); // * 定義ball, sprite(x, y, name-loaded-in-preload() )
  // ball = game.add.sprite(50, 50, 'ball');

  ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball'); // animations.add('動畫名稱', 每禎顯示的順序, 禎速率)

  ball.animations.add('wobble', [0, 1, 0, 2, 0, 1, 0, 2, 0], 24);
  paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
  paddle.anchor.set(0.5, 1);
  ball.anchor.set(0.5);
  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5); // * 啟用

  game.physics.enable(ball, Phaser.Physics.ARCADE);
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  game.physics.arcade.checkCollision.down = false; // * 設定邊界 => 球不會超過邊界

  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);
  paddle.body.immovable = true; // ball.body.velocity.set(150, -150);
  // 重力
  // ball.body.gravity.y = -500;

  ball.checkWorldBounds = true; // ball.events.onOutOfBounds.add(function(){
  //     alert('Game over!');
  //     location.reload();
  // }, this);

  ball.events.onOutOfBounds.add(ballLeaveScreen, this); // * text(x, y, content, {style_attr: value})

  scoreText = game.add.text(5, 5, 'Points: 0', textStyle);
  livesText = game.add.text(game.world.width - 5, 5, 'Lives: ' + lives, textStyle);
  livesText.anchor.set(1, 0);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, click to continue', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;
  initBricks();
}

function update() {
  game.physics.arcade.collide(ball, paddle, ballHitPaddle);
  game.physics.arcade.collide(ball, bricks, ballHitBrick);

  if (playing) {
    paddle.x = game.input.x || game.world.width * 0.5;
  } // ball.x += 1;
  // ball.y += 1;

}

function initBricks() {
  brickInfo = {
    width: 50,
    height: 20,
    count: {
      row: 7,
      col: 3
    },
    offset: {
      top: 50,
      left: 60
    },
    padding: 10
  };
  bricks = game.add.group();

  for (var c = 0; c < brickInfo.count.col; c++) {
    for (var r = 0; r < brickInfo.count.row; r++) {
      var brickX = r * (brickInfo.width + brickInfo.padding) + brickInfo.offset.left;
      var brickY = c * (brickInfo.height + brickInfo.padding) + brickInfo.offset.top;
      newBrick = game.add.sprite(brickX, brickY, 'brick');
      game.physics.enable(newBrick, Phaser.Physics.ARCADE);
      newBrick.body.immovable = true;
      newBrick.anchor.set(0.5);
      bricks.add(newBrick);
    }
  }
}

function ballHitBrick(ball, brick) {
  // brick.kill();
  game.add.tween(brick.scale).to({
    x: 0,
    y: 0
  }, 500, Phaser.Easing.Elastic.Out, true, 100); // var killTween = game.add.tween(brick.scale);
  // killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
  // killTween.onComplete.addOnce(function(){
  //     brick.kill();
  // }, this);
  // killTween.start();

  score += 10;
  scoreText.setText('Points: ' + score);
  var count_alive = 0;

  for (var i = 0; i < bricks.children.length; i++) {
    if (bricks.children[i].alive == true) {
      count_alive++;
    }
  }

  if (count_alive == 0) {
    alert('You won the game, congratulations!');
    location.reload();
  }
}

function ballLeaveScreen() {
  lives--;

  if (lives) {
    livesText.setText('Lives: ' + lives);
    lifeLostText.visible = true;
    ball.reset(game.world.width * 0.5, game.world.height - 25);
    paddle.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(function () {
      lifeLostText.visible = false;
      ball.body.velocity.set(150, -150);
    }, this);
  } else {
    alert('You lost, game over!');
    location.reload();
  }
}

function ballHitPaddle(ball, paddle) {
  ball.animations.play('wobble');
  ball.body.velocity.x = -1 * 5 * (paddle.x - ball.x);
}

function startGame() {
  startButton.destroy();
  ball.body.velocity.set(150, -150);
  playing = true;
}
//# sourceMappingURL=all.js.map
