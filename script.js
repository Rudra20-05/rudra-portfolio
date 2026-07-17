/* ===================================================
   RUDRA DALVI — PORTFOLIO JAVASCRIPT
   Animations, Particles, Interactions
   =================================================== */

import { Renderer, Program, Mesh, Color, Triangle } from 'https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm';

const vertexShader = `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}
`;

const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

function initGalaxy() {
  const ctn = document.getElementById('galaxyBg');
  if (!ctn) return;

  const transparent = true;
  const focal = [0.5, 0.5];
  const rotation = [1.0, 0.0];
  const starSpeed = 0.5;
  const density = 1.0;
  const hueShift = 140.0;
  const disableAnimation = false;
  const speed = 1.0;
  const mouseInteraction = true;
  const glowIntensity = 0.3;
  const saturation = 0.0;
  const mouseRepulsion = true;
  const repulsionStrength = 2.0;
  const twinkleIntensity = 0.3;
  const rotationSpeed = 0.1;
  const autoCenterRepulsion = 0.0;

  const targetMousePos = { x: 0.5, y: 0.5 };
  const smoothMousePos = { x: 0.5, y: 0.5 };
  let targetMouseActive = 0.0;
  let smoothMouseActive = 0.0;

  const renderer = new Renderer({
    alpha: transparent,
    premultipliedAlpha: false
  });
  const gl = renderer.gl;

  if (transparent) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
  } else {
    gl.clearColor(0, 0, 0, 1);
  }

  let program;

  function resize() {
    renderer.setSize(ctn.offsetWidth, ctn.offsetHeight);
    if (program) {
      program.uniforms.uResolution.value = new Color(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height
      );
    }
  }
  window.addEventListener('resize', resize, false);
  resize();

  const geometry = new Triangle(gl);
  program = new Program(gl, {
    vertex: vertexShader,
    fragment: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uResolution: {
        value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height)
      },
      uFocal: { value: new Float32Array(focal) },
      uRotation: { value: new Float32Array(rotation) },
      uStarSpeed: { value: starSpeed },
      uDensity: { value: density },
      uHueShift: { value: hueShift },
      uSpeed: { value: speed },
      uMouse: {
        value: new Float32Array([smoothMousePos.x, smoothMousePos.y])
      },
      uGlowIntensity: { value: glowIntensity },
      uSaturation: { value: saturation },
      uMouseRepulsion: { value: mouseRepulsion },
      uTwinkleIntensity: { value: twinkleIntensity },
      uRotationSpeed: { value: rotationSpeed },
      uRepulsionStrength: { value: repulsionStrength },
      uMouseActiveFactor: { value: 0.0 },
      uAutoCenterRepulsion: { value: autoCenterRepulsion },
      uTransparent: { value: transparent }
    }
  });

  const mesh = new Mesh(gl, { geometry, program });
  let animateId;

  function update(t) {
    animateId = requestAnimationFrame(update);
    if (!disableAnimation) {
      program.uniforms.uTime.value = t * 0.001;
      program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0;
    }

    const lerpFactor = 0.05;
    smoothMousePos.x += (targetMousePos.x - smoothMousePos.x) * lerpFactor;
    smoothMousePos.y += (targetMousePos.y - smoothMousePos.y) * lerpFactor;
    smoothMouseActive += (targetMouseActive - smoothMouseActive) * lerpFactor;

    program.uniforms.uMouse.value[0] = smoothMousePos.x;
    program.uniforms.uMouse.value[1] = smoothMousePos.y;
    program.uniforms.uMouseActiveFactor.value = smoothMouseActive;

    renderer.render({ scene: mesh });
  }
  animateId = requestAnimationFrame(update);
  ctn.appendChild(gl.canvas);

  function handleMouseMove(e) {
    const rect = ctn.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1.0 - (e.clientY - rect.top) / rect.height;
    targetMousePos.x = x;
    targetMousePos.y = y;
    targetMouseActive = 1.0;
  }

  function handleMouseLeave() {
    targetMouseActive = 0.0;
  }

  if (mouseInteraction) {
    ctn.addEventListener('mousemove', handleMouseMove);
    ctn.addEventListener('mouseleave', handleMouseLeave);
  }

  // Handle cleanup if needed
  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(animateId);
    window.removeEventListener('resize', resize);
    if (mouseInteraction) {
      ctn.removeEventListener('mousemove', handleMouseMove);
      ctn.removeEventListener('mouseleave', handleMouseLeave);
    }
    try {
      ctn.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch(e) {}
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Init WebGL background
  initGalaxy();

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    });

    // Smooth ring follow
    function animateCursorRing() {
        ringX += (mouseX - ringX) * 0.12;
        ringY += (mouseY - ringY) * 0.12;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
        requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    const hoverElements = document.querySelectorAll('a, button, .project-showcase, .bento-card, .magnetic');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.classList.add('hovering');
            cursorRing.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.classList.remove('hovering');
            cursorRing.classList.remove('hovering');
        });
    });


    // ===== NAVBAR SCROLL EFFECT =====
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });


    // ===== ACTIVE NAV LINK HIGHLIGHT =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const chRailItems = document.querySelectorAll('.chapter-rail-item');

    function updateActiveLink() {
        const scrollY = window.pageYOffset + 250;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                // Update navbar links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
                // Update vertical chapter rail items
                chRailItems.forEach(item => {
                    item.classList.remove('is-active');
                    if (item.getAttribute('data-section') === sectionId) {
                        item.classList.add('is-active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);


    // ===== MOBILE MENU =====
    const menuBtn = document.getElementById('menuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ===== SCROLL REVEAL ANIMATIONS =====
    const allRevealElements = document.querySelectorAll('.reveal-up, .mask-reveal, .reveal-left, .reveal-right');
    const revealElements = Array.from(allRevealElements).filter(el => !el.classList.contains('project-row'));

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                entry.target.classList.remove('revealed');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -100px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Specific Observer for Projects to trigger animations only when they are well in view
    const projectRows = document.querySelectorAll('.project-row');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            } else {
                const rect = entry.boundingClientRect;
                if (rect.top > 0) {
                    entry.target.classList.remove('revealed');
                }
            }
        });
    }, {
        threshold: 0.35, // Requires 35% of the project row to be visible
        rootMargin: '0px 0px -25% 0px' // Requires it to enter 25% of the viewport height
    });

    projectRows.forEach(row => projectObserver.observe(row));


    // ===== TYPED TEXT EFFECT =====
    const typedTextEl = document.getElementById('typedText');
    if (typedTextEl) {
        const phrases = [
            'Full Stack Developer',
            'ML Enthusiast',
            'Python & React Developer',
            'Problem Solver',
            'UI/UX Lover'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 80;

        function typeEffect() {
            const currentPhrase = phrases[phraseIndex];

            if (!isDeleting) {
                typedTextEl.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentPhrase.length) {
                    isDeleting = true;
                    typingSpeed = 2000; // Pause at end
                } else {
                    typingSpeed = 80;
                }
            } else {
                typedTextEl.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 400; // Pause before next word
                } else {
                    typingSpeed = 40;
                }
            }

            setTimeout(typeEffect, typingSpeed);
        }

        typeEffect();
    }


    // ===== STAT COUNTER ANIMATION =====
    const statNumbers = document.querySelectorAll('.stat-number');

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                statObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => statObserver.observe(el));

    function animateCounter(element, target) {
        let current = 0;
        const duration = 1500;
        const stepTime = duration / target;

        const timer = setInterval(() => {
            current++;
            element.textContent = current;
            if (current >= target) {
                clearInterval(timer);
            }
        }, stepTime);
    }


    // ===== HERO PARTICLE CONSTELLATION =====
    const particlesContainer = document.getElementById('heroParticles');
    if (particlesContainer) {
        const particles = [];
        const particleCount = 60;
        const connectionDistance = 120;

        class Particle {
            constructor() {
                this.x = Math.random() * window.innerWidth;
                this.y = Math.random() * window.innerHeight;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
                this.opacity = Math.random() * 0.5 + 0.1;

                this.el = document.createElement('div');
                this.el.className = 'particle';
                this.el.style.width = this.size + 'px';
                this.el.style.height = this.size + 'px';
                this.el.style.opacity = this.opacity;
                particlesContainer.appendChild(this.el);
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > window.innerWidth) this.vx *= -1;
                if (this.y < 0 || this.y > window.innerHeight) this.vy *= -1;

                this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
            }
        }

        // Create SVG for connection lines
        const svgNS = 'http://www.w3.org/2000/svg';
        const linesSvg = document.createElementNS(svgNS, 'svg');
        linesSvg.setAttribute('class', 'particle-line');
        linesSvg.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;';
        particlesContainer.appendChild(linesSvg);

        // Init particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        const lines = [];
        for (let i = 0; i < 80; i++) {
            const line = document.createElementNS(svgNS, 'line');
            line.setAttribute('stroke', 'rgba(255,255,255,0.04)');
            line.setAttribute('stroke-width', '1');
            linesSvg.appendChild(line);
            lines.push(line);
        }

        function animateParticles() {
            particles.forEach(p => p.update());

            let lineIndex = 0;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    if (lineIndex >= lines.length) break;
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = (1 - dist / connectionDistance) * 0.08;
                        lines[lineIndex].setAttribute('x1', particles[i].x);
                        lines[lineIndex].setAttribute('y1', particles[i].y);
                        lines[lineIndex].setAttribute('x2', particles[j].x);
                        lines[lineIndex].setAttribute('y2', particles[j].y);
                        lines[lineIndex].setAttribute('stroke', `rgba(255,255,255,${opacity})`);
                        lines[lineIndex].style.display = 'block';
                        lineIndex++;
                    }
                }
            }

            // Hide unused lines
            for (let i = lineIndex; i < lines.length; i++) {
                lines[i].style.display = 'none';
            }

            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }


    // ===== MAGNETIC BUTTON EFFECT =====
    const magneticBtns = document.querySelectorAll('.magnetic');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });


    // ===== COPY EMAIL =====
    const copyEmailBtn = document.getElementById('copyEmailBtn');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const email = copyEmailBtn.getAttribute('data-email');
            navigator.clipboard.writeText(email).then(() => {
                const span = copyEmailBtn.querySelector('span');
                const originalText = span.textContent;
                span.textContent = 'Copied! ✓';
                copyEmailBtn.style.borderColor = '#22c55e';
                copyEmailBtn.style.color = '#22c55e';

                setTimeout(() => {
                    span.textContent = originalText;
                    copyEmailBtn.style.borderColor = '';
                    copyEmailBtn.style.color = '';
                }, 2000);
            });
        });
    }


    // ===== CONTACT FORM (FORMSPREE) =====
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const submitBtn = document.getElementById('submitBtn');
        const btnSpan = submitBtn.querySelector('span');
        const originalText = btnSpan.textContent;

        btnSpan.textContent = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);

        fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        })
        .then(response => {
            if (response.ok) {
                btnSpan.textContent = 'Message Sent! ✓';
                submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                contactForm.reset();

                setTimeout(() => {
                    btnSpan.textContent = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Failed');
            }
        })
        .catch(error => {
            btnSpan.textContent = 'Error — Try Again';
            submitBtn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';

            setTimeout(() => {
                btnSpan.textContent = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
            }, 3000);
        });
    });


    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.offsetTop - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ===== PARALLAX ON ASTRONAUT =====
    const astronaut = document.querySelector('.astronaut-wrapper');

    if (astronaut) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            if (scrolled < window.innerHeight) {
                const parallax = scrolled * 0.2;
                astronaut.style.marginTop = `${parallax}px`;
            }
        });
    }


    // ===== PAGE LOADER =====
    const pageLoader = document.getElementById('pageLoader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 1400);
    });


    // ===== FLASHLIGHT NIGHT-VISION MODE =====
    const themeToggle = document.getElementById('themeToggle');
    const flashlightOverlay = document.getElementById('flashlightOverlay');
    let flashlightActive = false;

    // Check saved preference
    if (localStorage.getItem('rd-flashlight') === 'on') {
        document.body.classList.add('flashlight-active');
        flashlightActive = true;
    }

    themeToggle.addEventListener('click', () => {
        flashlightActive = !flashlightActive;
        document.body.classList.toggle('flashlight-active', flashlightActive);
        localStorage.setItem('rd-flashlight', flashlightActive ? 'on' : 'off');
    });

    // Update flashlight spotlight position on mouse move
    document.addEventListener('mousemove', (e) => {
        if (flashlightOverlay) {
            flashlightOverlay.style.setProperty('--spot-x', e.clientX + 'px');
            flashlightOverlay.style.setProperty('--spot-y', e.clientY + 'px');
        }
    });


    // ===== FLOATING CONTACT FAB =====
    const fabContact = document.getElementById('fabContact');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > window.innerHeight * 0.6) {
            fabContact.classList.add('visible');
        } else {
            fabContact.classList.remove('visible');
        }
    });

    fabContact.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const top = contactSection.offsetTop - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });





    // ===== AI CHATBOT =====
    const chatbotWidget = document.getElementById('chatbotWidget');
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotPanel = document.getElementById('chatbotPanel');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');

    // Toggle chat panel (guarded — chatbot may not exist on page)
    if (chatbotToggle) chatbotToggle.addEventListener('click', () => {
        chatbotWidget.classList.toggle('open');
        if (chatbotWidget.classList.contains('open')) {
            setTimeout(() => chatbotInput.focus(), 400);
        }
    });

    // Knowledge base
    const knowledge = [
        {
            triggers: ['hi', 'hello', 'hey', 'sup', 'yo', 'greetings', 'hola'],
            response: "Hey there! 👋 I'm Rudra's AI assistant. You can ask me about his skills, projects, education, or how to get in touch!"
        },
        {
            triggers: ['who', 'about', 'tell me', 'introduce', 'yourself', 'rudra'],
            response: "Rudra Dalvi is a Full Stack Developer & AI/ML Engineer from Mumbai, India. He's currently pursuing B.E. in Information Technology at Vidyalankar Institute of Technology (2023-2027). He's passionate about building intelligent web apps that blend clean code with machine learning! 🚀"
        },
        {
            triggers: ['skill', 'tech', 'stack', 'technology', 'know', 'programming', 'language', 'tools', 'arsenal'],
            response: "Rudra's tech arsenal includes:\n🐍 Python (Flask, TensorFlow, Keras, Scikit-learn)\n⚛️ React.js\n🟨 JavaScript\n📦 Node.js\n🔀 Git & GitHub\n🧠 Machine Learning & AI\n🌐 HTML & CSS\nHe's strongest in full-stack development with ML integration!"
        },
        {
            triggers: ['project', 'work', 'built', 'portfolio', 'made', 'create'],
            response: "Rudra has built some cool projects:\n\n❤️ Heart Disease Predictor — ANN-based prediction system with TensorFlow, Flask API, and React frontend with probability gauges.\n\n📅 College Event Management — Full-stack platform for college festivals with Node.js backend.\n\n📚 Study Genie AI — AI-powered study companion that generates summaries, flashcards & quizzes using language models.\n\nCheck them out in the Projects section! ⬆️"
        },
        {
            triggers: ['heart', 'disease', 'predictor', 'health'],
            response: "The Heart Disease Predictor is an ANN-based system that predicts heart disease risk using 13 clinical parameters. It features a probability gauge, risk-level badges, and personalized health recommendations. Built with Python, TensorFlow, Flask, React, and Scikit-learn! ❤️🔬"
        },
        {
            triggers: ['event', 'management', 'college', 'festival'],
            response: "The College Event Management System is a full-featured platform for VIT's college festivals. It handles event creation, registration, scheduling, and participant tracking with an intuitive admin dashboard. Built with HTML, CSS, JavaScript, and Node.js! 📅"
        },
        {
            triggers: ['study', 'genie', 'ai study', 'flashcard', 'quiz'],
            response: "Study Genie AI is an AI-powered study companion that helps students generate summaries, flashcards, and quizzes from their notes and documents. It uses advanced language models through a Python backend and React.js frontend! 📚✨"
        },
        {
            triggers: ['education', 'college', 'university', 'degree', 'study', 'school', 'vit'],
            response: "Rudra is pursuing his B.E. in Information Technology from Vidyalankar Institute of Technology, Mumbai (2023-2027). He started with frontend basics in 2023, moved to React & backend in 2024, and dove into ML & full-stack projects in 2025! 🎓"
        },
        {
            triggers: ['contact', 'email', 'reach', 'hire', 'connect', 'talk', 'message'],
            response: "You can reach Rudra at:\n📧 dalvi.rudra1976@gmail.com\n💼 LinkedIn: linkedin.com/in/rudra-dalvi-7379bb331\n🐙 GitHub: github.com/Rudra20-05\n\nOr just scroll down to the Contact section and send a message! He's always open to new opportunities. 🤝"
        },
        {
            triggers: ['location', 'where', 'city', 'country', 'live', 'based'],
            response: "Rudra is based in Mumbai, India 🇮🇳 (IST, UTC+5:30). He's open to remote work worldwide! 🌍"
        },
        {
            triggers: ['experience', 'work experience', 'intern', 'job'],
            response: "Rudra is currently focused on his studies and building projects. He's actively learning and has 2+ years of hands-on coding experience across 6+ projects. He's open to internship and freelance opportunities! 💼"
        },
        {
            triggers: ['python', 'flask'],
            response: "Python is one of Rudra's strongest languages! He uses it for ML (TensorFlow, Keras, Scikit-learn) and backend development with Flask for building REST APIs. 🐍"
        },
        {
            triggers: ['react', 'frontend', 'javascript', 'js'],
            response: "Rudra builds dynamic frontends with React.js and has deep experience with vanilla JavaScript. He focuses on creating beautiful, responsive UIs with modern design patterns! ⚛️"
        },
        {
            triggers: ['machine learning', 'ml', 'ai', 'artificial intelligence', 'deep learning', 'neural'],
            response: "Rudra works with TensorFlow, Keras, and Scikit-learn for ML projects. He's built ANN-based prediction systems and AI-powered study tools. He's exploring deep learning architectures and aims to solve real-world problems with AI! 🧠"
        },
        {
            triggers: ['hobby', 'hobbies', 'interest', 'fun', 'free time'],
            response: "When he's not coding, Rudra enjoys exploring new technologies, contributing to open source, and building creative side projects. He's always up for learning something new! 🎮☕"
        },
        {
            triggers: ['thank', 'thanks', 'bye', 'goodbye', 'see you', 'later'],
            response: "You're welcome! Feel free to come back anytime. Don't forget to check out Rudra's projects and drop him a message! 👋✨"
        }
    ];

    const fallbacks = [
        "Hmm, I'm not sure about that. Try asking about Rudra's skills, projects, or education! 🤔",
        "That's beyond my knowledge! I can tell you about Rudra's tech stack, projects, or background though. 💡",
        "I don't have info on that, but I can help with questions about Rudra's work, skills, or how to contact him! 📬"
    ];

    function findResponse(input) {
        const lower = input.toLowerCase().trim();
        let bestMatch = null;
        let bestScore = 0;

        for (const item of knowledge) {
            for (const trigger of item.triggers) {
                if (lower.includes(trigger)) {
                    const score = trigger.length;
                    if (score > bestScore) {
                        bestScore = score;
                        bestMatch = item;
                    }
                }
            }
        }

        return bestMatch ? bestMatch.response : fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${type}`;
        const p = document.createElement('p');
        p.textContent = text;
        msg.appendChild(p);
        chatbotMessages.appendChild(msg);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-msg bot';
        typing.id = 'typingIndicator';
        typing.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
        chatbotMessages.appendChild(typing);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('typingIndicator');
        if (typing) typing.remove();
    }

    function sendMessage() {
        const text = chatbotInput.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        chatbotInput.value = '';

        showTyping();

        const delay = 800 + Math.random() * 800;
        setTimeout(() => {
            removeTyping();
            const response = findResponse(text);
            addMessage(response, 'bot');
        }, delay);
    }

    if (chatbotSend) chatbotSend.addEventListener('click', sendMessage);
    if (chatbotInput) chatbotInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });


    // ===== SKILLS CARDS MOUSE REFLECTION & 3D TILT EFFECT =====
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);

            // 3D Parallax Tilt Calculation
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((centerY - y) / centerY) * 15; // Max 15 degrees tilt
            const rotateY = ((x - centerX) / centerX) * 15; // Max 15 degrees tilt
            
            card.style.setProperty('--tilt-x', `${rotateX}deg`);
            card.style.setProperty('--tilt-y', `${rotateY}deg`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--tilt-x', '0deg');
            card.style.setProperty('--tilt-y', '0deg');
        });
    });


    // ===== FLASHLIGHT GLOW ELEMENT =====
    // Create a glow orb that follows the cursor in flashlight mode
    const flashlightGlow = document.createElement('div');
    flashlightGlow.className = 'flashlight-glow';
    document.body.appendChild(flashlightGlow);

    // Update glow position along with cursor
    document.addEventListener('mousemove', (e) => {
        flashlightGlow.style.left = e.clientX + 'px';
        flashlightGlow.style.top = e.clientY + 'px';
    });


    // ===== CURSOR COMET TAIL =====
    // 5 fixed segments that follow cursor with increasing delay
    const tailSegments = [];
    const tailConfig = [
        { size: 35, opacity: 0.7,  blur: 8,  color: 'rgba(6,182,212,0.9)',   speed: 0.18 },
        { size: 28, opacity: 0.55, blur: 10, color: 'rgba(139,92,246,0.8)',  speed: 0.12 },
        { size: 22, opacity: 0.4,  blur: 12, color: 'rgba(236,72,153,0.7)',  speed: 0.08 },
        { size: 16, opacity: 0.25, blur: 14, color: 'rgba(245,158,11,0.6)', speed: 0.05 },
        { size: 10, opacity: 0.15, blur: 16, color: 'rgba(52,211,153,0.5)',  speed: 0.03 },
    ];

    tailConfig.forEach(cfg => {
        const el = document.createElement('div');
        el.className = 'cursor-tail';
        el.style.width = cfg.size + 'px';
        el.style.height = cfg.size + 'px';
        el.style.filter = `blur(${cfg.blur}px)`;
        el.style.background = `radial-gradient(circle, ${cfg.color} 0%, transparent 70%)`;
        el.style.opacity = '0';
        document.body.appendChild(el);
        tailSegments.push({ el, x: 0, y: 0, speed: cfg.speed, opacity: cfg.opacity });
    });

    let tailMouseX = 0, tailMouseY = 0;

    document.addEventListener('mousemove', (e) => {
        tailMouseX = e.clientX;
        tailMouseY = e.clientY;
    });

    function animateTail() {
        const isActive = document.body.classList.contains('flashlight-active');
        tailSegments.forEach(seg => {
            seg.x += (tailMouseX - seg.x) * seg.speed;
            seg.y += (tailMouseY - seg.y) * seg.speed;
            seg.el.style.left = seg.x + 'px';
            seg.el.style.top = seg.y + 'px';
            // Always show tail segments, but make them brighter in flashlight mode
            seg.el.style.opacity = isActive ? seg.opacity : (seg.opacity * 0.4);
        });
        requestAnimationFrame(animateTail);
    }
    requestAnimationFrame(animateTail);

    // ===== DYNAMIC CARD HOVER GLOW =====
    const cards = document.querySelectorAll('.bento-card, .project-showcase');
    cards.forEach(card => {
        const coords = card.querySelector('.bento-coords');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            if (coords) {
                coords.textContent = `[X: ${x.toFixed(0)}, Y: ${y.toFixed(0)}]`;
            }
        });
        card.addEventListener('mouseleave', () => {
            if (coords) {
                coords.textContent = '[X: --, Y: --]';
            }
        });
    });

    // ===== SCROLL-DRIVEN SPLIT TEXT REVEAL =====
    const aboutSection = document.getElementById('about');
    const projectsSection = document.getElementById('projects');

    let currentGlobeScale = 0.10;
    let targetGlobeScale = 0.10;

    function updateSplitTitles() {
        const viewportHeight = window.innerHeight;
        // Calculate max horizontal offset based on screen width
        const maxMove = window.innerWidth * 0.12;

        if (aboutSection) {
            const container = aboutSection.querySelector('.about-title-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const startScrollY = viewportHeight;
                const endScrollY = viewportHeight * 0.15; // Locks when title reaches 15% from top of screen
                const currentScrollY = rect.top;

                let progress = 0;
                if (currentScrollY >= startScrollY) {
                    progress = 0;
                } else if (currentScrollY <= endScrollY) {
                    progress = 1;
                } else {
                    progress = (startScrollY - currentScrollY) / (startScrollY - endScrollY);
                }

                // Line 1: WHO (slides from +maxMove to 0)
                // Line 2: I AM (slides from -maxMove to 0)
                const x1 = maxMove * (1 - progress);
                const x2 = -maxMove * (1 - progress);

                const titleAbout1 = aboutSection.querySelectorAll('.title-about-1');
                const titleAbout2 = aboutSection.querySelectorAll('.title-about-2');

                titleAbout1.forEach(el => el.style.transform = `translateX(${x1}px)`);
                titleAbout2.forEach(el => el.style.transform = `translateX(${x2}px)`);

                container.style.setProperty('--reveal-progress', progress);
            }
        }

        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
            const container = skillsSection.querySelector('.skills-title-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const startScrollY = viewportHeight;
                const endScrollY = viewportHeight * 0.15; // Locks when title reaches 15% from top of screen
                const currentScrollY = rect.top;

                let progress = 0;
                if (currentScrollY >= startScrollY) {
                    progress = 0;
                } else if (currentScrollY <= endScrollY) {
                    progress = 1;
                } else {
                    progress = (startScrollY - currentScrollY) / (startScrollY - endScrollY);
                }

                // Line 1: MY (slides from +maxMove to 0)
                // Line 2: ARSENAL (slides from -maxMove to 0)
                const x1 = maxMove * (1 - progress);
                const x2 = -maxMove * (1 - progress);

                const titleSkills1 = skillsSection.querySelectorAll('.title-skills-1');
                const titleSkills2 = skillsSection.querySelectorAll('.title-skills-2');

                titleSkills1.forEach(el => el.style.transform = `translateX(${x1}px)`);
                titleSkills2.forEach(el => el.style.transform = `translateX(${x2}px)`);

                container.style.setProperty('--reveal-progress', progress);
            }

            // Calculate progress specifically for the 3D globe scene
            const globeScene = skillsSection.querySelector('.globe-scene');
            if (globeScene) {
                const globeRect = globeScene.getBoundingClientRect();
                const globeCenterY = globeRect.top + globeRect.height / 2;
                
                const startY = viewportHeight * 0.95; // Starts when globe center is near screen bottom
                const endY = viewportHeight * 0.28; // Ends when globe center reaches 28% from screen top (fully scrolled in)

                let globeProgress = 0;
                if (globeCenterY >= startY) {
                    globeProgress = 0;
                } else if (globeCenterY <= endY) {
                    globeProgress = 1;
                } else {
                    globeProgress = (startY - globeCenterY) / (startY - endY);
                }

                // Smooth linear-to-quadratic mix for very steady growth
                const easedGlobeProgress = 0.5 * globeProgress + 0.5 * (1 - Math.pow(1 - globeProgress, 2));
                targetGlobeScale = 0.10 + easedGlobeProgress * 1.05; // scales from 0.10 to 1.15
            }
        }

        if (projectsSection) {
            const container = projectsSection.querySelector('.projects-title-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const startScrollY = viewportHeight;
                const endScrollY = viewportHeight * 0.15; // Locks when title reaches 15% from top of screen
                const currentScrollY = rect.top;

                let progress = 0;
                if (currentScrollY >= startScrollY) {
                    progress = 0;
                } else if (currentScrollY <= endScrollY) {
                    progress = 1;
                } else {
                    progress = (startScrollY - currentScrollY) / (startScrollY - endScrollY);
                }

                // Line 1: RECENT (slides from +maxMove to 0)
                // Line 2: WORK (slides from -maxMove to 0)
                const x1 = maxMove * (1 - progress);
                const x2 = -maxMove * (1 - progress);

                const titleRecent = projectsSection.querySelectorAll('.title-recent');
                const titleWork = projectsSection.querySelectorAll('.title-work');

                titleRecent.forEach(el => el.style.transform = `translateX(${x1}px)`);
                titleWork.forEach(el => el.style.transform = `translateX(${x2}px)`);

                container.style.setProperty('--reveal-progress', progress);
            }
        }

        const journeySection = document.getElementById('journey');
        if (journeySection) {
            const container = journeySection.querySelector('.journey-title-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const startScrollY = viewportHeight;
                const endScrollY = viewportHeight * 0.15;
                const currentScrollY = rect.top;

                let progress = 0;
                if (currentScrollY >= startScrollY) {
                    progress = 0;
                } else if (currentScrollY <= endScrollY) {
                    progress = 1;
                } else {
                    progress = (startScrollY - currentScrollY) / (startScrollY - endScrollY);
                }

                const x1 = maxMove * (1 - progress);
                const x2 = -maxMove * (1 - progress);

                const titleJourney1 = journeySection.querySelectorAll('.title-journey-1');
                const titleJourney2 = journeySection.querySelectorAll('.title-journey-2');

                titleJourney1.forEach(el => el.style.transform = `translateX(${x1}px)`);
                titleJourney2.forEach(el => el.style.transform = `translateX(${x2}px)`);

                container.style.setProperty('--reveal-progress', progress);
            }
        }

        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const container = contactSection.querySelector('.contact-title-container');
            if (container) {
                const rect = container.getBoundingClientRect();
                const startScrollY = viewportHeight;
                const endScrollY = viewportHeight * 0.15;
                const currentScrollY = rect.top;

                let progress = 0;
                if (currentScrollY >= startScrollY) {
                    progress = 0;
                } else if (currentScrollY <= endScrollY) {
                    progress = 1;
                } else {
                    progress = (startScrollY - currentScrollY) / (startScrollY - endScrollY);
                }

                const x1 = maxMove * (1 - progress);
                const x2 = -maxMove * (1 - progress);

                const titleContact1 = contactSection.querySelectorAll('.title-contact-1');
                const titleContact2 = contactSection.querySelectorAll('.title-contact-2');

                titleContact1.forEach(el => el.style.transform = `translateX(${x1}px)`);
                titleContact2.forEach(el => el.style.transform = `translateX(${x2}px)`);

                container.style.setProperty('--reveal-progress', progress);
            }
        }

        // --- SCROLL-DRIVEN TIMELINE PROGRESS FOR JOURNEY SECTION ---
        const processGrid = document.querySelector('.process-grid');
        const progressLine = document.getElementById('timelineProgressLine');
        if (processGrid && progressLine) {
            const rect = processGrid.getBoundingClientRect();
            const scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            // Get absolute page top of the grid
            const gridPageTop = rect.top + scrollY;
            
            // Top and bottom positions of the timeline line
            const linePageTop = gridPageTop + 56;
            const linePageBottom = gridPageTop + rect.height - 56;
            
            // Scroll trigger scrollY values
            const triggerStart = linePageTop - viewportHeight * 0.6;
            const triggerEnd = linePageBottom - viewportHeight * 0.8;
            
            let progress = 0;
            if (scrollY <= triggerStart) {
                progress = 0;
            } else if (scrollY >= triggerEnd) {
                progress = 1;
            } else {
                progress = (scrollY - triggerStart) / (triggerEnd - triggerStart);
            }
            
            progressLine.style.transform = `scaleY(${progress})`;
        }

        // --- SCROLL-DRIVEN CONTENT REVEALS FOR ABOUT SECTION ---
        const scrollLefts = document.querySelectorAll('.scroll-reveal-left');
        const scrollRights = document.querySelectorAll('.scroll-reveal-right');
        const contentMaxMove = window.innerWidth * 0.05; // 5vw offset

        scrollLefts.forEach(el => {
            const rect = el.getBoundingClientRect();
            const start = viewportHeight;
            const end = viewportHeight * 0.55; // fully visible when 55% from the top (lower half of screen)
            const current = rect.top;

            let progress = 0;
            if (current >= start) {
                progress = 0;
            } else if (current <= end) {
                progress = 1;
            } else {
                progress = (start - current) / (start - end);
            }

            const x = -contentMaxMove * (1 - progress);
            el.style.transform = `translateX(${x}px)`;
            el.style.opacity = progress;
        });

        scrollRights.forEach(el => {
            const rect = el.getBoundingClientRect();
            const start = viewportHeight;
            const end = viewportHeight * 0.55; // fully visible when 55% from the top (lower half of screen)
            const current = rect.top;

            let progress = 0;
            if (current >= start) {
                progress = 0;
            } else if (current <= end) {
                progress = 1;
            } else {
                progress = (start - current) / (start - end);
            }

            const x = contentMaxMove * (1 - progress);
            el.style.transform = `translateX(${x}px)`;
            el.style.opacity = progress;
        });

        // Skills fanning scroll logic removed to support circular orbit carousel.
    }

    // ===== 3D REVOLVING SKILLS GLOBE =====
    const techLabels = document.querySelectorAll('.tech-float');
    const globeWrapper = document.querySelector('.globe-3d-wrapper');

    if (techLabels.length > 0) {
        const totalLabels = techLabels.length;
        // Sphere radius adapts to screen width to keep the tags floating perfectly around the globe
        function getSphereRadius() {
            if (window.innerWidth <= 480) return 120;
            if (window.innerWidth <= 768) return 160;
            return 280; // Increased sphere radius for the larger 400px globe on desktop
        }
        let sphereRadius = getSphereRadius();
        window.addEventListener('resize', () => {
            sphereRadius = getSphereRadius();
        });
        const perspectiveVal = 900;
        let globeRotation = 0;
        // Match CSS wireframe: 360deg in 25s → radians per ms
        const rotSpeed = (2 * Math.PI) / 25000;
        let lastTime = performance.now();
        let isPaused = false;


        // Fibonacci sphere distribution for even spacing
        const labelPositions = [];
        for (let i = 0; i < totalLabels; i++) {
            const phi = Math.acos(1 - 2 * (i + 0.5) / totalLabels);
            const theta = Math.PI * (1 + Math.sqrt(5)) * i;
            labelPositions.push({ phi, theta });
        }

        function animateSkillsGlobe(now) {
            const dt = now - lastTime;
            lastTime = now;
            if (!isPaused) {
                globeRotation += rotSpeed * dt;
            }

            const tiltX = 15 * Math.PI / 180; // 15deg tilt matching CSS

            // Reduced lerpFactor for a slower, more graceful transition (heavy inertia)
            const lerpFactor = 0.028;
            currentGlobeScale += (targetGlobeScale - currentGlobeScale) * lerpFactor;

            // Update globe-3d element transform
            const globe3D = document.querySelector('.globe-3d');
            if (globe3D) {
                globe3D.style.transform = `scale(${currentGlobeScale})`;
            }

            for (let i = 0; i < totalLabels; i++) {
                const { phi, theta } = labelPositions[i];
                const t = theta + globeRotation;

                // Spherical → Cartesian (scaled by currentGlobeScale)
                let x = sphereRadius * Math.sin(phi) * Math.cos(t) * currentGlobeScale;
                let y = sphereRadius * Math.cos(phi) * currentGlobeScale;
                let z = sphereRadius * Math.sin(phi) * Math.sin(t) * currentGlobeScale;

                // Apply X-axis tilt (rotateX(15deg))
                const cosT = Math.cos(tiltX);
                const sinT = Math.sin(tiltX);
                const y2 = y * cosT - z * sinT;
                const z2 = y * sinT + z * cosT;
                y = y2;
                z = z2;

                const el = techLabels[i];

                // Hide labels on the backside completely
                if (z < -30 * currentGlobeScale) {
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                    el.style.pointerEvents = 'none';
                    continue;
                }

                // Perspective projection
                const scale = perspectiveVal / (perspectiveVal + z);
                const screenX = x * scale;
                const screenY = y * scale;

                // Depth-based opacity — front is bright, near-back fades out
                const depthRatio = (z + sphereRadius * currentGlobeScale) / (2 * sphereRadius * currentGlobeScale || 1);
                const scaleFade = Math.max(0, Math.min(1, (currentGlobeScale - 0.15) * 2.5));
                const opacity = Math.max(0, Math.min(1, depthRatio * 1.5)) * scaleFade; // Fade tags out when globe is tiny

                el.style.transform = `translate(${screenX}px, ${screenY}px) scale(${Math.max(0.6 * currentGlobeScale, scale * currentGlobeScale)})`;
                el.style.opacity = opacity.toFixed(2);
                el.style.visibility = currentGlobeScale > 0.22 ? 'visible' : 'hidden';
                el.style.zIndex = Math.round(z + sphereRadius);
                el.style.filter = 'none';
                el.style.pointerEvents = opacity > 0.5 && currentGlobeScale > 0.6 ? 'auto' : 'none';
            }

            requestAnimationFrame(animateSkillsGlobe);
        }

        requestAnimationFrame(animateSkillsGlobe);
    }

    let scrollTickerActive = false;
    window.addEventListener('scroll', () => {
        if (!scrollTickerActive) {
            requestAnimationFrame(() => {
                updateSplitTitles();
                scrollTickerActive = false;
            });
            scrollTickerActive = true;
        }
    });

    window.addEventListener('resize', updateSplitTitles);
    updateSplitTitles();

});
