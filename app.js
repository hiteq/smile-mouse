//game balance
let GRAVITY = 0.6;
let JUMP = 10;
let speed = 2;
let box_rate = 10;
// let box_rate = 1;
let box_weight = 0.4;
let box_speed = [2, 3.5, 5];
let rotate_angle = [180];
let position_y = [40, 60, 120];

//usage
let player;
let block;
let box_0, box_1, box_2, box_3;
let bg1, bg2, bg3;
let heart;

function preload() {
  // sprite boxes,player
  box_0 = loadImage("assets/box_a_1.png");
  box_1 = loadImage("assets/box_g_1.png");
  box_2 = loadImage("assets/box_g9_1.png");
  box_3 = loadImage("assets/box_smile_1.png");

  // sprite heart
  heart = loadImage("assets/heart.png");

  // sprite platform
  bg1 = loadImage("assets/bg1.png");
  bg2 = loadImage("assets/bg2.png");
  bg3 = loadImage("assets/bg3.png");
}

function setup() {
  //canvas draw at dom
  let canvas_w = windowWidth;
  if (canvas_w > 640) {
    canvas_w = 640;
  }
  let canvas = createCanvas(canvas_w, 208);
  canvas.parent("gameframe");

  // grouping
  blocks = new Group();
  boxes = new Group();
  platforms = new Group();
  hearts = new Group();

  // platform draw first
  ground = createSprite(0, 244, 1280);
  ground.shapeColor = color(255, 255, 255);
  ground.immovable = true;

  let platform_count = width / 102 + 2;
  for (let i = 0; i < platform_count; i++) {
    platform = createSprite(i * 102, 200, 102, 12);
    let rand_land = random([0, 1, 2]);
    if (rand_land == 0) {
      platform.addImage("normal", bg1);
    } else if (rand_land == 1) {
      platform.addImage("normal", bg2);
    } else {
      platform.addImage("normal", bg3);
    }
    platform.immovable = true;
    platforms.add(platform);
  }

  // player
  player = createSprite(72, 0);
  player.addAnimation(
    "walk",
    "assets/smile_walk1.png",
    "assets/smile_walk4.png"
  );
  player.addAnimation(
    "jump",
    "assets/smile_jump1.png",
    "assets/smile_jump7.png"
  );
}

function draw() {
  // background
  background(256);

  // bounces
  // blocks.bounce(blocks);
  blocks.bounce(ground);

  let random_add = 0;
  // box
  if (frameCount % box_rate == 0) {
    random_add = random([0, 1, 2, 3]);

    if (random_add <= 1) {
      // draw new box
      let block_position_y = random(position_y);
      block = createSprite(640 + 102, block_position_y);

      // select skin of box
      let rand_box = random([0, 1, 2, 3]);
      if (rand_box == 0) {
        block.addImage("normal", box_0);
      } else if (rand_box == 1) {
        block.addImage("normal", box_1);
      } else if (rand_box == 2) {
        block.addImage("normal", box_2);
      } else {
        block.addImage("normal", box_3);
      }

      block.chase = false;
      block.life = 300;
      block.addSpeed(random(box_speed), random(rotate_angle));
      blocks.add(block);
    }
  }

  for (let i = 0; i < blocks.length; i++) {
    //touch to eat
    if (blocks[i].chase == true) {
      blocks[i].velocity.x =
        (player.position.x - (blocks[i].position.x - 5)) * 0.03;
      blocks[i].velocity.y =
        (player.position.y - (blocks[i].position.y - 4)) * 0.03;
      // blocks[i].rotateToDirection = true;
      blocks[i].scale += -0.05;
    } else {
      // blocks[i].velocity.x = -box_speed;
      blocks[i].velocity.y += GRAVITY * box_weight;
    }

    //collide player
    if (blocks[i].overlap(player)) {
      blocks[i].chase = true;
      if (blocks[i].life > 20) {
        blocks[i].life = 20;  
      }
    }
  }

  // platforms reset
  for (let i = 0; i < platforms.length; i++) {
    platforms[i].velocity.x = -speed;

    if (platforms[i].position.x < -102) {
      platforms[i].position.x = width + 102;
    }
  }

  // player landing
  if (player.collide(ground)) {
    player.velocity.y = 0;
    player.changeAnimation("walk");
  }

  // heart add
  if (player.overlap(blocks)) {
    let heart_count = round(random(0,.52));
    for (let i = 0; i < heart_count; i++) {
      heart_shape = createSprite(
        player.position.x + round(random(-32, 32)),
        player.position.y + round(random(-16, -48))
      );
      heart_shape.addImage("normal", heart);
      heart_shape.scale = random([1.5, 2, 3]);
      heart_shape.life = heart_shape.scale * 20;
      hearts.add(heart_shape);
    }
  }

  //heart die
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].velocity.y += -GRAVITY * 0.03;
    hearts[i].scale += -0.05;
  }

  // gravity to player
  player.velocity.y += GRAVITY;

  drawSprites();
}

// player jump
function mousePressed() {
  let player_state = player.getAnimationLabel();
  player.position.x = 72;
  if (player_state == "walk") {
    player.animation.rewind();
    player.changeAnimation("jump");
    player.velocity.y = -JUMP;
  }
}
