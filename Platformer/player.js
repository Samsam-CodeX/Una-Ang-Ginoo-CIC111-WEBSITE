export class Player {
  constructor (game) {
    this.game = game;
    this.playerStateAnimationHandler()
    this.playerScale = 1;
    this.width = this.playerCutx * this.playerScale;
    this.height = this.playerCuty * this.playerScale;
    this.x = 150;
    this.y = this.game.height - this.height - 200;
    this.image = document.getElementById('player')
    
    //physics attributes
    this.direction = 0;
    this.runPower =  0.3;
    this.maxSpeed = 4;
    
    this.vy = 0;
    this.jumpPower = 8;
    this.gravity = 0.4;
    this.jumpCounterMid = 0;
    this.midAirJump = false;
    this.onGround = false;
  };
  
  update (inputs, deltaTime, map) {
    let dtmultiplier =  deltaTime / 16.6666666667; //60fps deltaTime: applied on this.direction, velocity Y(vy) and gravity.
    
    if (this.y >= this.game.height - this.height) {
      this.onGround = true;
    };
    
    if (inputs.includes('d')) this.faceDirection = 'right';
    if (inputs.includes('a')) this.faceDirection = 'left';
    
    //horizontal movement
    if (this.onGround) {
      if (inputs.includes('d') && !inputs.includes('a') && this.direction >= 0) {
        this.playerState = 'run';
        this.direction += this.runPower * dtmultiplier;
        if (this.direction >= this.maxSpeed) this.direction = this.maxSpeed;
      } else if (inputs.includes('a') && !inputs.includes('d') && this.direction <= 0) {
        this.playerState = 'run';
        this.direction -= this.runPower * dtmultiplier;
        if (this.direction <= -this.maxSpeed) this.direction = -this.maxSpeed;
      } else {
        this.playerState = 'idle';
        this.direction = 0;
      };
    } 
    // direction manager On Air
    else {
      const midAirPower = 0.10;
      const midAirSpeed = 4;
      const airResistance = 0.01;
      
      //for mid-air walk attemp //not projectile
      if (inputs.includes('d') && this.direction >= 0 && this.direction < midAirSpeed) {
        this.direction += midAirPower * dtmultiplier;
        if (this.direction >= midAirSpeed) this.direction = midAirSpeed;
      }
      else if (inputs.includes('a') && this.direction <= 0 && this.direction > -midAirSpeed) {
        this.direction += -midAirPower * dtmultiplier;
        if (this.direction <= -midAirSpeed) this.direction = -midAirSpeed;
      } 
      //air resistance: normal Projectile
      else {
        if (this.direction > 0) this.direction -= airResistance * dtmultiplier;
        if (this.direction < 0) this.direction += airResistance * dtmultiplier;
      };
    };
    
    //border limit
    const nextX = this.x + this.direction * dtmultiplier;
    if (nextX <= 0 && this.direction * dtmultiplier < 0) {
      this.x = 0;
      this.direction = 0;
    } else if (nextX >= this.game.width - this.width && this.direction * dtmultiplier > 0) {
      this.x = this.game.width - this.width;
      this.direction = 0;
    };
    if (this.direction > 0 && this.x >= this.game.width - this.width) {
      this.direction = 0;
      this.x = this.game.width - this.width;
    } else if (this.direction < 0 && this.x <= 0) {
      this.direction = 0;
      this.x = 0;
    };
    
    //vertical movement
    if (inputs.includes('w') && this.onGround) {
      this.vy += -this.jumpPower * (1 / dtmultiplier);
      this.playerState = 'jump';
      this.onGround = false;
    };
    
    //jump midAir attemp
    if (!inputs.includes('w') && !this.onGround) this.midAirJump = true;
    else if (this.onGround) {
      this.midAirJump = false;
      this.jumpCounterMid = 0
    };
    if (this.midAirJump) {
      if (inputs.includes('w') && this.jumpCounterMid < 1) {
        this.vy = -this.jumpPower;
        this.midAirJump = false;
        this.jumpCounterMid++;
      };
    };
    
    //gravity
    if (!this.onGround) {
      this.vy += this.gravity * dtmultiplier;
    };
    
    //ground limit
    const nextY = this.y + this.vy * dtmultiplier;
    if (nextY >= this.game.height - this.height && this.vy > 0) {
      this.vy = 0;
      this.y = this.game.height - this.height;
    };
    if (this.y > this.game.height - this.height) {
      this.vy = 0;
      this.y = this.game.height - this.height;
    };
    
    
    // rounding player position for collision
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);
    
    //player-map collision thing
    let leftCollide = 0;
    let rightCollide = this.game.width;
    let topCollide = -100000;
    let bottomCollide = this.game.height;
    
    //coordinate prediction, set player on tile surface
    const newX = this.x + this.direction * dtmultiplier;
    const newY = this.y + this.vy * dtmultiplier;
    
    map.mapTiles.forEach( (tile, i) => {
      
      if (map.watertiles.some(waterTile => tile.tilename == waterTile)) return;
      
      const tilex = Math.floor(tile.x + map.scrollx);
      const tiley = Math.floor(tile.y + map.scrolly);
      const tileWidth = Math.floor(map.tilesize * (tile.cutWidth / map.standardCutLength));
      const tileHeight = Math.floor(map.tilesize * (tile.cutHeight / map.standardCutLength));
      
      const leftTiles = tilex + tileWidth / 2 <= this.x && tiley + tileHeight > this.y && tiley - this.height < this.y;
      const rightTiles = tilex + tileWidth / 2 >= this.x + this.width && tiley + tileHeight > this.y && tiley - this.height < this.y;
      const topTiles = tiley + tileHeight / 2 <= this.y && tilex + tileWidth > this.x && tilex - this.width < this.x;
      const bottomTiles = tiley + tileHeight / 2 >= this.y + this.height && tilex + tileWidth > this.x && tilex - this.width < this.x;
      
      if (leftTiles) {
        if (leftCollide < tilex + tileWidth) leftCollide = tilex + tileWidth;
      };
      
      if (rightTiles) {
        if (rightCollide > tilex) rightCollide = tilex;
      };
      
      if (topTiles) {
        if (topCollide < tiley + tileHeight) topCollide = tiley + tileHeight;
      }
      
      if (bottomTiles) {
        if (bottomCollide > tiley) bottomCollide = tiley;
      };
    });
    
    
    
    if (newX <= leftCollide) {
      this.direction = (leftCollide - this.x) * (1 / dtmultiplier);
    };
    
    if ((newX) + this.width >= rightCollide) {
      this.direction = ((rightCollide - this.x) - this.width) * (1 / dtmultiplier);
    };
    
    if (newY <= topCollide) {
      this.vy = (topCollide - this.y) * (1 / dtmultiplier);
    };
    
    if (newY + this.height >= bottomCollide) {
      this.vy = ((bottomCollide - this.y) - this.height) * (1 / dtmultiplier);
    };
    
    if (this.vy == 0 && this.y + this.height == bottomCollide) this.onGround = true;
    else this.onGround = false;
    
    //update player coordinates
    this.x += this.direction * dtmultiplier;
    this.y += this.vy * dtmultiplier;
  };

  draw (context) {
    //sprite coordinates tracer
    context.fillStyle = ('red')
    //context.fillRect(this.x, this.y, this.width, this.height);
    this.playerAnimation(context)
  };
  
  playerAnimation (context) {
    let x = this.x;
    let y = this.y;
    let width = this.width;
    let height = this.height;
    
    const animation = this.playerStates[this.playerState];
    const frameIndex = Math.floor(this.gameFrame / this.staggerFrame) % animation.length;
    const currentFrame = animation[frameIndex];
    
    //for cutting image sprite and frame it to the sprite coodinates
    const framesCol = currentFrame.col;
    const framesRow = currentFrame.row;
    const offsetx = currentFrame.offsetx;
    const offsety = currentFrame.offsety;
    const stretchx = currentFrame.stretchx;
    const stretchy = currentFrame.stretchy;
    
    //used mainly overlapping to negative direction relatve to the sprite
    const translatex = currentFrame.translatex;
    const translatey = currentFrame.translatey;
    
    context.save();
    
    if (this.faceDirection == 'left') {
      context.translate(this.width, 0);
      context.scale(-1, 1);
      x = -x;
    };
    context.drawImage(this.image, 
    this.nextFrameX * framesCol + offsetx, this.nextFrameY * framesRow + offsety, this.playerCutx + stretchx, this.playerCuty + stretchy, 
    x + translatex, y + translatey, width + stretchx * this.playerScale, height + stretchy * this.playerScale);
    
    context.restore();
    
    if (this.gameFrame >= this.staggerFrame * animation.length) this.gameFrame = 0;
    this.gameFrame++;
  };
  
  playerStateAnimationHandler () {
    this.gameFrame = 0;
    this.staggerFrame = 5;
    this.faceDirection = 'right';
    this.playerState = 'idle';
    this.playerCutx = 16;
    this.playerCuty = 29;
    this.nextFrameX = 33;
    this.nextFrameY = 41;
    
    this.playerStates = {
      idle: [
        {col: 0, row: 0, offsetx: 2, offsety: 2, stretchx: 0, stretchy: 0, translatex: -5, translatey: 0}
      ],
      run: [
        {col: 0, row: 0, offsetx: 2, offsety: 2, stretchx: 2, stretchy: 0, translatex: -5, translatey: 0},
        {col: 1, row: 0, offsetx: 2, offsety: 2, stretchx: 2, stretchy: 0, translatex: -5, translatey: 0},
        {col: 2, row: 0, offsetx: 2, offsety: 3, stretchx: 2, stretchy: 0, translatex: -5, translatey: 0},
        {col: 1, row: 0, offsetx: 2, offsety: 2, stretchx: 2, stretchy: 0, translatex: -5, translatey: 0}
      ],
      jump: [
        {col: 13, row: 0, offsetx: 2, offsety: 2, stretchx: 4, stretchy: 0, translatex: -6, translatey: 0}
      ],
      swim: [
        {col: 8, row: 2, offsetx:2, offsety: 2, stretchx: 2, stretchy: 0, translatex: -9, translatey: 0},
        {col: 9, row: 2, offsetx: 2, offsety: 3, stretchx: 2, stretchy: 0, translatex:-9, translatey: 0},
        {col: 10, row: 2, offsetx: 2, offsety: 2, stretchx: 2, stretchy: 0, translatex:-9, translatey: 0},
        {col: 11, row: 2, offsetx: 2, offsety: 1, stretchx: 2, stretchy: 0, translatex: -9, translatey: 0},
        {col: 12, row: 2, offsetx: 2, offsety: 2, stretchx: 2, stretchy: 0, translatex: -9, translatey: 0}
      ]
    };
  };
};