// Arrays and Objects
// Mitt Pham
// March 9
//
// Extra for Experts:
// Adding sound, collision between different shapes, using new functions (constrain and map)
// https://editor.p5js.org/c23fk/sketches/cpT9iZI5l - collision detection between a rectangle and a circle
// https://editor.p5js.org/P5FOS/sketches/Oqg5p6jDE - map()

// Ideas to add: 
// different difficulties
// remove overlapping blocks
// combo counter
// add screen shake and particles
// powerups?

// State variables
let canJump = false;
let starting = true;
let controls = false;
let playing = false;
let pickingColor = false;
let death = false;

// Character variables
let characterX;
let characterY;
let characterD = 25;
let characterDy = 0;
let characterDx = 2.5;
let characterColor = "white";
let gravity = 0.75;
let jumpStrength = -10;
let currentScore = 0;
let highScore = 0;

// Block variables
let blocks = [];
let blockSpeed = 2;
let speedIncrease = 0.03;

// Colors
let colors = ["red", "blue", "white", "purple"];

// Wall variables
let wallSpeed = 3;
let wallSize = 0;

// Sounds
let breakBlockSound;
let deathSound;
let startPlayingSound;
let switchColorSound;
let wallShakeSound;

// Set up sounds
function preload() {
  breakBlockSound = loadSound("pop.mp3");
  deathSound = loadSound("vineboom.mp3");
  startPlayingSound = loadSound("start.mp3");
  switchColorSound = loadSound("click.mp3");
  wallShakeSound = loadSound("guardian.mp3");
}

// Setting up screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize character position
  characterX = width / 2;
  characterY = height / 2;

  // Spawn blocks
  for (let i = 0; i < 100; i++) {
    let block = {
      x: random(width),
      y: random(-height, 0),
      w: 40,
      h: 20,
      color: random(colors),
    };
    blocks.push(block);
  }
}

// Activate the starting screen, controls, game over screen, and game
function draw() {
  background(50, 50, 50);

  if (starting) {
    startScreen();
  }
  else if (controls) {
    showControls();
  }
  else if (death) {
    gameOver();
  }
  else if (playing) {
    shakeWalls();
    moveCharacter();
    addGravity();
    checkJump();
    jump();
    characterSize();
    dropBlocks();
    addWalls();
    displayCharacter();
    checkCollision();
    changeColor();
    displayScore();
    displayColors();
  }
}

// Create start screen
function startScreen() {
  // Create the white boxes
  rectMode(CENTER);
  fill("white");
  rect(width / 2, height / 3, 300, 200, 20, 20, 20, 20);
  rect(width / 2, height * 2 / 3, 300, 200, 20, 20, 20, 20);

  // Create the text
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(32);
  text("Click here to start", width / 2, height / 3);
  textSize(30);
  text("Click here for controls", width / 2, height * 2 / 3);
}

// Show the controls for the game
function showControls() {

  // Create box
  rectMode(CENTER);
  fill("white");
  rect(width / 2, height / 2, 600, 400, 40, 40, 40, 40);

  // Create text
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(32);
  text(`Press A and D to move left and right
  Press Space or W to jump
  Hold S to enable color switching
  Press U for blue
  Press I for red
  Press O for purple
  Press P for white
  Press enter to start`, width / 2, height / 2);
}

// Make the game over screen
function gameOver() {
  textAlign(CENTER, CENTER);
  fill("white");
  textSize(40);
  text(`YA LOST
  Final Score: ${currentScore}
  High Score: ${highScore}
  Press enter to play again`, width / 2, height / 2);
}

// Shake the walls as they get closer to the center
function shakeWalls() {
  if (pickingColor) {
    // Create variables to determine how loud or shaky
    let shiftAmount = map(wallSize, width / 4, width / 2 - characterD / 2, 0, 10, true);
    let soundVolume = map(wallSize, width / 4, width / 2 - characterD / 2, 0.5, 1, true);

    // Apply variables to game
    translate(random(-shiftAmount, shiftAmount), random(-shiftAmount, shiftAmount));
    wallShakeSound.setVolume(soundVolume);
    if (!wallShakeSound.isPlaying() && wallSize >= width / 4) {
      wallShakeSound.play();
    }
  }

  // Prevent the sound from looping
  else {
    if (wallShakeSound.isPlaying()) {
      wallShakeSound.stop();
    }
  }
}

