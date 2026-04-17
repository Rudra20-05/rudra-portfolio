/* ===================================================
   RUDRA DALVI — PORTFOLIO JAVASCRIPT
   Animations, Particles, Interactions
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

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

    // Cursor hover effects
    const hoverElements = document.querySelectorAll('a, button, .project-card, .bento-card, .magnetic');
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

    function updateActiveLink() {
        const scrollY = window.pageYOffset + 200;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
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
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    // ===== TYPED TEXT EFFECT =====
    const typedTextEl = document.getElementById('typedText');
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

});
