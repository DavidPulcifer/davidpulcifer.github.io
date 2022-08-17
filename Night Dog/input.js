export class InputHandler {
    constructor(game) {
        this.game = game;
        this.keys = [];
        window.addEventListener('keydown', e => {
            if ((e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' ||
                e.key === 'p' 
            ) && this.keys.indexOf(e.key) === -1) {
                this.keys.push(e.key);
            } else if (e.key === 'd') {
                this.game.debug = !this.game.debug;
            }
            
            if (e.key === 'p') {
                this.game.paused = !this.game.paused;
            }
        });
        window.addEventListener('keyup', e => {
            if (e.key === 'ArrowDown' ||
                e.key === 'ArrowUp' ||
                e.key === 'ArrowLeft' ||
                e.key === 'ArrowRight' ||
                e.key === ' ' ||
                e.key === 'p') {
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        });
    }
}