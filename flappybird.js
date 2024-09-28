let bird, pipes = [], score, isGameOver, gameStarted;
let currentMenu = 'main'; // 'main', 'difficulty', 'mode', 'game'
let options = {
    main: ['Start Game', 'Difficulty', 'Mode'],
    difficulty: ['Easy', 'Medium', 'Hard'],
    mode: ['Light', 'Dark']
};
let currentOption = 0;
let gameDifficulty = 'Medium';
let gameMode = 'Light';

function setup() {
    createCanvas(400, 600);
    textSize(32);
    textAlign(CENTER, CENTER);
    resetGame();
}

function draw() {
    background(gameMode === 'Light' ? '#87CEEB' : '#333');
    if (currentMenu === 'game' && gameStarted) {
        playGame();
    } else {
        displayMenu();
    }
}

function playGame() {
    if (!isGameOver) {
        handlePipes();
        bird.update();
        bird.show();

        if (frameCount % 60 === 0) {
            pipes.push(new Pipe());
        }

        displayScore();
    }
}

function handlePipes() {
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].show();
        pipes[i].update();

        if (pipes[i].hits(bird)) {
            console.log("Game Over");
            isGameOver = true;
            displayGameOver();
        }

        if (pipes[i].offscreen()) {
            pipes.splice(i, 1);
            score++;
        }
    }
}

function keyPressed() {
    if (currentMenu === 'game') {
        if (keyCode === 32 && !isGameOver) { // Space bar to flap
            bird.up();
        } else if (keyCode === 82 && isGameOver) { // 'R' for restart
            resetGame();
        } else if (keyCode === 81 && isGameOver) { // 'Q' to quit to main menu and refresh the page
            window.location.reload();
        }
    } else {
        navigateMenu();
    }
}

function navigateMenu() {
    if (keyCode === DOWN_ARROW) {
        currentOption = (currentOption + 1) % options[currentMenu].length;
    } else if (keyCode === UP_ARROW) {
        currentOption = (currentOption - 1 + options[currentMenu].length) % options[currentMenu].length;
    } else if (keyCode === ENTER) {
        handleSelection();
    }
}

function handleSelection() {
    let selected = options[currentMenu][currentOption];
    if (currentMenu === 'main') {
        if (selected === 'Start Game') {
            currentMenu = 'game';
            gameStarted = true;
            resetGame();
        } else {
            currentMenu = selected.toLowerCase();
            currentOption = 0;
        }
    } else {
        if (currentMenu === 'difficulty') {
            gameDifficulty = selected;
            setDifficulty(gameDifficulty);
        } else if (currentMenu === 'mode') {
            gameMode = selected;
        }
        currentMenu = 'main'; // Return to main after setting
    }
}

function resetGame() {
    bird = new Bird();
    pipes = [];
    score = 0;
    isGameOver = false;
    loop();
}

function displayMenu() {
    let menuOptions = options[currentMenu];
    for (let i = 0; i < menuOptions.length; i++) {
        fill(i === currentOption ? 'red' : 'white');
        text(menuOptions[i], width / 2, height / 2 + 40 * (i - 1));
    }
}

function displayScore() {
    fill(255);
    textSize(24);
    text('Score: ' + score, width / 2, 40);
}

function displayGameOver() {
    textSize(32);
    fill(255, 0, 0);
    text("Game Over", width / 2, height / 2 - 20);
    textSize(16);
    text("Press 'R' to Restart or 'Q' to Quit", width / 2, height / 2 + 40);
    noLoop();
}

class Bird {
    constructor() {
        this.y = height / 2;
        this.x = 64;
        this.gravity = 0.6;
        this.lift = -15;
        this.velocity = 0;
    }

    show() {
        fill(255);
        ellipse(this.x, this.y, 32, 32);
    }

    up() {
        this.velocity += this.lift;
    }

    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.velocity *= 0.9;
        if (this.y > height) {
            this.y = height;
            this.velocity = 0;
        }
        if (this.y < 0) {
            this.y = 0;
            this.velocity = 0;
        }
    }
}

class Pipe {
    constructor() {
        this.top = random(height / 6, 3 / 4 * height);
        this.bottom = height - (this.top + random(120, 180));
        this.x = width;
        this.w = 20;
        this.speed = 2;
    }

    show() {
        fill(34, 139, 34);
        rect(this.x, 0, this.w, this.top);
        rect(this.x, height - this.bottom, this.w, this.bottom);
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x < -this.w;
    }

    hits(bird) {
        if (bird.y < this.top || bird.y > height - this.bottom) {
            if (bird.x > this.x && bird.x < this.x + this.w) {
                return true;
            }
        }
        return false;
    }
}

function setDifficulty(difficulty) {
    switch (difficulty) {
        case 'Easy':
            bird.gravity = 0.5;
            bird.lift = -10;
            break;
        case 'Medium':
            bird.gravity = 0.6;
            bird.lift = -15;
            break;
        case 'Hard':
            bird.gravity = 0.8;
            bird.lift = -20;
            break;
    }
}