// Move character with A and D
function moveCharacter() {

  // Slow down character when in bullet time
  if (pickingColor) {
    characterDx = 1.25;
  }
  else {
    characterDx = 2.5;
  }
  
  // Move left
  if (keyIsDown(65)) {
    characterX -= characterDx;
  }

  // Move right
  if (keyIsDown(68)) {
    characterX += characterDx;
  }

  // Stop the player from going past the walls
  if (characterX < wallSize + characterD / 2) {
    characterX = wallSize + characterD / 2;
  }
  if (characterX > width - wallSize - characterD / 2) {
    characterX = width - wallSize - characterD / 2;
  }
}

// Add gravity to push player to the floor
function addGravity() {
  characterDy += gravity;
  characterY += characterDy;
  if (characterY >= height - characterD / 2) {
    characterY = height - characterD / 2;
    characterDy = 0;
  }
}

// Check if player is touching the floor to approve jump
function checkJump() {
  if (characterY >= height - characterD / 2) {
    canJump = true;
  }
  else {
    canJump = false;
  }
}

// Make character jump with space or W
function jump() {
  if ((keyIsDown(32) || keyIsDown(87)) && canJump) {
    characterDy = jumpStrength;
  }
}

// Increase the size of the character while in bullet time to prevent stalling
function characterSize() {
  if (pickingColor) {
    characterD += 0.2;
  }
  else {
    characterD = 25;
  }
}

// add falling blocks
function dropBlocks() {
  rectMode(CORNER);
  for (let i = 0; i < blocks.length; i ++) {
    let currentBlock = blocks[i];

    // Add gravity
    if (pickingColor) {
      currentBlock.y += blockSpeed * 0.1;
    }
    else {
      currentBlock.y += blockSpeed;
    }

    // Reset block to top of the screen
    if (currentBlock.y > height) {
      currentBlock.x = random(width);
      currentBlock.y = random(-100,0);
      currentBlock.color = random(colors);
    }

    // Display blocks
    fill(currentBlock.color);
    rect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
  }
}

// Add walls that move in when the player is choosing their color
function addWalls() {
  rectMode(CORNER);
  if (pickingColor) {
    wallSize += wallSpeed;
  }
  else {
    wallSize = 0;
  }
  fill("black");
  rect(0, 0, wallSize, height + 20);
  rect(width - wallSize, 0, wallSize, height + 20);

  // Kill player with the walls
  if (wallSize > width / 2 - characterD / 2) {
    deathSound.play();
    playing = false;
    death = true;
    wallShakeSound.stop();
  }
}

// Show character on screen
function displayCharacter() {
  fill(characterColor);
  circle(characterX, characterY, characterD);
}

// Checks if the character is touching any blocks and if they are the same color
function checkCollision() {
  for (let i = 0; i < blocks.length; i ++) {
    let currentBlock = blocks[i];

    // Determine which corner of the block is the closest to the character
    let nearestBlockX = constrain(characterX, currentBlock.x, currentBlock.x + currentBlock.w);
    let nearestBlockY = constrain(characterY, currentBlock.y, currentBlock.y + currentBlock.h);

    // Find the distance from the closest corner to the character
    let distance = dist(characterX, characterY, nearestBlockX, nearestBlockY);
    
    // Trigger events if colliding
    if (distance < characterD / 2) {

      // Trigger game over if wrong color
      if (currentBlock.color !== characterColor) {
        deathSound.play();
        playing = false;
        death = true;
      }

      // Trigger break sound, speed up blocks, increase score, and move block back to the top
      else {
        blockSpeed += speedIncrease;
        breakBlockSound.play();
        currentBlock.y = random(-100, 0); 
        currentBlock.x = random(width);
        currentBlock.color = random(colors);
        currentScore += 100;
        addBlocks();
      }
    }
  }
}

