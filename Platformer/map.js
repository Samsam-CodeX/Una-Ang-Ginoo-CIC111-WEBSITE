export class GameMap {
  constructor (game, map) {
    this.game = game;
    
    this.tilesize = 35;
    this.scrollx = 0;
    this.scrolly = 0;
    this.scrollSpeedx = 0;
    
    this.image = document.getElementById('tiles');
    this.tilesHandler();
    
    this.map = map;
    this.currentMap = 'map3';
    this.mapSetup();
  };
  
  update(deltaTime, player) {
    const dtmultiplier = deltaTime / 16.6666666667;
    
    //maps scroll thing
    if (this.scrollApplicable()) {
      this.scrollSpeedx = -player.direction * dtmultiplier;
      const rightEdgeLimit_Scrollx = -(this.tilesize * this.lastIndex + this.offsetx - (this.game.width - this.tilesize));
      const leftEdgeLimit_Scrollx = 0 - this.offsetx;
      const centerPoint = this.game.width * 0.50 - player.width / 2;
      const scrollCenterDifference = (player.x - player.width / 2) - this.game.width / 2;
      if (player.x < centerPoint && player.direction <= 0 && this.scrollx < leftEdgeLimit_Scrollx) {
        player.x += this.scrollSpeedx;
        this.scrollx += this.scrollSpeedx;
      } else if (player.x > centerPoint && this.scrollx > rightEdgeLimit_Scrollx) {
        player.x += this.scrollSpeedx;
        this.scrollx += this.scrollSpeedx;
      };
      if (this.scrollx > leftEdgeLimit_Scrollx) this.scrollx = leftEdgeLimit_Scrollx;
      else if (this.scrollx < rightEdgeLimit_Scrollx) this.scrollx = rightEdgeLimit_Scrollx;
    };
    
    // if (true) {
    //   const scrollSpeedy = -player.vy * dtmultiplier;
    //   this.scrolly += scrollSpeedy;
    //   player.y += scrollSpeedy;
    // };
  };
  
  drawLand(context) {
    this.mapTiles.forEach(tile => {
      //console.log('lag simulator', 'another lag', 'and another lag thing')
      if (this.watertiles.some(waterTile => tile.tilename == waterTile)) return;
      const sx = tile.cutx;
      const sy = tile.cuty;
      const sw = tile.cutWidth;
      const sh = tile.cutHeight;
      const dx = Math.floor(tile.x + this.scrollx);
      const dy = Math.floor(tile.y + this.scrolly);
      const dw = Math.floor(this.tilesize * (tile.cutWidth / this.standardCutLength));
      const dh = Math.floor(this.tilesize * (tile.cutHeight / this.standardCutLength));
      context.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);
    });
  };
  
  drawWater(context) {
    this.mapTiles.forEach(tile => {
      if (!this.watertiles.some(waterTile => tile.tilename == waterTile)) return;
      const sx = tile.cutx;
      const sy = tile.cuty;
      const sw = tile.cutWidth;
      const sh = tile.cutHeight;
      const dx = Math.floor(tile.x + this.scrollx);
      const dy = Math.floor(tile.y + this.scrolly);
      const dw = Math.floor(this.tilesize * (tile.cutWidth / this.standardCutLength));
      const dh = Math.floor(this.tilesize * (tile.cutHeight / this.standardCutLength));
      context.drawImage(this.image, sx, sy, sw, sh, dx, dy, dw, dh);
    });
  };
  
  mapSetup() {
    switch (this.currentMap) {
      case 'map1':
        this.offsetx = -100;
        this.offsety = 10;
        break;
      case 'map2':
        this.offsetx = 200;
        this.offsety = 0;
        break;
      case 'map3':
        this.offsetx = 0;
        this.offsety = 3;
        break;
      default:
        this.offsetx = 0;
        this.offsety = 0;
    };
    
    //read map: get last column index  ||  create tiles coordinates info (array of objects)
    
    this.mapTiles = [];
    this.lastIndex = 0;
    
    const map = this.map[this.currentMap].toString().trim().split('\n');
    map.forEach((r, rowIndex) => {
      const row = r.trim().split(',').map(c => c.trim()).filter(c => c !== '');
      row.forEach((col, columnIndex) => {
        
        const currentTile = this.tiletype[col];
        if (!currentTile) return;
        if (this.lastIndex < columnIndex) this.lastIndex = columnIndex;
        
        this.mapTiles.push({
          tilename: col,
          x: this.tilesize * columnIndex + this.offsetx,
          y: this.game.height - this.tilesize * (map.length - rowIndex) + this.offsety,
          cutx: currentTile.x,
          cuty: currentTile.y,
          cutWidth: currentTile.width,
          cutHeight: currentTile.height
        });
      });
    });
  };
  
  tilesHandler() {
    this.standardCutLength = 93;
    this.watertiles = ['17', '18'];
    this.tiletype = {
      1: {x: 123, y: 24, width: 93, height: 93},
      2: {x: 231, y: 24, width: 93, height: 93},
      3: {x: 336, y: 24, width: 93, height: 93},
      4: {x: 123, y: 129, width: 93, height: 93},
      5: {x: 231, y: 129, width: 93, height: 93},
      6: {x: 336, y: 129, width: 93, height: 93},
      7: {x: 123, y: 237, width: 93, height: 93},
      8: {x: 231, y: 237, width: 93, height: 93},
      9: {x: 336, y: 237, width: 93, height: 93},
      10: {x: 123, y: 341, width: 93, height: 70},
      11: {x: 231, y: 341, width: 93, height: 70},
      12: {x: 336, y: 341, width: 93, height: 70},
      13: {x: 18, y: 237, width: 93, height: 93},
      14: {x: 18, y: 341, width: 93, height: 93},
      15: {x: 442, y: 237, width: 93, height: 93},
      16: {x: 442, y: 341, width: 93, height: 93},
      17: {x: 442, y: 24, width: 93, height: 93},
      18: {x: 442, y: 129, width: 93, height: 93}
    };
  };
  
  scrollApplicable() {
    return this.tilesize * this.lastIndex + this.tilesize > this.game.width;
  };
  
};