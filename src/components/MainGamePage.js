import React, { useEffect, useRef } from 'react';

function MainGamePage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 400;

    const player = { x: 50, y: 300, width: 30, height: 30, speed: 3 }; 
    const shapes = [];
    const keys = {};
    let collectedShapes = 0;
    let timer = 10;
    let gameOver = false;
    let messageDisplayed = false;

    const playerImg = new Image();
    playerImg.src = process.env.PUBLIC_URL + '/icons/tortue.png';

    const medusImg = new Image();
    medusImg.src = process.env.PUBLIC_URL + '/icons/meduse.png';

    const sacImg = new Image();
    sacImg.src = process.env.PUBLIC_URL + '/icons/sac.png';

    const bouteilleImg = new Image();
    bouteilleImg.src = process.env.PUBLIC_URL + '/icons/bouteille.png';

    const protectedZone = { x: 0, y: 0, width: 150, height: 70 };

    function isInProtectedZone(x, y, size) {
      return (
        x - size / 2 < protectedZone.x + protectedZone.width &&
        x + size / 2 > protectedZone.x &&
        y - size / 2 < protectedZone.y + protectedZone.height &&
        y + size / 2 > protectedZone.y
      );
    }

    function isOverlapping(newShape) {
      for (let shape of shapes) {
        const distanceX = newShape.x - shape.x;
        const distanceY = newShape.y - shape.y;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance < newShape.size / 2 + shape.size / 2) {
          return true;
        }
      }
      return false;
    }

    function generateShapes() {
      for (let i = 0; i < 3; i++) {
        let shape;
        do {
          shape = {
            type: "medus",
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            size: 25,
          };
        } while (isOverlapping(shape) || isInProtectedZone(shape.x, shape.y, shape.size));
        shapes.push(shape);
      }

      for (let i = 0; i < 3; i++) {
        let shape;
        do {
          shape = {
            type: "bouteille",
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            size: 30,
          };
        } while (isOverlapping(shape) || isInProtectedZone(shape.x, shape.y, shape.size));
        shapes.push(shape);
      }

      for (let i = 0; i < 3; i++) {
        let shape;
        do {
          shape = {
            type: "sac",
            x: Math.random() * (canvas.width - 40) + 20,
            y: Math.random() * (canvas.height - 40) + 20,
            size: 25,
          };
        } while (isOverlapping(shape) || isInProtectedZone(shape.x, shape.y, shape.size));
        shapes.push(shape);
      }
    }

    generateShapes();

    function handleKeyDown(e) {
      if (!gameOver) {
        keys[e.key] = true;
      }
    }

    function handleKeyUp(e) {
      if (!gameOver) {
        keys[e.key] = false;
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    function movePlayer() {
      if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
      if (keys["ArrowDown"] && player.y + player.height < canvas.height) player.y += player.speed;
      if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
      if (keys["ArrowRight"] && player.x + player.width < canvas.width) player.x += player.speed;
    }

    function drawPlayer() {
      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    function drawShapes() {
      for (let shape of shapes) {
        let img;
        if (shape.type === "medus") img = medusImg;
        if (shape.type === "bouteille") img = bouteilleImg;
        if (shape.type === "sac") img = sacImg;
        ctx.drawImage(img, shape.x - shape.size / 2, shape.y - shape.size / 2, shape.size, shape.size);
      }
    }

    function checkCollisions() {
      for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        if (
          player.x < shape.x + shape.size / 2 &&
          player.x + player.width > shape.x - shape.size / 2 &&
          player.y < shape.y + shape.size / 2 &&
          player.y + player.height > shape.y - shape.size / 2
        ) {
          if (shape.type === "medus") {
            shapes.splice(i, 1);
            collectedShapes++;
          } else {
            if (!messageDisplayed) {
              messageDisplayed = true;
              gameOver = true;
            }
          }
        }
      }
    }

    function updateTimer() {
      if (timer > 0 && !gameOver) {
        timer--;
      } else if (timer === 0 && !gameOver) {
        gameOver = true;
        messageDisplayed = true;
      }
    }

    const timerInterval = setInterval(updateTimer, 1000);

    function drawHUD() {
      ctx.fillStyle = "white";
      ctx.font = "20px Inter, sans-serif";
      ctx.fillText(`Temps : ${timer}s`, 10, 20);
      ctx.fillText(`Formes : ${collectedShapes}/3`, 10, 50);
    }

    function drawGameOverMessage() {
      ctx.fillStyle = "#4A628A";
      ctx.font = "30px Inter, sans-serif";
      ctx.fillText("You are a robot 🤖", canvas.width / 3, canvas.height / 2);
    }

    function drawVictoryMessage() {
      const message = "Congratulations, you are a human! 😊";
      ctx.fillStyle = "#4dd599";
      ctx.font = "30px Inter, sans-serif";
      const textWidth = ctx.measureText(message).width;
      ctx.fillText(message, (canvas.width - textWidth) / 2, canvas.height / 2);
    }

    let animationFrameId;
    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (gameOver) {
        if (collectedShapes === 3) {
          drawVictoryMessage();
        } else {
          drawGameOverMessage();
        }
        return;
      }

      movePlayer();
      drawPlayer();
      drawShapes();
      checkCollisions();
      drawHUD();

      if (collectedShapes === 3) {
        drawVictoryMessage();
        gameOver = true;
        return;
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    playerImg.onload = () => {
      medusImg.onload = () => {
        sacImg.onload = () => {
          bouteilleImg.onload = () => {
            gameLoop();
          };
        };
      };
    };

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(timerInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div>
        <div id="instructions">
        <p>Collectez 3 méduse pour prouver que vous êtes humain !</p>
        <div className="game-container" style={{ backgroundImage: `url(${process.env.PUBLIC_URL + '/icons/ocean.png'})` }}>
      <canvas id="gameCanvas" ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
      
    </div>
      </div>
    </div>
    
  );
}

export default MainGamePage;
