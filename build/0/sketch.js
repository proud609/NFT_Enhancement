// 'use strict'

let x = [];
let y = [];
let step = [];
let size = [];

function setup() {
  createCanvas(windowHeight, windowHeight);
  background('rgb(224,224,224)');
  noiseSeed(99);

  strokeWeight(1);
  stroke(0);
}

function draw() {
  
  for (let i = 0; i < 1000; i++) {
    let nn = noise(x[i] / 1, y[i] / 1) * 5;
    let angle = nn * 2 * PI;
    let xx = cos(angle) * step[i] + x[i];
    let yy = sin(angle) * step[i] + y[i];

    x[i] = xx;
    y[i] = yy;
    strokeWeight(size[i]);

    beginShape(POINTS);
    vertex(xx, yy);
    endShape();
  }

  if (frameCount % 200 == 20) {
    for (let i = 0; i < 1000; i++) {
      let id = (i / 1000.0) * 2 * PI;
      let xx = cos(id) * 120 + width / 2;
      let yy = sin(id) * 120 + height / 2;
      x[i] = xx;
      y[i] = yy;
      step[i] = noise(i) * 3.0 + 0.5;
      size[i] = noise(i) * 2.0 + 0.1;
    }
  }
}

function windowResized() {
  resizeCanvas(windowHeight, windowHeight);
}

