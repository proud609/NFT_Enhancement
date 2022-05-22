// 'use strict'

function setup() {
  createCanvas(windowHeight, windowHeight, WEBGL)
  img = loadImage('./images/10.png');
}

function draw() {
  lights();
  background(240,248,255);
  
  let d = frameCount * 1.5 % 360;
  let yy = (pow(2*abs((d/360)-0.5), 3.0))*100;
  translate(0, yy, 0);
  rotateY(radians(d));
  texture(img);
  box(200);
  
}

function windowResized() {
  resizeCanvas(windowHeight, windowHeight)
}
