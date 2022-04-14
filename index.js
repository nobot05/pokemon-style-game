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

image.onload = () => {
    c.drawImage(image, 0, 0 )
}