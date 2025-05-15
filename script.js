const countsNeeded = 20;
let counts = 1;

const present = document.querySelector('.present');
const carouselContainer = document.querySelector('.carousel-container');

present.addEventListener('click', () => {
  counts += 1;
  present.style.setProperty('--count', Math.ceil(counts / 2));
  present.classList.add('animate');
  setTimeout(() => {
    present.classList.remove('animate');
  }, 300);

  if (counts >= countsNeeded) {
    present.classList.add('open');
    setTimeout(() => {
      carouselContainer.classList.add('active');
    }, 500);
  }
});

// Updated Carousel functionality with flip effect
const slides = document.querySelectorAll('.carousel-slide');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const resetBtn = document.querySelector('.reset-button');
let currentSlide = 0;

function showSlide(index) {
  // Hide all slides
  slides.forEach(slide => {
    slide.classList.remove('active');
  });
  
  // Show the current slide
  slides[index].classList.add('active');
}

// Add click event to each slide for flip effect
slides.forEach(slide => {
  slide.addEventListener('click', (e) => {
    // Prevent flipping when clicking on navigation buttons
    if (e.target.closest('.carousel-nav')) return;
    
    // Toggle the flipped class
    slide.classList.toggle('flipped');
  });
});

prevBtn.addEventListener('click', () => {
  // Reset flip state when changing slides
  slides[currentSlide].classList.remove('flipped');
  
  currentSlide--;
  if (currentSlide < 0) {
    currentSlide = slides.length - 1;
  }
  showSlide(currentSlide);
});

nextBtn.addEventListener('click', () => {
  // Reset flip state when changing slides
  slides[currentSlide].classList.remove('flipped');
  
  currentSlide++;
  if (currentSlide >= slides.length) {
    currentSlide = 0;
  }
  showSlide(currentSlide);
});

// Reset button functionality
resetBtn.addEventListener('click', () => {
  // Reset carousel
  slides.forEach(slide => {
    slide.classList.remove('flipped');
  });
  
  currentSlide = 0;
  showSlide(currentSlide);
  
  // Hide carousel
  carouselContainer.classList.remove('active');
  
  // Reset present box
  present.classList.remove('open');
  
  // Reset click counter
  counts = 1;
});

// Canvas background hearts and petals
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let width;
let height;
let lastNow;
let particles;
let maxParticles = 300;

const rand = (min, max) => min + Math.random() * (max - min);

class Heart {
  constructor() {
    this.spawn(true);
  }

  spawn(anyY = false) {
    this.x = rand(0, width);
    this.y = anyY === true
      ? rand(-50, height + 50)
      : rand(-50, -10);
    this.xVel = rand(-0.05, 0.05);
    this.yVel = rand(0.02, 0.1);
    this.angle = rand(0, Math.PI * 2);
    this.angleVel = rand(-0.001, 0.001);
    this.size = rand(3, 8);
    this.sizeOsc = rand(0.01, 0.5);
    this.opacity = rand(0.3, 0.9);
  }

  update(elapsed) {
    const xForce = rand(-0.001, 0.001);

    if (Math.abs(this.xVel + xForce) < 0.075) {
      this.xVel += xForce;
    }

    this.x += this.xVel * elapsed;
    this.y += this.yVel * elapsed;
    this.angle += this.angleVel * elapsed;

    if (
      this.y - this.size > height
      || this.x + this.size < 0
      || this.x - this.size > width
    ) {
      this.spawn();
    }

    this.render();
  }

  render() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;

    // Draw a heart shape
    ctx.beginPath();
    const size = this.size;
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(
      -size*2, -size*2, 
      -size*4, 0, 
      0, size*3
    );
    ctx.bezierCurveTo(
      size*4, 0, 
      size*2, -size*2, 
      0, 0
    );

    ctx.fillStyle = this.getColor();
    ctx.fill();
    ctx.restore();
  }

  getColor() {
    const colors = [
      '#ffcad4', // light pink
      '#f08080', // light coral
      '#e75480', // rose
      '#ff69b4', // hot pink
      '#ffffff', // white
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

// Create petals (similar to hearts but different shape)
class Petal {
  constructor() {
    this.spawn(true);
  }

  spawn(anyY = false) {
    this.x = rand(0, width);
    this.y = anyY === true
      ? rand(-50, height + 50)
      : rand(-50, -10);
    this.xVel = rand(-0.05, 0.05);
    this.yVel = rand(0.02, 0.08);
    this.angle = rand(0, Math.PI * 2);
    this.angleVel = rand(-0.001, 0.001);
    this.size = rand(4, 7);
    this.opacity = rand(0.5, 0.9);
  }

  update(elapsed) {
    const xForce = rand(-0.001, 0.001);

    if (Math.abs(this.xVel + xForce) < 0.075) {
      this.xVel += xForce;
    }

    this.x += this.xVel * elapsed;
    this.y += this.yVel * elapsed;
    this.angle += this.angleVel * elapsed;

    if (
      this.y - this.size > height
      || this.x + this.size < 0
      || this.x - this.size > width
    ) {
      this.spawn();
    }

    this.render();
  }

  render() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.opacity;

    // Draw a petal shape
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 2, this.size, 0, 0, Math.PI * 2);
    ctx.fillStyle = this.getColor();
    ctx.fill();
    ctx.restore();
  }

  getColor() {
    const colors = [
      '#ffffff', // white
      '#fff0f5', // lavender blush
      '#ffcad4', // light pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}

function render(now) {
  requestAnimationFrame(render);

  const elapsed = now - lastNow;
  lastNow = now;

  ctx.clearRect(0, 0, width, height);
  if (particles.length < maxParticles) {
    if (Math.random() > 0.6) {
      particles.push(new Heart());
    } else {
      particles.push(new Petal());
    }
  }

  particles.forEach((particle) => particle.update(elapsed, now));
}

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;

  canvas.width = width;
  canvas.height = height;

  maxParticles = Math.max(width / 10, 100);
}

function pause() {
  cancelAnimationFrame(render);
}

function resume() {
  lastNow = performance.now();
  requestAnimationFrame(render);
}

function init() {
  particles = [];
  resize();
  render(lastNow = performance.now());
}

window.addEventListener('resize', resize);
window.addEventListener('blur', pause);
window.addEventListener('focus', resume);

init();

// url action
const loveSymbols = ['💕', '💖', '💘', '💓', '💗', '💞', '❤️', '😘', '💋', '🌹'];

function loop() {
  loveSymbols.unshift(loveSymbols.pop());
  window.location.hash = loveSymbols.join();
  setTimeout(loop, 250);
}

loop();
