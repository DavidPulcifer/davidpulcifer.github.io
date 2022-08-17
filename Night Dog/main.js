import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './ui.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    const levelDropdown = document.getElementById('levelSelect');
    levelDropdown.addEventListener('change', function(e){
        reset();
    });

    const diffDropdown = document.getElementById('diffSelect');
    diffDropdown.addEventListener('change', function(e){
        reset();
    });

    const controls = document.getElementById('controls');

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.level = levelDropdown.value;
            this.groundMargin = this.level === 'city' ? 80 : 50;
            this.speed = 0;
            if(diffDropdown.value === 'easy'){
                this.maxSpeed = 3;
            } else {
                this.maxSpeed = 2;
            }            
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.ui = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = [];
            this.floatingMessages = [];
            this.maxParticles = 100;
            this.enemyTimer = 0;
            if(diffDropdown.value === 'easy'){
                this.enemyInterval = 1000;
            } else {
                this.enemyInterval = 2000;
            }            
            this.debug = false;
            this.score = 0;
            this.fontColor = 'black';
            this.time = 0;
            if(diffDropdown.value === 'hard'){
                this.maxTime = 30000;
                this.winningScore = 15;
                this.lives = 1;
            } else if (diffDropdown.value === 'medium'){
                this.maxTime = 30000;
                this.winningScore = 15;
                this.lives = 5;
            } else {
                this.maxTime = 30000;
                this.winningScore = 35;
                this.lives = 5;
            }            
            
            this.gameOver = false;
            this.paused = true;            
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }
        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // Handle Enemies
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime);
            });

            //Handle Floating Messages
            this.floatingMessages.forEach(message => {
                message.update();
            });

            // Handle Particles
            this.particles.forEach((particle, index) => {
                particle.update();
            })
            if(this.particles.length > this.maxParticles) {
                this.particles.length = this.maxParticles;
            }

            // Handle Colission Sprites
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.enemies.forEach(enemy => {
                enemy.draw(context);
            });
            this.particles.forEach(particle => {
                particle.draw(context);
            });
            this.collisions.forEach(collision => {
                collision.draw(context);
            });
            this.floatingMessages.forEach(message => {
                message.draw(context);
            });
            this.ui.draw(context);
        }
        addEnemy(){
            if(diffDropdown.value === 'easy'){
                if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
                else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
                this.enemies.push(new FlyingEnemy(this));
            } else if(diffDropdown.value === 'medium'){
                if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
                else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
                if(Math.random() < 0.1) this.enemies.push(new FlyingEnemy(this));
            } else if(diffDropdown.value === 'hard'){
                if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
                else if(this.speed > 0) this.enemies.push(new ClimbingEnemy(this));
                if(Math.random() < 0.1) this.enemies.push(new FlyingEnemy(this));
            }            
        }
    }

    let game = new Game(canvas.width, canvas.height);
    let lastTime = 0;    

    function animate(timeStamp){
        let deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0,0,canvas.width, canvas.height);
        if(game.paused) deltaTime = 0;
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
        if(!game.paused){
            controls.style.visibility = "hidden";            
        } else {
            controls.style.visibility = "visible";
        } 
    }
    animate(0);

    function reset(){
        game = new Game(canvas.width, canvas.height);
        animate(0);
    }
});