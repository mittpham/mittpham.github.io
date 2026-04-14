// 2D Array Grid Game
// Mitt Pham
// March 20 2026
// 
// Extra for Experts:
// Trying out functions: lerp(), tint(), millis(), Math functions
// Incorporating a timer, delays, animation, sound, images, state machine, and progression systems (combo and stars)
// Match 3 game mechanics (chain matches, match 4+, invalid matches)

// https://p5js.org/examples/imported-media-image-transparency/ - image opacity
// https://editor.p5js.org/MarcoGaLo/sketches/2WSdSF7nx - candy crush reference
// https://editor.p5js.org/clement.zheng/sketches/t66CpvG7V - lerp()

// Ideas to add:
// animation for wrong match
// Automatically find matches and give player hints
// Objective gem, can't be matched, win when it falls to the bottom
// Walls, frozen gems, other types

// Issues to fix:
// adjust the delays, sometimes the game feels clunky and slow
// bombs are retriggering themselves
// Points feed opacity

// Game state variables
let waiting = false;
let dropping = false;
let matching = false;
let gameOver = false;
let gameWon = false;
let starting = true;

// Timer variables and constants
const MATCHING_GEMS_DELAY = 500;
const DROPPING_GEMS_DELAY = 200;
const TEMPORARY_POINTS_DELAY = 500;
const SHUFFLE_GRID_TIME = 20000;

let gameStateTimer = 0;
let temporaryPointsTimer = 0;

// Grid variables
const CELL_SIZE = 80;
const ROWS = 8;
const COLUMNS = 8;
const HALF_OPACITY = 127;
const FULL_OPACITY = 255;
const EMPTY_CELL = -1;
const UNHIGHLIGHTED_CELL = 1;
const HIGHLIGHTED_CELL = 4;
const OFFSCREEN = -100;
const BORDER_X = 320;

let gemGrid;
let shakeAmount = 0;

// Gems variables and constants
const BLUE_GEM = 0;
const GREEN_GEM = 1;
const ORANGE_GEM = 2;
const PURPLE_GEM = 3;
const RED_GEM = 4;

let gemTypes = [BLUE_GEM, GREEN_GEM, ORANGE_GEM, PURPLE_GEM, RED_GEM];
let matchingGems = [];
let bombFound = false;
let blueGemImage;
let greenGemImage;
let orangeGemImage;
let purpleGemImage;
let redGemImage;

// Track the player clicks and any matches
let currentGem = null;
let gemMatches = false;

// Shuffle prompt constants and variables
const SHUFFLE_PROMPT_X = 700;
const SHUFFLE_PROMPT_Y = 200;
const SHUFFLE_PROMPT_TEXT_SIZE = 30;

let promptShowing = false;
let promptShown = false;

// Progress bar constants
const PROGRESS_BAR_X = 900;
const PROGRESS_BAR_Y = 20;
const PROGRESS_BAR_W = 25;
const PROGRESS_BAR_H = 600;
const PROGRESS_TEXT_SIZE = 20;
const STARS_X = 890;
const PROGRESS_MARGIN = 20;

let progress = 0;

// Start screen constants
const START_SCREEN_X = 1400;
const START_SCREEN_Y = 300;
const START_SCREEN_TEXT_SIZE = 30;

// Constants and variables for points, stars, combos, and hearts
const POINTS_TEXT_SIZE = 25;
const POINTS_MARGIN = 10;
const COMBO_TEXT_SIZE = 25;
const HEARTS_X = 640;
const HEARTS_Y = 560;

let points = 0;
let currentPoints = 0;
let temporaryPoints = 0;
let stars = 0;
let combo = 0;
let hearts = 3;
let heartImage;

// Game timer constants and variables
const GAME_TIMER = 120000;
const TIMER_TEXT_SIZE = 25;
const TIMER_MARGIN = 10;

let remainingTime;

// Game over constants
const GAME_OVER_SCREEN_X = 800;
const GAME_OVER_SCREEN_Y = 400;
const GAME_OVER_TEXT_SIZE = 40;

let gameTimer = 0;

