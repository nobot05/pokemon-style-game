const canvas = document.querySelector('canvas')
//context
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

console.log(canvas)

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const image = new Image()
image.src = 'img/PelletTown.png'

const playerImage = new Image()
playerImage.src = 'img/playerDown.png'

class Sprite {
    constructor({position, velocit, image}){
        this.position = position
        this.image = image
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

const background = new Sprite({
    position: {
        x: -735,
        y: -610
        // -785, -650
    },
    image: image
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

function animate() {
    window.requestAnimationFrame(animate)
    //console.log('animate')
    background.draw()
    c.drawImage(
        playerImage, 
        0,
        0,
        playerImage.width/4,
        playerImage.height,
        canvas.width/2 - playerImage.width/4/2, 
        canvas.height/2 - playerImage.height/2,
        playerImage.width/4,
        playerImage.height
    )
    if(keys.w.pressed && lastKey === 'w'){
        background.position.y += 3
        //console.log(background.position.y)
    } else if(keys.a.pressed && lastKey === 'a'){
        background.position.x += 3
    } else if(keys.s.pressed && lastKey === 's'){
        background.position.y -= 3
    } else if(keys.d.pressed && lastKey === 'd'){
        background.position.x -= 3
    }
}
animate()

let lastKey = ''
window.addEventListener('keydown', (e) => {
    //console.log(e.key) returns which key we are pressing
    switch (e.key){
        case 'w':
            //console.log('pressed w key')
            keys.w.pressed = true
            lastKey = 'w'
            break
        case 'a':
            //console.log('pressed a key')
            keys.a.pressed = true
            lastKey = 'a'
            break
        case 's':
            //console.log('pressed s key')
            keys.s.pressed = true
            lastKey = 's'
            break
        case 'd':
            //console.log('pressed d key')
            keys.d.pressed = true
            lastKey = 'd'
            break    
    }
    console.log(keys)
})

window.addEventListener('keyup', (e) => {
    switch (e.key){
        case 'w':
            keys.w.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 's':
            keys.s.pressed = false
            break
        case 'd':
            keys.d.pressed = false
            break    
    }
    console.log(keys)
})

