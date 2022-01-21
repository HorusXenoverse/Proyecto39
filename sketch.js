var ground, groundImage, invisibleGround;
var trex, trex_running, trex_collide;
var cloud, cloudImage;
var ptero, ptero_fly; 
var pteroGroup;
var edges;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score;
var gameState="START"; 
var gameOver, restart, gameOverImg, restartImg;
var daynight = 1;
var moon, moonImg;

//Precarga de Imágenes 
function preload(){
//Animación de Trex corriendo
trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
//Animación de Trex colisionando
  trex_collide = loadAnimation("trex_collided.png");
//Precarga de Pterodáctilos  
//Animación de Pterodáctilos volando
  ptero_fly = loadAnimation("ptero_a.png","ptero_b.png","ptero_c.png","ptero_d.png");
//Precarga de imagen del suelo 
groundImage = loadImage("ground2.png");
//Precarga de imagen de nubes
cloudImage = loadImage("cloud.png");
//Precarga de imagen de cactus 
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
//Precarga de imagen gameOver o End
  gameOverImg = loadImage("gameOver.png");
//Precarga de imagen reinicio o restart
  restartImg = loadImage("restart.png");
//Precarga de la imagen de Luna
 moonImg = loadImage("moon.png");

}

//Función configuración del juego Trex
function setup() {
//Ajusto mi tamaño de area de juego
  createCanvas(windowWidth, windowHeight);
   //grupos utilizados en el juego (nubes,cactus y pteros)
   cloudGroup = new Group();
   obsGroup = new Group();
   pteroGroup = new Group();
   //creamos sprite del Trex
   trex = createSprite(50,180,20,50);
   //Animación del Trex corriendo
   trex.addAnimation("running", trex_running);
  //Radio colisionador
   trex.setCollider("circle", 0,0,40);
  //Agregamos animación de ojitos al chocar
   trex.addAnimation("collided",trex_collide);
  //agrego scale y posición al Trex
  trex.scale = 0.2;
  trex.x = 50
  //Suelo
  ground = createSprite(200,380,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  //Suelo invisible
  groundInvisible = createSprite(200,393,400,10);
  groundInvisible.visible = false;
  //Creo bordes del area de juego
  edges=createEdgeSprites();
  //Inicializo marcador igual a cero
  score =0;
  //Sprites e Imágenes de Reiniciar & gameOver
  gameOver = createSprite(700,200);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(700,240);
  restart.addImage(restartImg);
  //Establecer scale de imágenes de Restart y gameOver
  gameOver.scale = 0.4;
  restart.scale = 0.3;
   
  //Scale para la imagen de gameOver y reiniciar
   gameOver.scale = 0.4;
   restart.scale = 0.3;
  
  //Propiedad de visibilidad de reiniciar y gameOver
   gameOver.visible=false;
   restart.visible=false;
  
  //Creo sprite de la Luna
  moon = createSprite(width+50,120,20,20);
  //Agrego imagen al sprite de la Luna
  moon.addImage(moonImg);
  //Scale para la Luna
  moon.scale=0.2;
  
}


function draw() {
  
   //Color de fondo para día
   if(daynight===1){
      background("brown");
     }
   //Si es de noche
   if(daynight===2){
   night();
     }
   
  fill("aqua");
  stroke("black");
  textSize(40);
  text("Puntuación: "+score, 500,80);
   
  //Fondo infinito
  if(ground.x<0){
     ground.x = ground.width/2;
     }
    
 //Aumentar velocidad del suelo
  if(gameState==="START"){
      ground.velocityX=-(3+score/1000);
      score = score + Math.round((frameCount/100));
   
  //Condición aparecen los pteros
  if(frameCount%1000===0 ){
       ptero();
    }
    
  //Contar cuadros para volver el juego de noche
  if(frameCount%1500===0 ){
       daynight=2;
    }
    
    //Que salte el Trex con la barra espaciadora apretada
      if((keyDown("space"))&& trex.y>=300) {
        trex.velocityY = -10;
        }

    //Velocidad en Y del Trex
      trex.velocityY = trex.velocityY + 0.8
  
    //Llamamos funciones de aparecer nubes y obstáculos
      spawnClouds();
      obstacles();
    
   
    //Si Trex toca algun obstáculo o algún Ptero, entonces es gameOver o End, es decir termina el juego.
     if(trex.isTouching(obsGroup)||trex.isTouching(pteroGroup)){
        gameState="END";
       
        }
  }
  
  //Si el gameState es gameOver o END
  if(gameState==="END"){
     ground.velocityX=0;
     trex.velocityY = 0;
    
    //Animación de los ojitos
    trex.changeAnimation("collided",trex_collide);
    
    //Lifetime modificado para que ningún grupo desaparezcan
     obsGroup.setLifetimeEach(-1);
     cloudGroup.setLifetimeEach(-1);
    //Velocidad en cero para ambos grupos en gameState igual a End o GameOver
     obsGroup.setVelocityXEach(0);
     cloudGroup.setVelocityXEach(0);
    //Propiedad de visibilidad para imagenes de reinicio y gameOver
     gameOver.visible = true;
     restart.visible = true;
  }
   //Para que no se caiga del suelo mi Trex.
    trex.collide(groundInvisible);
   //Dibujo todos los sprites del programa
  
  //Pintar todos los sprites del juego
  drawSprites();
}

//Función aparece nubes
function spawnClouds(){
  if(frameCount%60===0){
    cloud = createSprite(width,10,40,10);
    cloud.addImage(cloudImage);
    cloud.y = Math.round(random(10,60));
    cloud.scale= 0.7;
    cloud.velocityX = -3;
    //Ajuste profundidad de nubes con Trex
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime=700;
    cloudGroup.add(cloud);
  }
 
}
//Función Aparece cactus u obstáculos.
function obstacles(){
  //Si el numero de cuadros módulo 120, su residuo es igual a cero (múltiplo de 120), crear sprite para el cactus
  if (frameCount % 120 === 0) {
    obstacle = createSprite(width,365,10,40);
    obstacle.velocityX = -(3+score/1000);
    //obstacle.velocityX = -(6+score/100); 
   
    //Variable para que la compu almacene un número al azar del 1 al 6 y asigne una imagen distinta de cactus en cada caso.
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      case 3:
        obstacle.addImage(obstacle3);
        break;
      case 4:
        obstacle.addImage(obstacle4);
        break;
      case 5:
        obstacle.addImage(obstacle5);
        break;
      case 6:
        obstacle.addImage(obstacle6);
        break;
      default: 
        break;
    }
    //Asignar scale y lifetime
    obstacle.scale=0.4;
    obstacle.lifetime=700; 
    
    //agregar obstaculos o cactus al grupo
   obsGroup.add(obstacle);
    }
}

//Función pterodáctilo
function ptero(){
  //sacar estos aleatorios
  var ptero = createSprite(width,0,20,50);
  ptero.addAnimation("fly", ptero_fly);
  ptero.scale=0.5;
  ptero.velocityX=-1.3;
  ptero.velocityY=0.4;
  //Agrego al grupo de pteros
  pteroGroup.add(ptero);
}

//Función volver de noche
function night(){
   background("black");
   moon.velocityX=-3;
   moon.velocityY=-1;
       
  if(moon.x<width/2){
      moon.velocityY=0.5;
  }
  
  if(moon.x<0){
      daynight=1;
      moon.x=width+50;
      moon.velocityX=0;
      moon.velocityY=0;
  }
}
