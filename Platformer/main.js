import { Player } from './player.js';
import { InputHandler } from './input.js';
import { GameMap } from './map.js';
import { MAPDATA as map } from './map_data.js';

window.addEventListener('load', function(){
  
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d')
  
  canvas.width = 804
  canvas.height = 500
  
  class Game {
    constructor(width, height){
      this.width = width;
      this.height = height;
      this.bgimage = document.getElementById('background')
      this.gamemap = new GameMap(this, map)
      this.player = new Player(this)
      this.inputs = new InputHandler()
    };

    update (deltaTime) {
      this.player.update(this.inputs.key, deltaTime, this.gamemap); //1st
      this.gamemap.update(deltaTime, this.player); //2nd
    };
    
    draw (context) {
      context.drawImage(this.bgimage, 0, 0, 800, 600, 0, 0, this.width, this.height);
      this.gamemap.drawLand(context);
      this.player.draw(context);
      
      context.save();
      context.globalCompositeOperation = 'multiply'
      this.gamemap.drawWater(context);
      context.restore()
    };
  };
  
  const game = new Game(canvas.width, canvas.height);
  
  let lastTime; //dt helper
  function animate(timestamp) {
    if (!lastTime) lastTime = timestamp;
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.update(deltaTime);
    game.draw(ctx);
    
    requestAnimationFrame(animate);
  }; 
  requestAnimationFrame(animate);
  
});