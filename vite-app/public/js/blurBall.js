
const ball = document.getElementById("blurBall");
ballSize = 532;
const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

// Initial position of the ball
let posX = (screenWidth - ballSize*3);
let posY = (screenHeight - ballSize);
let directionX = Math.random() < 0.5 ? 1 : -1; // Random initial direction (left or right)
let directionY = Math.random() < 0.5 ? 1 : -1; // Random initial direction (up or down)

// Function to update ball position
function moveBall() {
  posX += directionX * 2; // Adjust speed here
  posY += directionY * 2;

  // Check for boundaries and reverse direction if needed
  if (posX + ballSize> screenWidth-ballSize || posX < -ballSize*2) {
    directionX *= -1; // Reverse X direction
  }
  if (posY + ballSize > screenHeight || posY < -ballSize) {
    directionY *= -1; // Reverse Y direction
  }

  // Apply the position to the ball
  ball.style.transform = `translate(${posX}px, ${posY}px)`;

  // Repeat the movement
  requestAnimationFrame(moveBall);
}

// Start moving the ball
moveBall();

