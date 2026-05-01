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


    // ===== PROJECT CARD SCOPE/TECH TABS =====
    document.querySelectorAll('.project-view-toggle').forEach(toggle => {
        const card = toggle.closest('.project-card-inner');
        const scopeEl = card.querySelector('.project-scope');
        const techEl = card.querySelector('.project-tech');
        const btns = toggle.querySelectorAll('.view-btn');

        btns.forEach(btn => {
            btn.addEventListener('click', () => {
                btns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (btn.dataset.view === 'scope') {
                    scopeEl.style.display = '';
                    techEl.style.display = 'none';
                    // Re-trigger animation
                    scopeEl.style.animation = 'none';
                    scopeEl.offsetHeight;
                    scopeEl.style.animation = '';
                } else {
                    scopeEl.style.display = 'none';
                    techEl.style.display = '';
                    techEl.style.animation = 'none';
                    techEl.offsetHeight;
                    techEl.style.animation = '';
                }
            });
        });
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


    // ===== 3D REVOLVING SKILLS GLOBE =====
    const techLabels = document.querySelectorAll('.tech-float');

    if (techLabels.length > 0) {
        const totalLabels = techLabels.length;
        const sphereRadius = 280;
        const perspectiveVal = 900;
        let globeRotation = 0;
        // Match CSS wireframe: 360deg in 25s → radians per ms
        const rotSpeed = (2 * Math.PI) / 25000;
        let lastTime = performance.now();

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
            globeRotation += rotSpeed * dt;

            const tiltX = 15 * Math.PI / 180; // 15deg tilt matching CSS

            for (let i = 0; i < totalLabels; i++) {
                const { phi, theta } = labelPositions[i];
                const t = theta + globeRotation;

                // Spherical → Cartesian
                let x = sphereRadius * Math.sin(phi) * Math.cos(t);
                let y = sphereRadius * Math.cos(phi);
                let z = sphereRadius * Math.sin(phi) * Math.sin(t);

                // Apply X-axis tilt (rotateX(15deg))
                const cosT = Math.cos(tiltX);
                const sinT = Math.sin(tiltX);
                const y2 = y * cosT - z * sinT;
                const z2 = y * sinT + z * cosT;
                y = y2;
                z = z2;

                const el = techLabels[i];

                // Hide labels on the backside completely
                if (z < -30) {
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
                const depthRatio = (z + sphereRadius) / (2 * sphereRadius);
                const opacity = Math.max(0, Math.min(1, depthRatio * 1.5));

                el.style.transform = `translate(${screenX}px, ${screenY}px) scale(${Math.max(0.6, scale)})`;
                el.style.opacity = opacity.toFixed(2);
                el.style.visibility = 'visible';
                el.style.zIndex = Math.round(z + sphereRadius);
                el.style.filter = 'none';
                el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
            }

            requestAnimationFrame(animateSkillsGlobe);
        }

        requestAnimationFrame(animateSkillsGlobe);
    }


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
            seg.el.style.opacity = isActive ? seg.opacity : '0';
        });
        requestAnimationFrame(animateTail);
    }
    requestAnimationFrame(animateTail);

});
