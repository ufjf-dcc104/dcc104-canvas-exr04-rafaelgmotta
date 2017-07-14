function Level (){
  this.sprites = [];
  this.predios = [];
  this.shots = [];
  this.inimigos = 1;
  this.enemyshots = [];
  this.cooldownSpawn = 4;
  this.placar = 0;
  this.normaVel = 60;
  this.gameOver = 0;
}

Level.prototype.init = function (w,h) {
  this.w = w;
  this.h = h;
  this.platCannon = new Sprite();
  this.platCannon.color = "orange";
  this.platCannon.x = this.w/2;
  this.platCannon.width = 32;
  this.platCannon.height = 112;
  this.platCannon.y = this.h-this.platCannon.height/3;


  var predio1 = new Sprite();
  predio1.x = this.w*0.1;
  predio1.vida = 100;
  predio1.width = 32;
  predio1.height = 48+64*Math.random();
  predio1.y = this.h-predio1.height/2;
  predio1.imgkey = "";
  this.predios.push(predio1);

  var predio2 = new Sprite()
  predio2.x = this.w*0.3;
  predio2.vida = 100;
  predio2.width = 32;
  predio2.height = 48+64*Math.random();
  predio2.y = this.h-predio2.height/2;
  predio2.imgkey = "";
  this.predios.push(predio2);

  var predio3 = new Sprite()
  predio3.x = this.w*0.7;
  predio3.vida = 100;
  predio3.width = 32;
  predio3.height = 48+64*Math.random();
  predio3.y = this.h-predio3.height/2;
  predio3.imgkey = "";
  this.predios.push(predio3);

  var predio4 = new Sprite()
  predio4.x = this.w*0.85;
  predio4.vida = 100;
  predio4.width = 32;
  predio4.height = 48+64*Math.random();
  predio4.y = this.h-predio4.height/2;
  predio4.imgkey = "";
  this.predios.push(predio4);
}



Level.prototype.mover = function (dt,w,h) {

    for (var i = this.sprites.length-1; i >=0 ; i--) {
      this.sprites[i].mover(dt);
  		if(this.sprites[i].x+this.sprites[i].width/2 > w) {
  			this.sprites[i].vx = -this.sprites[i].vx;
  			this.sprites[i].x = w-this.sprites[i].width/2;
  			
  		} else if(this.sprites[i].x-this.sprites[i].width/2 < 0) {
        this.sprites[i].vx = -this.sprites[i].vx;
        this.sprites[i].x = this.sprites[i].width/2;
      }
      if(this.sprites[i].y > h+100) {
        this.sprites.splice(i, 1);
  		}
    }
    for (var i = this.shots.length-1;i>=0; i--) {
      this.shots[i].moverAng(dt);
      if(
        this.shots[i].x >  3000 ||
        this.shots[i].x < -3000 ||
        this.shots[i].y >  3000 ||
        this.shots[i].y < -3000
      ){
        this.shots.splice(i, 1);
      }
    }
};


Level.prototype.desenhar = function (ctx) {
    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }
    for (var i = 0; i < this.shots.length; i++) {
      this.shots[i].desenhar(ctx);
    }
};

Level.prototype.desenharImg = function (ctx) {
    this.platCannon.desenhar(ctx)
    for (var i = 0; i < this.predios.length; i++) {
      this.predios[i].desenhar(ctx)
    }

    for (var i = 0; i < this.sprites.length; i++) {
      this.sprites[i].desenhar(ctx);
    }

    for (var i = 0; i < this.shots.length; i++) {
      this.shots[i].desenharImg(ctx, this.imageLib.images[this.shots[i].imgkey]);
    }
};

Level.prototype.colidiuCom = function (alvo, resolveColisao) {
    for (var i = 0; i < this.sprites.length; i++) {
      if(this.sprites[i].colidiuCom(alvo)){
        resolveColisao(this.sprites[i], alvo);
      }
    }
};



Level.prototype.fire = function (alvo){
  if(alvo.cooldown>0) return;
  var tiro = new Sprite();
  tiro.x = alvo.x;
  tiro.y = alvo.y;
  tiro.angle = alvo.angle+90;
  tiro.am = 350;
  tiro.ay = 0;
  tiro.g = 0;
  tiro.width = 8;
  tiro.height = 16;
  tiro.imgkey = "shot";
  this.shots.push(tiro);
  alvo.cooldown = 1;
  
}

Level.prototype.colidiuComTiros = function(){
  for(var i = this.shots.length-1; i>=0; i--){

    this.colidiuCom(this.shots[i],
      (
        function(that)
        {
          return function(alvo){
            alvo.color = "green";
            that.shots.splice(i,1);
            x = that.sprites.indexOf(alvo);
            that.sprites.splice(x, 1);
            that.placar += 1;
          }
        }
      )(this));
  }
}

Level.prototype.spawnInimigos = function(dt) {
    if(this.cooldownSpawn > 0) {
      this.cooldownSpawn -= dt;
      return;
    }
    var asteroid = new Sprite();
    var size = 1;
    var rand = Math.random();
    if(rand > 0.5) {
      size = 1.5;
    }
	  asteroid.size = size;
    asteroid.x = this.w*Math.random();
    asteroid.y = -10;
    asteroid.width = 24*size;
    asteroid.height = 24*size;
    asteroid.angle = 90;
    asteroid.color = "brown";
    asteroid.vx = 50-10*Math.random();
    if(rand > 0.5) {
      asteroid.vx = -asteroid.vx;
    }
    var vy2 = (this.normaVel*this.normaVel)-(asteroid.vx*asteroid.vx);
	  asteroid.vy = Math.sqrt(vy2); 
    
    this.sprites.push(asteroid);
    this.cooldownSpawn = 1;
}

Level.prototype.colidiuComPredios = function () {
  for(var i = this.predios.length-1; i>=0; i--){

    this.colidiuCom(this.predios[i],
      (
        function(that)
        {
          return function(alvo){

            var decrease = 25*alvo.size;
            that.predios[i].vida-= decrease; 

            that.predios[i].height -= that.predios[i].height * (decrease/100);
            that.predios[i].y += that.predios[i].height * (decrease/100);
            if(that.predios[i].vida <= 0) {
              that.predios[i]=new Sprite();
              //that.predios.splice(i,1);
              that.predios[i].vida = 0;
              that.predios[i].x = -50;
              that.predios[i].y = -50;
            }
            x = that.sprites.indexOf(alvo);
            that.sprites.splice(x, 1);
          
          }
        }
      )(this));
  }
};


Level.prototype.desenharInfo = function(ctx) {

	ctx.fillText("Pontos: " + this.placar, 340,10);
	ctx.fillText("Vida: ", 170,20);
  var totalLife=0;
	for(var i = 0; i < this.predios.length; i++) {
		ctx.fillStyle = "blue";
		ctx.fillText(" " + (i+1) + ": " + this.predios[i].vida, 200+50*i, 20);
    totalLife+=this.predios[i].vida;
	}
  if (totalLife==0){
    ctx.font ="bold 25px Arial";
    ctx.fillText(" Cidade destruída: Game Over", 10, 250);
    this.gameOver = 1;
  }
      

      
}
