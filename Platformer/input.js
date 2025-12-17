export class InputHandler {
  constructor() {
    this.key = []
    
    document.addEventListener('keydown', (e) => {
      if(!this.key.includes(e.key)) this.key.push(e.key);
    });
     document.addEventListener('keyup', (e) => {
      this.key.splice(this.key.indexOf(e.key), 1);
    });
  };
  
};