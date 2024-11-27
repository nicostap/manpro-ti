
const ball = document.getElementById("blurBall");
ballSize = 532;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Initial position of the ball
let posX = (screenWidth - ballSize*3);
let posY = (screenHeight - ballSize);
let directionX = Math.random() < 0.5 ? 1 : -1; 
let directionY = Math.random() < 0.5 ? 1 : -1; 


function moveBall() {
  posX += directionX * 2; 
  posY += directionY * 2;

  if (posX + ballSize> screenWidth-ballSize || posX < -ballSize*2) {
    directionX *= -1; 
  }
  if (posY + ballSize > screenHeight || posY < -ballSize) {
    directionY *= -1; 
  }

  
  ball.style.transform = `translate(${posX}px, ${posY}px)`;

  requestAnimationFrame(moveBall);
}


moveBall();

