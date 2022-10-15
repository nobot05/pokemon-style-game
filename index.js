const canvas = document.querySelector("canvas");
//context
const c = canvas.getContext("2d");
// console.log(battleZonesData);
// console.log(collisions);
// console.log(gsap);

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

const battleZonesMap = [];
for (let i = 0; i < battleZonesData.length; i += 70) {
  battleZonesMap.push(battleZonesData.slice(i, 70 + i));
}
console.log(battleZonesMap);

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

const battleZones = [];

battleZonesMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    //console.log(symbol)
    if (symbol === 1)
      battleZones.push(
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

const foregroundImage = new Image();
foregroundImage.src = "img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "img/playerDown.png";

const playerUpImage = new Image();
playerUpImage.src = "img/playerUp.png";

const playerLeftImage = new Image();
playerLeftImage.src = "img/playerLeft.png";

const playerRightImage = new Image();
playerRightImage.src = "img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    up: playerUpImage,
    left: playerLeftImage,
    down: playerDownImage,
    right: playerRightImage,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: image,
});

const foreground = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: foregroundImage,
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

// const testBoundary = new Boundary({
//   position: {
//     x: 400,
//     y: 400,
//   },
// });

const movables = [background, ...boundaries, foreground, ...battleZones];

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}
const battle = {
  initiated: false,
};

function animate() {
  const animationId = window.requestAnimationFrame(animate);
  console.log(animationId);
  //console.log('animate')
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  // testBoundary.draw();
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();
  foreground.draw();

  let moving = true;
  player.animate = false;
  console.log(animationId);
  if (battle.initiated) return;

  //activate a battle
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      const overlappingArea =
        (Math.min(
          player.position.x + player.width,
          battleZone.position.x + battleZone.width
        ) -
          Math.max(player.position.x, battleZone.position.x)) *
        (Math.min(
          player.position.y + player.height,
          battleZone.position.y + battleZone.height
        ) -
          Math.max(player.position.y, battleZone.position.y));
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: battleZone,
        }) &&
        overlappingArea > (player.width * player.height) / 2 &&
        Math.random() < 0.01
      ) {
        console.log("activate battle");

        //deactivate current animation loop
        window.cancelAnimationFrame(animationId);
        audio.Map.stop()
        audio.initBattle.play()
        audio.battle.play()
        battle.initiated = true;
        gsap.to("#overlappingDiv", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#overlappingDiv", {
              opacity: 1,
              duration: 0.4,
              onComplete() {
                // activate a new animation loop
                initBattle();
                animateBattle();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                  duration: 0.4,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }

    if (moving) {
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
    }
    // background.position.y += 3;
    //console.log(background.position.y)
    // testBoundary.position.y += 3;
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving) {
      // background.position.x += 3;
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
    }
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving) {
      // background.position.y -= 3;
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
    }
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }
    if (moving) {
      // background.position.x -= 3;
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
    }
  }
}
// animate();

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
    case "W":
      //console.log('pressed w key')
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "A":
      //console.log('pressed a key')
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "S":
      //console.log('pressed s key')
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "D":
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
    case "W":
      keys.w.pressed = false;
      break;
    case "A":
      keys.a.pressed = false;
      break;
    case "S":
      keys.s.pressed = false;
      break;
    case "D":
      keys.d.pressed = false;
      break;
  }
  console.log(keys);
});


let clicked = false
addEventListener('click', () => {
  if(!clicked){
    audio.Map.play()
    clicked = true
  }
})