// Sounds
let dropSound;
let swapSound;
let invalidSwapSound;
let blingSound;
let winSound;
let loseSound;
let comboSoundOne;
let comboSoundTwo;
let comboSoundThree;
let comboSoundFour;
let comboSoundFive;
let bombSoundOne;
let bombSoundTwo;
let bombSoundThree;
let bombSoundFour;
let bombSoundFive;

// Load gem images and sounds
function preload() {

  // Images
  blueGemImage = loadImage("assets/bluegem.png");
  greenGemImage = loadImage("assets/greengem.png");
  orangeGemImage = loadImage("assets/orangegem.png");
  purpleGemImage = loadImage("assets/purplegem.png");
  redGemImage = loadImage("assets/redgem.png");
  heartImage = loadImage("assets/heart.png");

  // Sounds
  dropSound = loadSound("assets/drop.mp3");
  swapSound = loadSound("assets/switch.mp3");
  invalidSwapSound = loadSound("assets/invalidswap.mp3");
  blingSound = loadSound("assets/bling.mp3");
  winSound = loadSound("assets/win.mp3");
  loseSound = loadSound("assets/lose.mp3");
  comboSoundOne = loadSound("assets/1combo.mp3");
  comboSoundTwo = loadSound("assets/2combo.mp3");
  comboSoundThree = loadSound("assets/3combo.mp3");
  comboSoundFour = loadSound("assets/4combo.mp3");
  comboSoundFive = loadSound("assets/5combo.mp3");
  bombSoundOne = loadSound("assets/1explosion.mp3");
  bombSoundTwo = loadSound("assets/2explosion.mp3");
  bombSoundThree = loadSound("assets/3explosion.mp3");
  bombSoundFour = loadSound("assets/4explosion.mp3");
  bombSoundFive = loadSound("assets/5explosion.mp3");
}

// Set up grid and remove any initial matches
function setup() {
  createCanvas(ROWS * CELL_SIZE + BORDER_X, COLUMNS * CELL_SIZE);
  gemGrid = generateGrid(ROWS, COLUMNS);

  // Generate boards until there are no matches
  let initialMatches = checkMatches();
  while (initialMatches) {
    gemGrid = generateGrid(ROWS, COLUMNS);
    initialMatches = checkMatches();
  }

  // Clear states, reset matches, reset points, start game timer
  gameWon = false;
  gameOver = false;
  dropping = false;
  matching = false;
  waiting = true;
  matchingGems = [];
  points = 0;
  temporaryPoints = 0;
  stars = 0;
  combo = 0;
}

// Show grid
function draw() {

  // Start screen
  if (starting) {
    displayStartScreen();
  }
  else {
    // Display everything
    background("black");
    shakeScreen();
    displayGrid();
    displayPoints();
    displayTimer();
    displayCombo();
    displayProgress();
    displayHearts();
    displayTemporaryPoints();

    // Control game states
    if (matching) {
      removeMatches();
    }
    else if (dropping) {
      dropGems();
    }
    else if (waiting) {
      shuffleGrid();
    }
    else if (gameOver) {
      displayGameOver();
    }
    else if (gameWon) {
      displayGameWon();
    }
  }
}

