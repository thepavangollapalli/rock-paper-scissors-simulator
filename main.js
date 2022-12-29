// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;


// load image assets
const scissors_img = new Image();
let scissors_loaded = false;
scissors_img.addEventListener(
  "load",
  () => {
    scissors_loaded = true;
  },
  false
);
scissors_img.src = "scissors.png";

const rock_img = new Image();
let rock_loaded = false;
rock_img.addEventListener(
  "load",
  () => {
    rock_loaded = true;
  },
  false
);
rock_img.src = "rock.png";

const paper_img = new Image();
let paper_loaded = false;
paper_img.addEventListener(
  "load",
  () => {
    paper_loaded = true;
  },
  false
);
paper_img.src = "paper.jpg";


// function to generate a random number
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate a random color
function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Item {
  constructor(x, y, velX, velY, size, type) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.size = size;
    this.type = type;
    // need to calculate midpoint of drawn shape
    this.centerX = this.x + (this.size / 2);
    this.centerY = this.y + (this.size / 2);
  }

  draw() {
    if (this.type == "scissors" && scissors_loaded) {
      ctx.drawImage(scissors_img, this.x, this.y, this.size, this.size);
    } else if (this.type == "rock" && rock_loaded) {
      ctx.drawImage(rock_img, this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    } else if (this.type == "paper" && paper_loaded) {
      ctx.drawImage(paper_img, this.x, this.y, this.size, this.size);
    }
  }

  // centerX/centerY?
  update() {
    if ((this.centerX + this.size >= width) || (this.centerX - this.size <= 0)) {
      this.velX = -(this.velX);
    }

    if ((this.centerY + this.size >= height) || (this.centerY - this.size <= 0)) {
      this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
    this.centerX += this.velX;
    this.centerY += this.velY;
  }

  collisionDetect() {
    for (const item of items) {
      if (this !== item) {
        const dx = this.centerX - item.centerX;
        const dy = this.centerY - item.centerY;
        const distance = Math.sqrt(dx * dx + dy * dy)

        // stretch: could use fancier collision detection using SAT (separating axis theorem)
        if (distance < this.size) {
          // should we implement bounce?
          // this.velX = -(this.velX);
          // this.velY = -(this.velY);

          // rules for determining type after collision
          if (this.type == "rock" && item.type == "paper") {
            this.type = "paper";
          }
          else if (this.type == "paper" && item.type == "rock") {
            item.type = "paper"
          }

          if (this.type == "paper" && item.type == "scissors") {
            this.type = "scissors";
          }
          else if (this.type == "scissors" && item.type == "paper") {
            item.type = "scissors";
          }

          if (this.type == "rock" && item.type == "scissors") {
            item.type = "rock";
          }
          else if (this.type == "scissors" && item.type == "rock") {
            this.type = "rock";
          }
        }
      }
    }
  }
}

// need global state object
const items = [];

const gamePrefs = {
  numRock: 10,
  numPaper: 10,
  numScissors: 10,
  size: 30,
  velocityX: null, // null velocity will be given a random value per item
  velocityY: null, // null velocity will be given a random value per item
};

function createFromPrefs(gamePrefs) {
  const {
      numRock: numRock, 
      numPaper: numPaper,
      numScissors: numScissors,
      size: size,
      velocityX: velocityX,
      velocityY: velocityY,
  } = gamePrefs;
  const itemsToCreate = {
    "rock": numRock,
    "paper": numPaper,
    "scissors": numScissors
  }
  for (const key in itemsToCreate) {
    for (let i = 0; i < itemsToCreate[key]; i++) {
      const item = new Item(
        random(0 + size, width - size),
        random(0 + size, height - size),
        velocityX ? velocityX : random(-3, 3),
        velocityY ? velocityY : random(-3, 3),
        size,
        key
      )
      items.push(item);
    }
  }
}

createFromPrefs(gamePrefs);

function loop() {
  // Redraw the canvas each time with partial opacity
  // to see the last few positions of items. this allows
  // for us to get "trails" for each item
  ctx.fillStyle = "rgba(255,255,255,0.3)"
  ctx.fillRect(0, 0, width, height);

  for (const item of items) {
    item.draw();
    item.update();
    item.collisionDetect();
  }

  // animation ends once all items are the same type
  let itemTypes = items.map((item) => item.type);
  if (itemTypes.every((itemType) => (itemType == undefined || itemType == itemTypes[0]))) {
    //redraw canvas and items one last time to show final state
    ctx.fillStyle = "rgba(255,255,255)"
    ctx.fillRect(0, 0, width, height);
    for (const item of items) {
      item.draw();
    }
    return;
  } else {
    requestAnimationFrame(loop);
  }
}

loop();