function reset() {
  // Reset states
  canJump = false;
  starting = true;
  playing = false;
  pickingColor = false;
  death = false;
  currentScore = 0;

  // Reset positions
  characterX = width / 2;
  characterY = height / 2;
  characterDy = 0;
  characterD = 25;
  characterColor = "white"; 

  // Reset blocks
  blockSpeed = 2;
  blocks = [];
  for (let i = 0; i < 100; i++) {
    let block = {
      x: random(width),
      y: random(-height, 0),
      w: 40,
      h: 20,
      color: random(colors),
    };
    blocks.push(block);
  }
}

// Begin choosing color and trigger bullet time as well as character size increase
function changeColor() {
  // Triggers with d
  if (keyIsDown(83)) {
    pickingColor = true;
  }
  else {
    pickingColor = false;
  }
}

// Display current and high score
function displayScore() {
  textAlign(LEFT, CENTER);
  fill("white");
  textSize(30);
  text(`Current score is ${currentScore}`, 50, 50);
  text(`High score is ${highScore}`, 50, 100);
  if (currentScore > highScore) {
    highScore = currentScore;
  }
}

// Display the colors according to the keys
function displayColors() {

  // Create the color boxes
  rectMode(CENTER);
  fill("blue");
  rect(width / 3, 50, 50, 50, 10, 10, 10 ,10);
  fill("red");
  rect(width / 3 + 100, 50, 50, 50, 10, 10, 10, 10);
  fill("purple");
  rect(width / 3 + 200, 50, 50, 50, 10, 10, 10, 10);
  fill("white");
  rect(width / 3 + 300, 50, 50, 50, 10, 10, 10, 10);

  // Add the keys
  textAlign(CENTER, CENTER);
  textSize(30);

  // U key
  if (keyIsDown(85)) {
    fill("white");
  }
  else {
    fill("black");
  }
  text("U", width / 3, 50);

  // I key
  if (keyIsDown(73)) {
    fill("white");
  }
  else {
    fill("black");
  }
  text("I", width / 3 + 100, 50);

  // O key
  if (keyIsDown(79)) {
    fill("white");
  }
  else {
    fill("black");
  }
  text("O", width / 3 + 200, 50);

  // P key
  if (keyIsDown(80)) {
    fill("gray");
  }
  else {
    fill("black");
  }
  text("P", width / 3 + 300, 50);
}

function addBlocks() {
  let block = {
    x: random(width),
    y: random(-height, 0),
    w: 40,
    h: 20,
    color: random(colors),
  };
  blocks.push(block);
}

// Controls certain key presses during game states
function keyPressed() {
  // Pick color based off of which key is pressed using u, i, o, and p
  if (pickingColor) {
    if (key === "u" || key === "U") {
      characterColor = "blue";
      switchColorSound.play();
    }
    else if (key === "i" || key === "I") {
      characterColor = "red";
      switchColorSound.play();
    }
    else if (key === "o" || key === "O") {
      characterColor = "purple";
      switchColorSound.play();
    }
    else if (key === "p" || key === "P") {
      characterColor = "white";
      switchColorSound.play();
    }
  }

  // Start game from controls with the enter key
  if (controls) {
    if (keyCode === 13) {
      controls = false;
      playing = true;
      startPlayingSound.play();
    }
  }

  // Restart game with enter
  else if (death) {
    if (keyCode === 13) {
      reset();
      starting = false;
      playing = true;
      startPlayingSound.play();
    }
  }
}

// Controls all the mouse click events
function mousePressed() {
  // Change game state to playing or controls depending on the button pressed
  if (starting) {
    if (mouseButton === LEFT && mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 3 - 100 && mouseY < height / 3 + 100) {
      starting = false;
      playing = true;
      startPlayingSound.play();
    }
    else if (mouseButton === LEFT && mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height * 2 / 3 - 100 && mouseY < height * 2 / 3 + 100) {
      starting = false;
      controls = true;
    }
  }
}