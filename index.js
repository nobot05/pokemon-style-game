const canvas = document.querySelector("canvas");
//context
const c = canvas.getContext("2d");

console.log(collisions);

canvas.width = 1024;
canvas.height = 576;

console.log(canvas);

// c.fillStyle = "white";
// c.fillRect(0, 0, canvas.width, canvas.height);

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
  //console.log(collisions.slice(i , 70+i))
}
//console.log(collisionsMap);

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48; //the block was 12x2 but then we zoomed our map to 400% so 12x4=48
    this.height = 48;
  }
  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

const offset = {
  x: -735,
  y: -610,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    //console.log(symbol)
    if (symbol === 1)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

console.log(boundaries);

const image = new Image();
image.src = "img/PelletTown.png";

const playerImage = new Image();
playerImage.src = "img/playerDown.png";

class Sprite {
  constructor({ position, velocit, image }) {
    this.position = position;
    this.image = image;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const testBoundary = new Boundary({
  position: {
    x: 400,
    y: 400,
  },
});

const movables = [background, testBoundary];

function animate() {
  window.requestAnimationFrame(animate);
  //console.log('animate')
  background.draw();
  // boundaries.forEach((boundary) => {
  //   boundary.draw();
  // });
  testBoundary.draw();
  c.drawImage(
    playerImage,
    0,
    0,
    playerImage.width / 4,
    playerImage.height,
    canvas.width / 2 - playerImage.width / 4 / 2,
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );

  if (player.position.x + player.width) {
  }

  if (keys.w.pressed && lastKey === "w") {
    movables.forEach((movable) => {
      movable.position.y += 3;
    });
    // background.position.y += 3;
    //console.log(background.position.y)
    // testBoundary.position.y += 3;
  } else if (keys.a.pressed && lastKey === "a") {
    // background.position.x += 3;
    movables.forEach((movable) => {
      movable.position.x += 3;
    });
  } else if (keys.s.pressed && lastKey === "s") {
    // background.position.y -= 3;
    movables.forEach((movable) => {
      movable.position.y -= 3;
    });
  } else if (keys.d.pressed && lastKey === "d") {
    // background.position.x -= 3;
    movables.forEach((movable) => {
      movable.position.x -= 3;
    });
  }
}
animate();

let lastKey = "";
window.addEventListener("keydown", (e) => {
  //console.log(e.key) returns which key we are pressing
  switch (e.key) {
    case "w":
      //console.log('pressed w key')
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      //console.log('pressed a key')
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      //console.log('pressed s key')
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      //console.log('pressed d key')
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
  console.log(keys);
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
  console.log(keys);
});
