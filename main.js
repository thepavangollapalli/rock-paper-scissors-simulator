// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// function to generate a random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate a random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Ball {
  constructor(x, y, velX, velY, color, size, type) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.color = color;
    this.size = size;
    this.type = type;
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
  }

  update() {
    if ((this.x + this.size >= width) || (this.x - this.size <= 0)) {
      this.velX = -(this.velX);
    }

    if ((this.y + this.size >= height) || (this.y - this.size <= 0)) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
  }

  collisionDetect() {
    for (const ball of balls) {
      if (this !== ball) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy)

        // could use fancier collision detection using SAT (separating axis theorem)

        if (distance < this.size + ball.size) { 
          ball.color = this.color = randomRGB();
          // when intersecting: need to change image based on this and ball's types
          // should we implement bounce?
        }
      }
    }
  }
}

const balls = [];

while (balls.length < 5) {
  const size = 20;
  const ball = new Ball(
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
    "rock"
  )

  balls.push(ball);
}

function loop() {
  // Redraw the canvas each time with partial opacity
  // to see the last few positions of balls. this allows
  // for us to get "trails" for each ball
  ctx.fillStyle = "rgba(0,0,0)"
  ctx.fillRect(0, 0, width, height);

  for (const ball of balls) {
    ball.draw();
    ball.update();
    ball.collisionDetect();
  }
  
  // add logic that if all balls are the same type, then end

  requestAnimationFrame(loop);
}

loop();