import React, { useRef, useEffect } from 'react';
import { Delaunay } from 'd3-delaunay';

const BALL_RADIUS = 5;
const REFERENCE_WIDTH = 892;
const REFERENCE_HEIGHT = 1500;
const REFERENCE_NUM_BALLS = 100;
const BALLS_PER_AREA = REFERENCE_NUM_BALLS / (REFERENCE_WIDTH * REFERENCE_HEIGHT);

function getNumBalls(width, height) {
  return Math.round(width * height * BALLS_PER_AREA) + 5;
}

class Ball {
  constructor(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fill();
    ctx.closePath();
  }

  update(width, height) {
    if (this.x + this.radius > width || this.x - this.radius < 0) {
      this.dx = -this.dx;
    }

    if (this.y + this.radius > height || this.y - this.radius < 0) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const numBalls = getNumBalls(canvas.width, canvas.height);
    console.log('numBalls', numBalls)

    const balls = Array.from({ length: numBalls }, () => {
      const x = Math.random() * (canvas.width - 2 * BALL_RADIUS) + BALL_RADIUS;
      const y = Math.random() * (canvas.height - 2 * BALL_RADIUS) + BALL_RADIUS;
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      return new Ball(x, y, dx, dy, BALL_RADIUS);
    });

    const drawVoronoi = (balls) => {
      const points = balls.map(ball => [ball.x, ball.y]);
      const delaunay = Delaunay.from(points);
      const voronoi = delaunay.voronoi([0, 0, canvas.width, canvas.height]);

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.lineWidth = 1;

      for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        voronoi.renderCell(i, ctx);
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach(ball => {
        ball.draw(ctx);
        ball.update(canvas.width, canvas.height);
      });

      drawVoronoi(balls);

      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className="App">
      <canvas ref={canvasRef} />
    </div>
  );
}

export default App;