// Remove matches after they are highlighted
function removeMatches() {
  if (millis() > MATCHING_GEMS_DELAY + gameStateTimer) {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLUMNS; x++) {
        if (matchingGems[y][x] === true) {

          // Check for bomb to play sound
          if (gemGrid[y][x].bomb) {
            bombFound = true;
          }
          gemGrid[y][x] = EMPTY_CELL;
        }
      }
    }

    // Increase combo counter
    combo++;

    // Prevent overlapping sounds
    comboSoundOne.stop();
    comboSoundTwo.stop();
    comboSoundThree.stop();
    comboSoundFour.stop();
    comboSoundFive.stop();
    bombSoundOne.stop();
    bombSoundTwo.stop();
    bombSoundThree.stop();
    bombSoundFour.stop();
    bombSoundFive.stop();

    // Play the correct bomb sound
    if (bombFound) {
      if (combo === 1) {
        bombSoundOne.play();
      }
      else if (combo === 2) {
        bombSoundTwo.play();
      }
      else if (combo === 3) {
        bombSoundThree.play();
      }
      else if (combo === 4) {
        bombSoundFour.play();
      }
      else if (combo >= 5) {
        bombSoundFive.play();
      }
      bombFound = false;
    }

    // Play the correct combo sound
    else if (!bombFound) {
      if (combo === 1) {
        comboSoundOne.play();
      }
      else if (combo === 2) {
        comboSoundTwo.play();
      }
      else if (combo === 3) {
        comboSoundThree.play();
      }
      else if (combo === 4) {
        comboSoundFour.play();
      }
      else if (combo >= 5) {
        comboSoundFive.play();
      }
    }

    // Determine shake amount
    shakeAmount = combo;
    if (combo > 5) {
      shakeAmount = 5;
    }

    // Reset timer and matches, trigger the dropping
    matchingGems = [];
    matching = false;
    waiting = false;
    dropping = true;
    gameStateTimer = millis();
  }
}

// Drop all gems until there is only empty cells at the top
function dropGems() {
  if (millis() > DROPPING_GEMS_DELAY + gameStateTimer) {

    // If gems did move then reset the timer
    if (dropOneGem()) {
      gameStateTimer = millis();

      // Play drop sound
      dropSound.play();
    }
    // If they didn't move then refill the gems, check for new matches, and reset states
    else {
      refillGems();
      checkMatches();
      dropping = false;
      waiting = true;

      // Separate timer to fade opacity of points feed
      temporaryPointsTimer = millis();

      // Reset combo
      if (!checkMatches()) {
        combo = 0;
      }
    }
  }
}

// Drop one gem down
function dropOneGem() {
  let movingGems = false;

  // Check all cells and find an empty cell, look above the empty cell for a gem and swap them
  for (let x = 0; x < COLUMNS; x++) {
    for (let y = ROWS - 1; y > 0; y--) {
      if (gemGrid[y][x] === EMPTY_CELL && gemGrid[y - 1][x] !== EMPTY_CELL) {
        gemGrid[y][x] = gemGrid[y - 1][x];
        gemGrid[y - 1][x] = EMPTY_CELL;
        movingGems = true;
      }
    }
  }

  return movingGems;
}

// Check for matches and activate highlighting and removing process if matches
function checkMatches() {
  let newGemGrid = matchGems();

  // begin highlighting the matches
  if (gemMatches) {
    matchingGems = newGemGrid;
    matching = true;
    dropping = false;
    waiting = false;
    gameStateTimer = millis();
    return true;
  }
  // swap back
  else {
    return false;
  }
}

// Generate a random grid array
function generateGrid(ROWS, COLUMNS) {
  let gemGrid = [];

  for (let y = 0; y < ROWS; y++) {
    gemGrid.push([]);
    for (let x = 0; x < COLUMNS; x++) {

      let gems = {
        motionX: x * CELL_SIZE,
        motionY: y * CELL_SIZE,
        type: random(gemTypes),
        bomb: random(1, 100) <= 5
      };

      gemGrid[y].push(gems);
    }
  }
  return gemGrid;
}

// Shake the screen when you match
function shakeScreen() {

  // Shift screen based off how big your combo is
  let shiftAmount = map(shakeAmount, 0, 5, 0, 15, true);
  translate(random(-shiftAmount, shiftAmount), random(-shiftAmount, shiftAmount));

  shakeAmount = 0;
}

// Display rules
function displayStartScreen() {
  fill("white");
  rectMode(CENTER);
  rect(width / 2, height / 2, START_SCREEN_X, START_SCREEN_Y);
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(START_SCREEN_TEXT_SIZE);
  noStroke();
  text(`GET AS MANY POINTS AS YOU CAN IN 2 MINUTES
  YOU NEED AT LEAST 40K POINTS TO WIN
  BUT YOU WILL RECEIVE STARS FOR POINTS OVER 40K
  BUILD YOUR COMBO FOR QUICK POINTS
  MATCH THE BOMB GEMS FOR BIG CLEARS

  CLICK TO START`, width / 2, height / 2);
}

