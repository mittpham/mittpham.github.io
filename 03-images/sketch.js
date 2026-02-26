// Image Demo

let dittoImg;

function preload() {
  dittoImg = loadImage("ditto.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
}

function draw() {
  background(220);
  image(dittoImg, mouseX, mouseY, dittoImg.width * 0.5, dittoImg.height * 0.5);
}
