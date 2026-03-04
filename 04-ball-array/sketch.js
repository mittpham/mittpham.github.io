// Ball Object Array

let ballArray = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
}

function draw() {
  background(220);

  for (let ball of ballArray) {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x > width + ball.radius) {
      ball.x = 0 + ball.radius;
    }
    else if (ball.x < 0 - ball.radius) {
      ball.x = width - ball.radius;
    }
    else if (ball.y > height + ball.radius) {
      ball.y = 0 + ball.radius;
    }
    else if (ball.y < 0 - ball.radius) {
      ball.y = height - ball.radius;
    }

    fill(ball.r, ball.g, ball.b);
    circle(ball.x, ball.y, ball.radius*2);
  }
}

function mousePressed() {
  spawnBall(mouseX, mouseY);
}

function spawnBall(_x, _y) {
  let theBall = {
    x: _x,
    y: _y,
    dx: random(-5, 5),
    dy: random(-5, 5),
    radius: random(10, 40),
    r: random(255),
    g: random(255),
    b: random(255),
  };
  ballArray.push(theBall);
}