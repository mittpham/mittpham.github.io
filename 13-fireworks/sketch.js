// Fireworks OOP Demo

const NUMBER_OF_PARTICLES_PER_CLICK = 100;

let fireworks = [];

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dx = random(-5, 5);
    this.dy = random(-5, 5);
    this.radius = 3;
    this.r = 255;
    this.g = 0;
    this.b = 0;
    this.opacity = 255;
  }

  display() {
    noStroke();
    fill(this.r, this.g, this.b, this.opacity);
    circle(this.x, this.y, this.radius);
  }

  update() {
    this.x += this.dx;
    this.y += this.dy;

    this.opacity --;
  }
}


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("black");
  for (let particle of fireworks) {
    particle.update();
    particle.display();
  }
}

function mousePressed() {
  for (let i = 0; i < NUMBER_OF_PARTICLES_PER_CLICK; i ++) {
    let newParticle = new Particle(mouseX, mouseY);
    fireworks.push(newParticle);
  }
}