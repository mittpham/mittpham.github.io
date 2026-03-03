// Ball Object Array

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);

  for (let ball of ballArray) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    circle(ball.x, balll.y, ball.radius*2);
  }
}

function mousePresssed() {
  spawnBall();
}

function spawnBall() {
  let theBall = {
    x: random(width),
    y: random(height),
    dx: random(-5, 5),
    dy: random(-5, 5),
    radius: random(10, 40),
  };
  ballArray.push(theBall);
}