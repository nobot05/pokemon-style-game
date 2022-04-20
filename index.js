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

image.onload = () => {
    c.drawImage(image, -750, -610)
    c.drawImage(
        playerImage, 
        0,
        0,
        playerImage.width/4,
        playerImage.height,
        canvas.width/2 - (playerImage.width/4)/2, 
        canvas.height/2 - playerImage.height/2,
        playerImage.width/4,
        playerImage.height
    )
}