// Display the generated array
function displayGrid() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {

      // Highlight current gem or matching gems
      let currentX = Math.floor(mouseX / CELL_SIZE);
      let currentY = Math.floor(mouseY / CELL_SIZE);
      if (currentX === x && currentY === y || matchingGems.length > 0 && matchingGems[y][x]) {
        strokeWeight(HIGHLIGHTED_CELL);
        stroke("white");
      }
      else {
        strokeWeight(UNHIGHLIGHTED_CELL);
        stroke("black");
      }
      fill(50);
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Reduce opacity of current gem if clicked
      if (currentGem !== null && currentGem.x === x && currentGem.y === y) {
        tint(255, HALF_OPACITY);
      }
      else {
        noTint();
      }

      // Mark bombs
      if (gemGrid[y][x].bomb) {
        fill("black");
        square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
      }

      // Load image for each gem
      if (gemGrid[y][x] !== EMPTY_CELL) {

        // Move the gems with lerp
        gemGrid[y][x].motionX = lerp(gemGrid[y][x].motionX, x * CELL_SIZE, 0.2);
        gemGrid[y][x].motionY = lerp(gemGrid[y][x].motionY, y * CELL_SIZE, 0.2);

        if (gemGrid[y][x].type === BLUE_GEM) {
          image(blueGemImage, gemGrid[y][x].motionX, gemGrid[y][x].motionY, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x].type === GREEN_GEM) {
          image(greenGemImage, gemGrid[y][x].motionX, gemGrid[y][x].motionY, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x].type === ORANGE_GEM) {
          image(orangeGemImage, gemGrid[y][x].motionX, gemGrid[y][x].motionY, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x].type === PURPLE_GEM) {
          image(purpleGemImage, gemGrid[y][x].motionX, gemGrid[y][x].motionY, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x].type === RED_GEM) {
          image(redGemImage, gemGrid[y][x].motionX, gemGrid[y][x].motionY, CELL_SIZE, CELL_SIZE);
        }
        else {
          square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }
}

// Display how the player's points on the right side of the screen
function displayPoints() {
  textAlign(LEFT, CENTER);
  fill("white");
  textSize(POINTS_TEXT_SIZE);
  noStroke();
  text(`Points: ${points}`, ROWS * CELL_SIZE + POINTS_MARGIN, CELL_SIZE);
}

// Display how many consecutive matches the player has gotten
function displayCombo() {
  textAlign(LEFT, CENTER);
  fill("white");
  textSize(COMBO_TEXT_SIZE);
  noStroke();
  text(`${combo} COMBO`, ROWS * CELL_SIZE + POINTS_MARGIN, CELL_SIZE * 3);
}

// Display how close the player is to winning or getting stars
function displayProgress() {
  fill("white");
  rect(PROGRESS_BAR_X, PROGRESS_BAR_Y, PROGRESS_BAR_W, PROGRESS_BAR_H);
  let progress = map(points, 0, 100000, 0, PROGRESS_BAR_H);
  fill("red");
  rect(PROGRESS_BAR_X, height - PROGRESS_BAR_Y, PROGRESS_BAR_W, -progress);

  let zeroStarsY = height - map(40000, 0, 100000, 0, PROGRESS_BAR_H) - PROGRESS_MARGIN;
  let oneStarsY = height - map(50000, 0, 100000, 0, PROGRESS_BAR_H) - PROGRESS_MARGIN;
  let twoStarsY = height - map(60000, 0, 100000, 0, PROGRESS_BAR_H) - PROGRESS_MARGIN;
  let threeStarsY = height - map(70000, 0, 100000, 0, PROGRESS_BAR_H) - PROGRESS_MARGIN;
  let fourStarsY = height - map(100000, 0, 100000, 0, PROGRESS_BAR_H) - PROGRESS_MARGIN;

  // Show the benchmarks
  textAlign(RIGHT, CENTER);
  fill("white");
  textSize(PROGRESS_TEXT_SIZE);
  noStroke();
  text(`☆ 40K`, STARS_X, zeroStarsY);
  text(`★ 50K`, STARS_X, oneStarsY);
  text(`★★ 60K`, STARS_X, twoStarsY);
  text(`★★★ 70K`, STARS_X, threeStarsY);
  text(`★★★★ 100K`, STARS_X, fourStarsY);

  // Add lines to the progress bar
  stroke("black");
  line(PROGRESS_BAR_X, zeroStarsY, PROGRESS_BAR_X + PROGRESS_BAR_W, zeroStarsY);
  line(PROGRESS_BAR_X, oneStarsY, PROGRESS_BAR_X + PROGRESS_BAR_W, oneStarsY);
  line(PROGRESS_BAR_X, twoStarsY, PROGRESS_BAR_X + PROGRESS_BAR_W, twoStarsY);
  line(PROGRESS_BAR_X, threeStarsY, PROGRESS_BAR_X + PROGRESS_BAR_W, threeStarsY);
}

// Display the players hearts
function displayHearts() {
  noTint();
  for (let i = 0; i < hearts; i++) {
    image(heartImage, HEARTS_X + 80 * i, HEARTS_Y, CELL_SIZE, CELL_SIZE);
  }
}

// Display the points gained every match
function displayTemporaryPoints() {

  // Change the opacity during the delay
  let opacity = map(millis() - temporaryPointsTimer, 0, TEMPORARY_POINTS_DELAY, FULL_OPACITY, 0);

  // Prevent negative opacity
  if (opacity < 0) {
    opacity = 0;
  }

  // Draw out temporary points
  if (temporaryPoints > 0) {
    textAlign(LEFT, CENTER);
    textSize(POINTS_TEXT_SIZE);
    fill(255, 255, 255, opacity);
    noStroke();
    text(`+${temporaryPoints}`, ROWS * CELL_SIZE + POINTS_MARGIN, CELL_SIZE * 2);
  }
}

// Display how much time has passed
function displayTimer() {

  // Calculate remaining time if the game is running
  if (!gameOver && !gameWon) {
    remainingTime = Math.round((GAME_TIMER - (millis() - gameTimer)) / 1000);
    if (remainingTime < 0) {
      remainingTime = 0;
    }
  }

  // Draw the timer
  textAlign(LEFT, CENTER);
  fill("white");
  textSize(POINTS_TEXT_SIZE);
  noStroke();
  text(`Time: ${remainingTime}`, ROWS * CELL_SIZE + TIMER_MARGIN, CELL_SIZE * 4);

  // Check if player has lost or won
  gameEndTrigger();
}

// Display game over
function displayGameOver() {
  fill("white");
  rectMode(CENTER);
  rect(width / 2, height / 2, GAME_OVER_SCREEN_X, GAME_OVER_SCREEN_Y);
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(GAME_OVER_TEXT_SIZE);
  noStroke();
  text(`GAME OVER
  YOU LOSE
  CLICK TO PLAY AGAIN`, width / 2, height / 2);
}

// Display game won
function displayGameWon() {
  fill("white");
  rectMode(CENTER);
  rect(width / 2, height / 2, GAME_OVER_SCREEN_X, GAME_OVER_SCREEN_Y);
  rectMode(CORNER);
  textAlign(CENTER, CENTER);
  fill("black");
  textSize(GAME_OVER_TEXT_SIZE);
  noStroke();
  text(`GAME WON
  YOU SCORED ${points}
  ${stars} STARS
  CLICK TO PLAY AGAIN`, width / 2, height / 2);
}

// Trigger if time runs out
function gameEndTrigger() {

  // Make sure that this function triggers once when the game ends
  if (!gameWon && !gameOver) {

    // Trigger if game over
    if (remainingTime === 0 && points < 40000) {
      gameOver = true;
      waiting = false;
      dropping = false;
      matching = false;

      // Play lose sound
      loseSound.play();
    }

    // Trigger if game won
    else if (remainingTime === 0 && points >= 40000) {
      gameWon = true;
      waiting = false;
      dropping = false;
      matching = false;

      // Play win sound
      winSound.play();

      // Calculate stars
      if (points >= 100000) {
        stars = 4;
      }
      else if (points >= 70000) {
        stars = 3;
      }
      else if (points >= 60000) {
        stars = 2;
      }
      else if (points >= 50000) {
        stars = 1;
      }
      else {
        stars = 0;
      }
    }

    // End game if no hearts
    else if (hearts === 0) {
      invalidSwapSound.stop();
      gameOver = true;
      waiting = false;
      dropping = false;
      matching = false;

      // Play lose sound
      loseSound.play();
    }
  }
}

// Check if there are three matching gems
function matchGems() {

  // Create a new empty array
  let matchGrid = [];
  gemMatches = false;
  temporaryPoints = 0;

  for (let y = 0; y < ROWS; y++) {
    matchGrid.push([]);
    for (let x = 0; x < COLUMNS; x++) {
      matchGrid[y].push(false);
    }
  }

  // Check every cell
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {

      // Save the type of the current gem
      let gemType = gemGrid[y][x].type;

      // Check for horizontal matches
      if (x - 1 >= 0 && x + 1 < COLUMNS) {
        if (gemGrid[y][x - 1].type === gemType && gemGrid[y][x + 1].type === gemType) {

          // Check for bomb
          if (gemGrid[y][x].bomb || gemGrid[y][x - 1].bomb || gemGrid[y][x + 1].bomb) {
            for (let i = 0; i < COLUMNS; i++) {
              matchGrid[y][i] = true;

              // Chain bomb reaction
              if (gemGrid[y][i].bomb && i !== x && i !== x - 1 && i !== x + 1) {
                for (let j = 0; j < ROWS; j++) {
                  matchGrid[j][i] = true;
                  points += 800 * (combo + 1);
                  temporaryPoints += 800 * (combo + 1);
                }
              }
            }
            gemMatches = true;
            points += 800 * (combo + 1);
            temporaryPoints += 800 * (combo + 1);
          }
          // Check for normal matches
          else {
            matchGrid[y][x] = true;
            matchGrid[y][x - 1] = true;
            matchGrid[y][x + 1] = true;
            gemMatches = true;
            points += 100 * (combo + 1);
            temporaryPoints += 100 * (combo + 1);
          }
        }
      }

      // Check for vertical matches
      if (y - 1 >= 0 && y + 1 < ROWS) {
        if (gemGrid[y - 1][x].type === gemType && gemGrid[y + 1][x].type === gemType) {

          // Check for bomb
          if (gemGrid[y][x].bomb || gemGrid[y - 1][x].bomb || gemGrid[y + 1][x].bomb) {
            for (let i = 0; i < ROWS; i++) {
              matchGrid[i][x] = true;

              // Chain bomb reaction
              if (gemGrid[i][x].bomb && i !== y && i !== y - 1 && i !== y + 1) {
                for (let j = 0; j < COLUMNS; j++) {
                  matchGrid[i][j] = true;
                  points += 800 * (combo + 1);
                  temporaryPoints += 800 * (combo + 1);
                }
              }
            }
            gemMatches = true;
            points += 800 * (combo + 1);
            temporaryPoints += 800 * (combo + 1);
          }
          // Check for normal matches
          else {
            matchGrid[y][x] = true;
            matchGrid[y - 1][x] = true;
            matchGrid[y + 1][x] = true;
            gemMatches = true;
            points += 100 * (combo + 1);
            temporaryPoints += 100 * (combo + 1);
          }
        }
      }
    }
  }

  return matchGrid;
}

