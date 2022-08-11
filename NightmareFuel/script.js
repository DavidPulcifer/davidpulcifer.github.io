/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
CANVAS_WIDTH = canvas.width = 350;
CANVAS_HEIGHT = canvas.height = 700;
const numberOfEnemies = 100;
const enemiesArray = [];

let gameFrame = 0;

const enemyType1 = {
    enemySprite: 'enemy1.png',
    spriteWidth: 293,
    spriteHeight: 155,
    moveType: 1
};

const enemyType2 = {
    enemySprite: 'enemy2.png',
    spriteWidth: 266,
    spriteHeight: 188,
    moveType: 2
};

const enemyType3 = {
    enemySprite: 'enemy3.png',
    spriteWidth: 218,
    spriteHeight: 177,
    moveType: 3
};

const enemyType4 = {
    enemySprite: 'enemy4.png',
    spriteWidth: 213,
    spriteHeight: 213,
    moveType: 4
};

class Enemy {
    constructor(enemy){
        this.image = new Image();
        this.image.src = enemy.enemySprite;        
        this.speed = Math.random() * 4 + 1;
        this.spriteWidth = enemy.spriteWidth;
        this.spriteHeight = enemy.spriteHeight;
        this.width = this.spriteWidth/2;
        this.height = this.spriteHeight/2;        
        this.x = Math.random() * (canvas.width - this.width);
        this.y = Math.random() * (canvas.height - this.height);
        this.frame = 0;
        this.flapSpeed = Math.floor(Math.random() * 3 + 1);
        this.moveType = enemy.moveType;

        // Movement 2 and 3 Variables
        this.angle = Math.random() * 500;
        this.angleSpeed2 = Math.random() * 2;
        this.angleSpeed3 = Math.random() * 0.5 + 0.5;
        this.curveAmplitude2 = Math.random() * 7;
        this.curveAmplitude3 = Math.random() * 200 + 50;

        // Movement 4 Variables
        this.newX = Math.random() * (canvas.width - this.width);
        this.newY = Math.random() * (canvas.height - this.height);
        this.interval = Math.floor(Math.random() * 200 + 50);
    }    
    update(){
        switch(this.moveType){
            case 1:
                this.movementPattern1();
                break;
            case 2:
                this.movementPattern2();
                break;
            case 3:
                this.movementPattern3();
                break;
            case 4:
                this.movementPattern4();
                break;
            default:
                this.movementPattern1();
        }
        if(gameFrame % this.flapSpeed === 0) {
            this.frame > 4 ? this.frame = 0 : this.frame++;
        }        
    }
    draw(){
        ctx.drawImage(this.image, 
                    this.frame * this.spriteWidth, 0, 
                    this.spriteWidth, this.spriteHeight, 
                    this.x, this.y,
                    this.width, this.height);
    }
    movementPattern1(){
        this.x += Math.random() * 15 - 7.5;
        this.y += Math.random() * 10 - 5;
    }
    movementPattern2(){
        this.x -= this.speed;
        if (this.x + this.width < 0) this.x = canvas.width;
        this.y += this.curveAmplitude2 * Math.sin(this.angle);
        this.angle += this.angleSpeed2;
    }
    movementPattern3(){
        this.x = canvas.width/2 * Math.cos(this.angle * Math.PI/200) 
                    + (canvas.width/2 - this.width/2);        
        this.y = canvas.height/2 * Math.sin(this.angle * Math.PI/300) 
        + (canvas.height/2 - this.height/2);
        this.angle += this.angleSpeed3;
        if(this.x + this.width < 0) this.x = canvas.width;
    }
    movementPattern4(){
        if(gameFrame % this.interval === 0) {
            this.newX = Math.random() * (canvas.width - this.width);
            this.newY = Math.random() * (canvas.height - this.height);
        }
        let dx = this.x - this.newX;
        let dy = this.y - this.newY;
        this.x -= dx/70;
        this.y -= dy/70;
        //this.x = 0;        
        //this.y = 0;
        if(this.x + this.width < 0) this.x = canvas.width;
    }
};

for (let i = 0; i < numberOfEnemies; i++) {
    enemiesArray.push(new Enemy(enemyType1));
}

function animate(){
    ctx.clearRect(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);    
    enemiesArray.forEach(enemy => {
        enemy.update();
        enemy.draw();
    });
    gameFrame++;
    requestAnimationFrame(animate);
}

animate();