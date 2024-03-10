const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const size = 30;

const audio = new Audio('../assets/audio.mp3')

const finalscore = document.querySelector(".final-score > span");

const score = document.querySelector(".score--value");

const menu = document.querySelector(".menu-screen");

const buttonPlay = document.querySelector(".btn-play");


const initialPosition = { x: 270, y: 240 }

const h1 = document.querySelector("h1");

let snake = [initialPosition];

let direction, loopId;

const incrementScore = () => {
    score.innerText = + score.innerText + 10;
}

const randomNumber = (max, min) => {
    return Math.round(Math.random() * (max - min) + min);
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: "red"
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd";

    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(position.x, position.y, size, size);
    })
}

const moveSnake = () => {
    if (!direction) return;
    const head = snake[snake.length - 1];

    snake.shift();

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y });
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y })
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size })
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size })
    }
}

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle;

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke();

        ctx.beginPath();
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke();
    }

}

const drawFood = () => {

    const { x, y, color } = food;

    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, size, size);
    ctx.shadowBlur = 0;

}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawSnake();
    drawGrid();
    drawFood();
    chackEat();
    moveSnake();
    checkCollisions();

    loopId = setTimeout(() => {
        gameLoop();
    }, 300)
}

const chackEat = () => {
    const head = snake[snake.length - 1];

    if (head.x == food.x && head.y == food.y) {
        incrementScore();
        snake.push(head);
        audio.play();

        let x = randomPosition();
        let y = randomPosition();

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = "red";
    }
}


const checkCollisions = () => {

    const head = snake[snake.length - 1];

    const neckIndex = snake.length - 2

    const canvasLimit = canvas.width - size;

    const wallCollision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570

    const selfCollisions = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;

    })

    if (wallCollision || selfCollisions) {
        gameOver();
    }

}

const gameOver = () => {

    direction = undefined;

    menu.style.display = "flex";
    finalscore.innerText = score.innerText;
    canvas.style.filter = "blur(2px)"


}


document.addEventListener('keydown', ({ key }) => {
    if (key == "ArrowRight" && direction !== "left") {
        direction = "right";
    } else if (key == 'd' && direction !== "left") {
        direction = "right";
    }
    if (key == "ArrowLeft" && direction !== "right") {
        direction = "left"
    } else if (key == 'a' && direction !== "right") {
        direction = "left";
    }
    if (key == "ArrowDown" && direction !== "up") {
        direction = "down";
    } else if (key == 's' && direction !== "up") {
        direction = "down";
    }
    if (key == "ArrowUp" && direction !== "down") {
        direction = "up";
    } else if (key == 'w' && direction !== "down") {
        direction = "up";
    }
});


buttonPlay.addEventListener("click", () => {
    score.innerText = "00";
    menu.style.display = "none";
    canvas.style.filter = "none"

    snake = [initialPosition];
})

gameLoop();