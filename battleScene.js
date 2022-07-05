const battleBackgroundImage = new Image();
battleBackgroundImage.src = "img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

const draggle = new Monster(monsters.Draggle);
const emby = new Monster(monsters.Emby);

const renderedSprites = [draggle, emby];

emby.attacks.forEach((attack) => {
  const button = document.createElement("button");
  button.innerHTML = attack.name;
  document.querySelector("#attacksBox").append(button);
});

function animateBattle() {
  window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}
animateBattle();
// animate()

const queue = [];

// event listeners for the buttons
document.querySelectorAll("button").forEach((button) => {
  button.addEventListener("click", (e) => {
    // console.log(attacks[e.currentTarget.innerHTML])
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    emby.attack({
      attack: selectedAttack,
      recipient: draggle,
      renderedSprites,
    });

    if (draggle.health <= 0) {
      queue.push(() => {
        draggle.faint();
      });
      return;
    }

    // draggle or enemy attacks right here
    const randomAttack =
      draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)];

    queue.push(() => {
      draggle.attack({
        attack: randomAttack,
        recipient: emby,
        renderedSprites,
      });
      if (emby.health <= 0) {
        queue.push(() => {
          emby.faint();
        });
        return;
      }
    });
  });
  button.addEventListener("mouseenter", (e) => {
    const selectedAttack = attacks[e.currentTarget.innerHTML];
    document.querySelector("#attackType").innerHTML = selectedAttack.type;
    document.querySelector("#attackType").style.color = selectedAttack.color;
    console.log("go");
  });
});

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
  console.log("clicked dialogue");
});
