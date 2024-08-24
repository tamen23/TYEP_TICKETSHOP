import React, { useEffect, useRef } from 'react';
import './Error.scss';

const ErrorPage = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];

    class Particle {
      constructor() {
        this.x = this.y = this.dx = this.dy = 0;
        this.reset();
      }

      reset() {
        this.y = Math.random() * height;
        this.x = Math.random() * width;
        this.dx = (Math.random() * 1) - 0.5;
        this.dy = (Math.random() * 0.5) + 0.5;
      }
    }

    const createParticles = (count) => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      createParticles((width * height) / 10000);
    };

    const updateParticles = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = '#f6f9fa';

      particles.forEach((particle) => {
        particle.y += particle.dy;
        particle.x += particle.dx;

        if (particle.y > height) {
          particle.y = 0;
        }

        if (particle.x > width) {
          particle.reset();
          particle.y = 0;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 5, 0, Math.PI * 2, false);
        ctx.fill();
      });

      requestAnimationFrame(updateParticles);
    };

    onResize();
    updateParticles();

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="error-content">
      <canvas ref={canvasRef} className="snow"></canvas>
      <div className="main-text">
        <h1>
        Bro you seems to lost .
          <br />
          get out of here.
        </h1>
        <a href="/" className="home-link">Hitch a ride back home.</a>
      </div>
      <div className="ground">
        <div className="mound">
          <div className="mound-text">404</div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
