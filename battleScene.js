const battleBackgroundImage = new Image();
battleBackgroundImage.src = "img/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundImage,
});

let draggle;
let emby;
let renderedSprites;
let battleAnimationId;
let queue;

function initBattle() {
  document.querySelector("#userInterface").style.display = "block";
  document.querySelector("#dialogueBox").style.display = "none";
  document.querySelector("#enemyHealthBar").style.width = "100%";
  document.querySelector("#playerHealthBar").style.width = "100%";
  document.querySelector("#attacksBox").replaceChildren();

  draggle = new Monster(monsters.Draggle);
  emby = new Monster(monsters.Emby);
  renderedSprites = [draggle, emby];
  queue = [];

  emby.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attacksBox").append(button);
  });

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
        queue.push(() => {
          // fade back to black
          gsap.to("#overlappingDiv", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              document.querySelector("#userInterface").style.display = "none";
              animate();
              gsap.to("#overlappingDiv", {
                opacity: 0,
              });
              battle.initiated = false;
              audio.Map.play()
            },
          });
        });
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
          queue.push(() => {
            // fade back to black
            gsap.to("#overlappingDiv", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                document.querySelector("#userInterface").style.display = "none";
                animate();
                gsap.to("#overlappingDiv", {
                  opacity: 0,
                });
                battle.initiated = false;
                audio.Map.play()
              },
            });
          });
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
}

function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();
  draggle.draw();
  emby.draw();

  renderedSprites.forEach((sprite) => {
    sprite.draw();
  });
}
// initBattle();
// animateBattle();
animate()

document.querySelector("#dialogueBox").addEventListener("click", (e) => {
  if (queue.length > 0) {
    queue[0]();
    queue.shift();
  } else e.currentTarget.style.display = "none";
  console.log("clicked dialogue");
});
