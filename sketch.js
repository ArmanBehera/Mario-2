var back1, backgroundImage;

var mario, marioDieAnimation, marioAnimation;

var obstacle, obstacleGroup, obstacleAnimation;
var brick, brickImage, brickGroup;
var ground;
var gameOver, gameOverImage;
var restart, restartImage;

var score = 0, highestScore = 0;

var gameState = "PLAY";

function preload(){

    // Loading the image of the background
    backgroundImage = loadImage("bg.png");

    // Loading the animation of the mario
    marioAnimation = loadAnimation("mario00.png", "mario02.png", "mario03.png")

    // The death animation of mario
    marioDieAnimation = loadAnimation("collided.png");

    // Loading the animation of obstacles
    obstacleAnimation = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png");

    // Loading the image of brick
    brickImage = loadImage("brick.png");

    gameOverImage = loadImage("gameOver.png");

    restartImage = loadImage("restart.png");
}

function setup(){

    imageMode(CENTER);

    createCanvas(800, 400);

    // Creating a sprite for the background
    back1 = createSprite(600, 200);
    backgroundImage.resize(1600, 400);
    back1.addImage(backgroundImage);
    back1.velocityX = -4;

    // Creating a sprite for mario
    mario = createSprite(100, 310);
    mario.addAnimation("Running", marioAnimation);
    mario.addAnimation("Dead", marioDieAnimation);
    mario.scale  = 2;
    mario.setCollider("rectangle", 0, 0, 20, mario.height);


    // Creating a sprite for the ground
    ground = createSprite(100, 350, 100, 10);
    ground.visible = false;

    gameOver = createSprite(400, 100);
    gameOver.addImage(gameOverImage);
    gameOver.visible = false;

    restart = createSprite(400, 150);
    restart.addImage(restartImage);
    restart.visible = false;
    restart.scale = 0.5;

    obstacleGroup = new Group();
    brickGroup = new Group();
    
}

function draw(){

    background("white");

    if (gameState === "PLAY"){

        obstacles();
        bricks();

        mario.changeAnimation("Running", marioAnimation);

        // Updating the score
        score  = score + Math.round(getFrameRate() / 60);

        if (back1.x < 0){

            back1.x  = back1.width/2;
        }

        if (keyDown("SPACE") && mario.y > 300){

            mario.velocityY = -13;
        }

        if (mario.isTouching(brickGroup)){

            brickGroup.destroyEach();
        }

        if (mario.isTouching(obstacleGroup)){

            gameState = "END";
        }

        drawSprites();

        textSize(20);
        fill("red");
        text ("Score : "+Math.round(score), 650, 100);
    }

    if (gameState === "END"){

        back1.velocityX = 0;

        brickGroup.setVelocityXEach(0);
        obstacleGroup.setVelocityXEach(0);

        brickGroup.setLifetimeEach(-1);
        obstacleGroup.setLifetimeEach(-1);

        gameOver.visible = true;
        restart.visible = true;

        if (mousePressedOver(restart)){

            restartGame();
        }

        if (score > highestScore){

            highestScore = Math.round(score);
        }
        
        mario.changeAnimation("Dead", marioDieAnimation);

        drawSprites();

        textSize(20);
        fill("red");
        text("Current Score : "+Math.round(score), 400, 250);
        text("Highest Score : "+highestScore, 400, 300);
    }

    mario.velocityY += 0.5;

    mario.collide(ground);

    console.log( "C "+frameCount);
    console.log("F "+getFrameRate());
}

function obstacles(){

    if (frameCount % 200 === 0){

        obstacle = createSprite(800, 320);
        obstacle.addAnimation("obstacles", obstacleAnimation);

        obstacle.lifetime = 400;
        obstacle.velocityX = -4;

        obstacleGroup.add(obstacle);
    }

}

function bricks(){

    if (frameCount % 250 === 0){

        var randY = Math.round(random(150, 250));

        brick = createSprite(800, randY);
        brick.addImage(brickImage);

        brick.lifetime = 400;
        brick.velocityX = -4;

        brickGroup.add(brick);
    }
}

function restartGame(){

    gameState = "PLAY";

    gameOver.visible = false;
    restart.visible = false;    

    brickGroup.destroyEach();
    obstacleGroup.destroyEach();

    back1.velocityX = -4;

    score = 0;
}