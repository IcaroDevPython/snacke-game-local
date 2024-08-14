const menu = document.querySelector(".menu")
const main = document.querySelector("main")
const play = menu.querySelector(".menu--play")
const score = menu.querySelector(".menu--score")

const canvas = document.getElementById("canvas")
const context = canvas.getContext("2d")
const shapeCanvas = 30
const shapeSnakeBody = 1
const arrows = {
    "ArrowUp": [-1, "y"],
    "ArrowDown": [1, "y"],
    "ArrowLeft": [-1, "x"],
    "ArrowRight": [1, "x"] 
}

let snake
let foods
let gameRun

canvas.width = shapeCanvas
canvas.height = shapeCanvas

play.addEventListener("click", () => {
    setupStart()
    menu.style.animationName = "closeMenu"
    main.style.animationName = "offblur"
    setTimeout(gameLoop, 2000)
})

document.addEventListener("keydown", ({ key }) => {
    if (!Object.keys(arrows).includes(key) || !snake || !gameRun) return
    const [key0, v0] = arrows[key]
    const [key1, v1] = arrows[snake.direction]
    if (v0 == v1 && key0 != key1) return
    snake.direction = key
})

function setupStart() {
    snake = { body: [{ x: Number((shapeCanvas/2).toFixed()), y: Number((shapeCanvas/2).toFixed())}], direction: sortDirection(Object.keys(arrows)),collid: false }
    foods = { foods: [], eated: false }
    gameRun = true
}

function openMenu() {
    score.style.display = "block"
    score.firstElementChild.innerText = snake.body.length - 1
    play.innerText = "RETRY"
    menu.style.animationName = "openMenu"
    main.style.animationName = "onblur"
}

function drawGame(snake, foods) {
    context.clearRect(0, 0, shapeCanvas, shapeCanvas)
    snake.body.forEach((body, index) => {
        context.fillStyle = "#ffffff"
        context.fillRect(body.x, body.y, shapeSnakeBody, shapeSnakeBody)
    })

    foods.foods.forEach(food => {
        context.fillStyle = "#fbff00"
        context.fillRect(food.x, food.y, shapeSnakeBody, shapeSnakeBody)
    
    })
}

function moveSnake(snake) {
    const move = arrows[snake.direction]
    if (move) {
        if (!foods.eated) {
            createFood()
            foods.eated = true
        }
        const head = { ...snake.body[snake.body.length - 1] }
        head[move[1]] += move[0]
        snake.body.push(head)
        snake.body.shift()
        drawGame(snake, foods)
        checkEat(head)
    }
}

function createFood() {
    foods.foods.push({ x: (Math.random() * (shapeCanvas - 1)).toFixed(), y: (Math.random() * (shapeCanvas - 1)).toFixed() })
}

function checkCollision() {
    const head = { ...snake.body[snake.body.length - 1] }
    const move = arrows[snake.direction]
    if (head[move[1]] + move[0] < 0 || head[move[1]] + move[0] >= shapeCanvas) {
        gameRun = false
        snake.collid = true
        openMenu()
    }
}

function checkEat(head) {
    foods.foods.forEach((food, index) => {
        if (head.x == food.x && head.y == food.y) {
            foods.foods.splice(index, 1)
            foods.eated = false
            snake.body.push(head)
        }
    })
}

function sortDirection(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function gameLoop() {
    if (gameRun) {
        checkCollision()
        if (!snake.collid) {
            moveSnake(snake)
            setTimeout(() => {
                gameLoop()
            }, 100)
        }
    }
}