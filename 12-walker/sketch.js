// Walker OOP Demo

class Walker {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.diameter = 2;
    this.speed = 5;
    this.color = "red";
  }

  move() {
    let choice = random(100);
    if (choice < 25) {
      this.x += this.speed;
    }
    else if (choice < 50) {
      this.x -= this.speed;
    }
    else if (choice < 75) {
      this.y += this.speed;
    }
    else {
      this.y -= this.speed;
    }
  }

  display() {
    fill(this.color);
    stroke(this.color);
    circle(this.x, this.y, this.diameter);
  }
}

let harjot;
let mitt;

function setup() {
  background(220);
  createCanvas(windowWidth, windowHeight);
  harjot = new Walker(width / 2, height / 2);
  mitt = new Walker(300, 500);
  mitt.color = "blue";
}

function draw() {
  harjot.move();
  mitt.move();
  
  harjot.display();
  mitt.display();
}