/* ===================================================
   NOVA — AI ASSISTANT FOR RUDRA DALVI
   Complete knowledge base + chat logic
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== CUSTOM CURSOR =====
    const cursorDot = document.getElementById('cursorDot');
    const cursorRing = document.getElementById('cursorRing');

    if (cursorDot && cursorRing) {
        let mouseX = 0, mouseY = 0;
        let ringX = 0, ringY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';

            // Update flashlight
            const overlay = document.getElementById('flashlightOverlay');
            if (overlay) {
                overlay.style.setProperty('--spot-x', mouseX + 'px');
                overlay.style.setProperty('--spot-y', mouseY + 'px');
            }
        });

        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover effect on interactive elements
        const hoverTargets = document.querySelectorAll('a, button, input, .nova-chip');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('hovering');
                cursorRing.classList.add('hovering');
            });
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('hovering');
                cursorRing.classList.remove('hovering');
            });
        });
    }

    // ===== FLASHLIGHT MODE (persist from main page) =====
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const isFlashlight = localStorage.getItem('rd-flashlight') === 'on';
        if (isFlashlight) document.body.classList.add('flashlight-active');

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('flashlight-active');
            const active = document.body.classList.contains('flashlight-active');
            localStorage.setItem('rd-flashlight', active ? 'on' : 'off');
        });

        // Create flashlight glow element
        const flashlightGlow = document.createElement('div');
        flashlightGlow.className = 'flashlight-glow';
        document.body.appendChild(flashlightGlow);
        document.addEventListener('mousemove', (e) => {
            flashlightGlow.style.left = e.clientX + 'px';
            flashlightGlow.style.top = e.clientY + 'px';
        });

        // Cursor comet tail
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
    }


    // ===== RUDRA'S KNOWLEDGE BASE =====
    const RUDRA = {
        name: "Rudra Dalvi",
        email: "dalvi.rudra1976@gmail.com",
        location: "Mumbai, India",
        github: "https://github.com/Rudra20-05",
        linkedin: "https://www.linkedin.com/in/rudra-dalvi-7379bb331",

        about: "Rudra Dalvi is an aspiring IT professional with a strong foundation in software development and a specialized interest in Artificial Intelligence and Recommender Systems. He's passionate about building AI-driven applications and scalable web platforms, seeking opportunities to apply technical skills to impactful real-world solutions. He's currently pursuing B.Tech in Information Technology at Vidyalankar Institute of Technology, Mumbai.",

        skills: {
            programming: ["Python", "Java", "C", "JavaScript", "HTML", "CSS"],
            aiml: ["Scikit-learn", "Pandas", "NumPy", "TensorFlow", "PyTorch", "Matplotlib"],
            databases: ["MySQL", "PostgreSQL", "SQL"],
            tools: ["Git", "GitHub", "VS Code", "Jupyter Notebook", "FastAPI", "Flask", "React", "Node.js"],
            languages: ["English", "Hindi", "Marathi"]
        },

        projects: [
            {
                name: "AI Marketing SaaS Platform",
                tech: "Python, Flask, React, Generative AI",
                description: "A full-stack AI marketing platform for customer sentiment analysis and targeted ad generation. Features REST APIs using Python and Flask for marketing data processing, an interactive frontend dashboard using React for sentiment analytics visualization, and integrated generative AI models for automated ad copy generation.",
                link: "GitHub Repo"
            },
            {
                name: "Event Management System",
                tech: "Python, REST APIs, Authentication",
                description: "A full-stack web application for managing and promoting college events. Includes backend authentication and REST APIs for event CRUD operations, plus a designed responsive frontend interface for event browsing and registration.",
                link: "GitHub Repo"
            },
            {
                name: "EcoQuest: Gamified E-Waste Management Platform",
                tech: "Full-Stack Web, Authentication, Gamification",
                description: "A full-stack gamified web platform to promote responsible e-waste disposal through interactive challenges and quizzes. Features secure role-based authentication for admin and users using modern web technologies, and a dynamic responsive user interface to enhance engagement and improve user experience.",
                link: "Live Link"
            }
        ],

        education: {
            college: {
                name: "Vidyalankar Institute of Technology, Mumbai",
                degree: "B.Tech in Information Technology",
                duration: "Aug 2023 – May 2027",
                cgpa: "8.9"
            },
            hsc: {
                name: "CHM College",
                exam: "Higher Secondary Certificate (CET)",
                percentile: "95.72%",
                year: "2023"
            },
            ssc: {
                name: "Don Bosco English School",
                exam: "Secondary School Certificate (SSC)",
                percentage: "94.60%",
                year: "2021"
            }
        },

        hackathons: [
            {
                name: "HackBuild – GDG VIT",
                date: "Aug 2025",
                details: "Developed a healthcare queue management prototype within a 24-hour hackathon. Achieved Semi-Finalist position through functional solution and presentation."
            },
            {
                name: "Smart India Hackathon (SIH)",
                date: "2025",
                details: "Participated in national level hackathon solving real-world technical problem statements."
            }
        ],

        certifications: [
            "Machine Learning with Python – L&T (Skill Trainer Academy)",
            "Advanced Diploma in Database Systems – Alison",
            "Introduction to Soft Skills – TCS iON",
            "Introduction to Machine Learning with scikit-learn – Data School",
            "MATLAB Fundamentals – MathWorks"
        ]
    };


    // ===== RESPONSE MATCHING ENGINE =====
    function getResponse(query) {
        const q = query.toLowerCase().trim();

        // --- Who is Rudra / About ---
        if (matches(q, ['who is', 'who\'s', 'tell me about', 'about rudra', 'introduce', 'about him', 'about yourself', 'who are you'])) {
            return RUDRA.about;
        }

        // --- Projects ---
        if (matches(q, ['project', 'built', 'made', 'developed', 'portfolio work', 'what has he built', 'work'])) {
            // Check for specific project
            if (matches(q, ['marketing', 'saas', 'sentiment', 'ad generation'])) {
                const p = RUDRA.projects[0];
                return `**${p.name}**\n\n${p.description}\n\n🛠️ Tech: ${p.tech}`;
            }
            if (matches(q, ['event', 'college event', 'event management'])) {
                const p = RUDRA.projects[1];
                return `**${p.name}**\n\n${p.description}\n\n🛠️ Tech: ${p.tech}`;
            }
            if (matches(q, ['ecoquest', 'e-waste', 'ewaste', 'gamif'])) {
                const p = RUDRA.projects[2];
                return `**${p.name}**\n\n${p.description}\n\n🛠️ Tech: ${p.tech}`;
            }

            // All projects
            let response = "Rudra has built several impressive projects:\n\n";
            RUDRA.projects.forEach((p, i) => {
                response += `**${i + 1}. ${p.name}**\n${p.description}\n🛠️ Tech: ${p.tech}\n\n`;
            });
            return response.trim();
        }

        // --- Skills / Tech Stack ---
        if (matches(q, ['skill', 'tech stack', 'technology', 'technologies', 'what can he', 'programming', 'languages he knows', 'tools', 'framework'])) {
            const s = RUDRA.skills;
            return `Here's Rudra's tech arsenal:\n\n` +
                `💻 **Programming:** ${s.programming.join(', ')}\n\n` +
                `🤖 **AI/ML Libraries:** ${s.aiml.join(', ')}\n\n` +
                `🗄️ **Databases:** ${s.databases.join(', ')}\n\n` +
                `🛠️ **Tools & Frameworks:** ${s.tools.join(', ')}\n\n` +
                `🌍 **Languages:** ${s.languages.join(', ')}`;
        }

        // --- Education ---
        if (matches(q, ['education', 'college', 'university', 'degree', 'study', 'school', 'cgpa', 'gpa', 'academic', '10th', '12th', 'ssc', 'hsc', 'marks', 'percentage', 'percentile'])) {
            const e = RUDRA.education;
            return `📚 **Education:**\n\n` +
                `🎓 **${e.college.degree}** — ${e.college.name}\n` +
                `${e.college.duration} | CGPA: ${e.college.cgpa}\n\n` +
                `📜 **${e.hsc.exam}** — ${e.hsc.name}\n` +
                `Entrance Percentile: ${e.hsc.percentile} (${e.hsc.year})\n\n` +
                `📜 **${e.ssc.exam}** — ${e.ssc.name}\n` +
                `Percentage: ${e.ssc.percentage} (${e.ssc.year})`;
        }

        // --- Hackathons ---
        if (matches(q, ['hackathon', 'competition', 'hackbuild', 'sih', 'smart india', 'gdg'])) {
            let response = "🏆 **Hackathons & Competitions:**\n\n";
            RUDRA.hackathons.forEach(h => {
                response += `**${h.name}** (${h.date})\n${h.details}\n\n`;
            });
            return response.trim();
        }

        // --- Certifications ---
        if (matches(q, ['certif', 'course', 'diploma', 'training', 'learn'])) {
            let response = "📜 **Certifications:**\n\n";
            RUDRA.certifications.forEach(c => {
                response += `• ${c}\n`;
            });
            return response.trim();
        }

        // --- Contact ---
        if (matches(q, ['contact', 'reach', 'email', 'mail', 'hire', 'connect'])) {
            return `You can reach Rudra through:\n\n` +
                `📧 **Email:** ${RUDRA.email}\n` +
                `📍 **Location:** ${RUDRA.location}\n` +
                `🐙 **GitHub:** [Rudra20-05](${RUDRA.github})\n` +
                `💼 **LinkedIn:** [Rudra Dalvi](${RUDRA.linkedin})\n\n` +
                `Or use the [Contact form](index.html#contact) on the portfolio!`;
        }

        // --- GitHub ---
        if (matches(q, ['github', 'repo', 'source code', 'open source'])) {
            return `You can find Rudra's work on GitHub:\n🐙 [github.com/Rudra20-05](${RUDRA.github})\n\nHe has repositories for all his major projects including the AI Marketing Platform and Event Management System.`;
        }

        // --- Opportunities / Internships ---
        if (matches(q, ['opportunit', 'intern', 'job', 'work with', 'available', 'hire', 'freelance', 'open to'])) {
            return `Yes! Rudra is currently pursuing his B.Tech (graduating May 2027) and is **open to internships, freelance projects, and collaboration opportunities**.\n\nHe's particularly interested in roles related to:\n• AI/ML Engineering\n• Full-Stack Development\n• Software Engineering\n\n📧 Reach out at: ${RUDRA.email}`;
        }

        // --- Experience / Interests ---
        if (matches(q, ['interest', 'passion', 'specializ', 'focus', 'area'])) {
            return `Rudra specializes in **Artificial Intelligence** and **Recommender Systems**. He's passionate about building AI-driven applications and scalable web platforms. His focus areas include:\n\n🧠 Machine Learning & Deep Learning\n📊 Data Science & Analytics\n🌐 Full-Stack Web Development\n🔬 Research in AI`;
        }

        // --- Location ---
        if (matches(q, ['where', 'location', 'city', 'based', 'live'])) {
            return `Rudra is based in **Mumbai, India**. He's currently studying at Vidyalankar Institute of Technology.`;
        }

        // --- Age / Personal ---
        if (matches(q, ['age', 'old', 'born', 'birthday'])) {
            return contactFallback("Rudra's personal details like age or birthday");
        }

        // --- Greeting ---
        if (matches(q, ['hello', 'hi', 'hey', 'sup', 'what\'s up', 'good morning', 'good evening'])) {
            return `Hey there! 👋 I'm **NOVA**, Rudra's AI assistant. Ask me anything about his projects, skills, education, or experience. Here are some ideas:\n\n• "What projects has he built?"\n• "What's his tech stack?"\n• "Tell me about his education"`;
        }

        // --- Thanks ---
        if (matches(q, ['thank', 'thanks', 'thx', 'appreciate'])) {
            return `You're welcome! 😊 Feel free to ask me anything else about Rudra. I'm here to help!`;
        }

        // --- Fallback ---
        return contactFallback("that specific information");
    }

    function matches(query, keywords) {
        return keywords.some(kw => query.includes(kw));
    }

    function contactFallback(topic) {
        return `I don't have ${topic} in my knowledge base. Feel free to reach out to Rudra directly:\n\n📧 **Email:** ${RUDRA.email}\n💼 **LinkedIn:** [Rudra Dalvi](${RUDRA.linkedin})\n\nOr head over to the [Contact section](index.html#contact) for more details! 📬`;
    }

    // Simple markdown-like formatting
    function formatMessage(text) {
        return text
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color: #06b6d4; text-decoration: underline;">$1</a>')
            .replace(/\n/g, '<br>');
    }


    // ===== CHAT DOM LOGIC =====
    const messagesContainer = document.getElementById('novaMessages');
    const input = document.getElementById('novaInput');
    const sendBtn = document.getElementById('novaSend');
    const welcome = document.getElementById('novaWelcome');
    const suggestions = document.getElementById('novaSuggestions');

    if (!messagesContainer || !input || !sendBtn) return;

    // Add a message to the chat
    function addMessage(text, type) {
        // Hide welcome on first message
        if (welcome && welcome.parentNode) {
            welcome.style.display = 'none';
        }

        const msgDiv = document.createElement('div');
        msgDiv.className = `nova-msg ${type}`;

        const avatar = document.createElement('div');
        avatar.className = 'nova-msg-avatar';
        avatar.textContent = type === 'bot' ? '🤖' : '👤';

        const bubble = document.createElement('div');
        bubble.className = 'nova-msg-bubble';
        bubble.innerHTML = formatMessage(text);

        msgDiv.appendChild(avatar);
        msgDiv.appendChild(bubble);
        messagesContainer.appendChild(msgDiv);

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Show typing indicator
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'nova-msg bot';
        typingDiv.id = 'novaTyping';

        const avatar = document.createElement('div');
        avatar.className = 'nova-msg-avatar';
        avatar.textContent = '🤖';

        const bubble = document.createElement('div');
        bubble.className = 'nova-msg-bubble';
        bubble.innerHTML = '<div class="nova-typing"><span></span><span></span><span></span></div>';

        typingDiv.appendChild(avatar);
        typingDiv.appendChild(bubble);
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function removeTyping() {
        const typing = document.getElementById('novaTyping');
        if (typing) typing.remove();
    }

    // Handle sending a message
    function handleSend() {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        // Show typing for realism
        showTyping();

        setTimeout(() => {
            removeTyping();
            const response = getResponse(text);
            addMessage(response, 'bot');
        }, 600 + Math.random() * 800);
    }

    // Event listeners
    sendBtn.addEventListener('click', handleSend);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    });

    // Suggestion chip click
    if (suggestions) {
        suggestions.querySelectorAll('.nova-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const question = chip.getAttribute('data-question');
                input.value = question;
                handleSend();
            });
        });
    }

});