// Replace any empty spots with new gems
function refillGems() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLUMNS; x++) {
      if (gemGrid[y][x] === EMPTY_CELL) {

        let gems = {
          motionX: x * CELL_SIZE,
          motionY: OFFSCREEN,
          type: random(gemTypes),
          bomb: random(1, 100) <= 5
        };

        gemGrid[y][x] = gems;
      }
    }
  }
}

// show the shuffle grid prompt if idle for too long
function shuffleGrid() {
  if (millis() > SHUFFLE_GRID_TIME + gameStateTimer && !promptShown) {
    promptShowing = true;
    fill("white");
    rectMode(CENTER);
    rect(width / 2, height / 2, SHUFFLE_PROMPT_X, SHUFFLE_PROMPT_Y);
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    fill("black");
    textSize(SHUFFLE_PROMPT_TEXT_SIZE);
    noStroke();
    text(`Press R to shuffle the board for -1000 points
    Press C to ignore`, width / 2, height / 2);
  }
}

// Click two adjacent gems to switch them
function mousePressed() {

  // Click to start game
  if (starting) {
    starting = false;
    waiting = true;
    gameTimer = millis();
    gameStateTimer = millis();
  }

  // Make sure that the game currently isn't moving or matching gems
  else if (waiting && !promptShowing) {

    // Reset idle time for shuffle prompt
    gameStateTimer = millis();

    let gemX = Math.floor(mouseX / CELL_SIZE);
    let gemY = Math.floor(mouseY / CELL_SIZE);

    // Make sure that the click is within the grid
    if (gemX >= 0 && gemX < COLUMNS && gemY >= 0 && gemY < ROWS) {

      // Select the first gem if nothing has been clicked
      if (currentGem === null) {
        currentGem = {
          x: gemX,
          y: gemY
        };
      }
      else {
        // Swap the two gems
        if (Math.abs(currentGem.x - gemX) + Math.abs(currentGem.y - gemY) === 1) {
          let temporaryGem = gemGrid[currentGem.y][currentGem.x];
          gemGrid[currentGem.y][currentGem.x] = gemGrid[gemY][gemX];
          gemGrid[gemY][gemX] = temporaryGem;

          // Test for matches and swap back if none
          let validMatch = checkMatches();
          if (!validMatch) {
            let temporaryGem = gemGrid[currentGem.y][currentGem.x];
            gemGrid[currentGem.y][currentGem.x] = gemGrid[gemY][gemX];
            gemGrid[gemY][gemX] = temporaryGem;
            hearts--;

            // Play invalid sound
            invalidSwapSound.play();
          }
          else {
            // Play swapping sound
            swapSound.play();
          }
        }

        // Reset player click
        currentGem = null;
      }
    }
  }

  // Click on the box to restart
  else if (gameOver || gameWon) {

    // Ensure click is within the box
    if (mouseX > width / 2 - GAME_OVER_SCREEN_X / 2 && mouseX < width / 2 + GAME_OVER_SCREEN_X / 2 && mouseY > height / 2 - GAME_OVER_SCREEN_Y / 2 && mouseY < height / 2 + GAME_OVER_SCREEN_Y / 2) {

      // Reset the game
      gemGrid = generateGrid(ROWS, COLUMNS);

      // Generate boards until there are no matches
      let initialMatches = checkMatches();
      while (initialMatches) {
        gemGrid = generateGrid(ROWS, COLUMNS);
        initialMatches = checkMatches();
      }

      // Clear states, reset matches, reset points, start game timer
      gameWon = false;
      gameOver = false;
      dropping = false;
      matching = false;
      waiting = true;
      matchingGems = [];
      points = 0;
      stars = 0;
      combo = 0;
      hearts = 3;
      gameTimer = millis();
    }
  }
}

// Control the prompt screen / Shuffle the grid
function keyPressed() {
  if (waiting) {

    // Shuffle grid for -1000 points
    if (key === "r") {
      gemGrid = generateGrid(ROWS, COLUMNS);

      // Track the points
      currentPoints = points;

      // Generate boards until there are no matches
      let initialMatches = checkMatches();
      while (initialMatches) {
        gemGrid = generateGrid(ROWS, COLUMNS);
        initialMatches = checkMatches();
      }

      // Play bling sound
      blingSound.play();

      // Clear states and reset matches
      dropping = false;
      matching = false;
      waiting = true;
      currentGem = null;
      matchingGems = [];
      gameStateTimer = millis();
      promptShowing = false;
      promptShown = true;
      currentPoints -= 1000;
      points = currentPoints;
      combo = 0;

      // Ensure no negative points
      if (points < 0) {
        points = 0;
      }
    }

    // Ignore the prompt screen
    else if (key === "c") {
      promptShowing = false;
      promptShown = true;
    }
  }
}