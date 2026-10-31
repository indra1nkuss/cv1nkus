document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 0. PRELOADER & TOAST UTILITY
    // =========================================
    // Generate floating particles
    const particlesContainer = document.getElementById('preloader-particles');
    if (particlesContainer) {
        for (let i = 0; i < 30; i++) {
            const p = document.createElement('div');
            p.className = 'preloader-particle';
            p.style.left = Math.random() * 100 + '%';
            p.style.bottom = Math.random() * 30 + '%';
            p.style.animationDuration = (2 + Math.random() * 3) + 's';
            p.style.animationDelay = Math.random() * 4 + 's';
            p.style.width = p.style.height = (1 + Math.random() * 3) + 'px';
            particlesContainer.appendChild(p);
        }
    }

    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('preloader-hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 700);
        }
    });

    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastMsg = document.getElementById('toast-msg');
        if (toast && toastMsg) {
            toastMsg.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    // =========================================
    // 0.5. ADVANCED FEATURES (THEME, CONFETTI, TERMINAL)
    // =========================================
    // Theme Toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // Check local storage for theme
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            if (document.body.classList.contains('light-mode')) {
                localStorage.setItem('theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                localStorage.setItem('theme', 'dark');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            }
        });
    }

    // Interactive Terminal
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (terminalInput && terminalOutput) {
        const commands = {
            'help': 'Available commands: <br>- <span class="text-accent">whoami</span>: View my profile summary<br>- <span class="text-accent">skills</span>: List my core technical skills<br>- <span class="text-accent">contact</span>: Get my contact info<br>- <span class="text-accent">clear</span>: Clear terminal screen',
            'whoami': 'I am Indra Nurul Kusuma, a passionate Developer and Energy Data Analyst specializing in modern web tech and data efficiency.',
            'skills': 'Frontend: React, Tailwind, Three.js, HTML/CSS. <br>Backend: Node.js, Python, Firebase.<br>Data: Excel, Analytics tools.',
            'contact': 'Email: email@anda.com<br>LinkedIn: /in/indra-nk<br>GitHub: /1nkuss',
            'clear': ''
        };

        terminalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const val = this.value.trim().toLowerCase();
                if (val) {
                    // Print command
                    const cmdDiv = document.createElement('div');
                    cmdDiv.innerHTML = `<span class="text-green-400">$&gt;</span> <span class="text-white">${val}</span>`;
                    terminalOutput.appendChild(cmdDiv);
                    
                    // Process command
                    const resDiv = document.createElement('div');
                    resDiv.className = 'text-slate-300 mb-4 mt-1';
                    
                    if (val === 'clear') {
                        terminalOutput.innerHTML = '<div class="text-green-400 mb-2">Welcome to 1nkuss Interactive CLI v1.0.0</div><div class="text-slate-300 mb-4">Type <span class="text-accent font-bold">\'help\'</span> to see available commands.</div>';
                    } else if (commands[val]) {
                        resDiv.innerHTML = commands[val];
                        terminalOutput.appendChild(resDiv);
                    } else {
                        resDiv.innerHTML = `Command not found: ${val}. Type 'help' to see available commands.`;
                        terminalOutput.appendChild(resDiv);
                    }
                    
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                }
                this.value = '';
            }
        });
    }
    // =========================================
    // 1. DYNAMIC CMS & CONFIG APPLIER
    // =========================================
    let typedInstance = null;

    function initTypewriter(words, speed) {
        const typewriterElement = document.getElementById('typewriter');
        if (!typewriterElement || typeof Typed === 'undefined') return;
        if (typedInstance) {
            try { typedInstance.destroy(); } catch(e) {}
        }
        typedInstance = new Typed(typewriterElement, {
            strings: words || ['Developer', 'Data Analyst', 'Problem Solver', 'Tech Enthusiast'],
            typeSpeed: speed || 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: false
        });
    }

    window.applySiteConfig = function(cfg) {
        if (!cfg) return;

        // 1. Theme & Colors
        if (cfg.theme) {
            const p = cfg.theme.primaryColor || '#6366f1';
            const a = cfg.theme.accentColor || '#06b6d4';
            let styleEl = document.getElementById('dynamic-theme-css');
            if (!styleEl) {
                styleEl = document.createElement('style');
                styleEl.id = 'dynamic-theme-css';
                document.head.appendChild(styleEl);
            }
            styleEl.innerHTML = `
                :root {
                    --primary: ${p} !important;
                    --primary-light: ${p}dd !important;
                    --primary-dark: ${p}aa !important;
                    --primary-glow: ${p}40 !important;
                    --accent: ${a} !important;
                    --accent-glow: ${a}40 !important;
                }
                .text-primary { color: ${p} !important; }
                .bg-primary { background-color: ${p} !important; }
                .border-primary { border-color: ${p} !important; }
                .text-accent { color: ${a} !important; }
                .bg-accent { background-color: ${a} !important; }
                .border-accent { border-color: ${a} !important; }
            `;
        }

        // 2. Hero Content
        if (cfg.hero) {
            const roleEl = document.getElementById('hero-role-badge');
            if (roleEl && cfg.hero.role) roleEl.textContent = cfg.hero.role;

            const t1 = document.getElementById('hero-title-line1');
            if (t1 && cfg.hero.title1) t1.textContent = cfg.hero.title1;

            const tg = document.getElementById('hero-title-gradient');
            if (tg && cfg.hero.titleHighlight) tg.textContent = cfg.hero.titleHighlight;

            const sub = document.getElementById('hero-subtitle');
            if (sub && cfg.hero.subtitle) sub.textContent = cfg.hero.subtitle;

            // Typewriter
            if (cfg.hero.typewriterWords && cfg.hero.typewriterWords.length > 0) {
                initTypewriter(cfg.hero.typewriterWords, cfg.hero.typewriterSpeed);
            }
        }

        // 3. About Section
        if (cfg.about) {
            const vBadge = document.getElementById('vision-badge');
            if (vBadge && cfg.about.vision) vBadge.textContent = cfg.about.vision;

            const bio1 = document.getElementById('about-bio-1');
            if (bio1 && cfg.about.bio1) bio1.textContent = cfg.about.bio1;

            const bio2 = document.getElementById('about-bio-2');
            if (bio2 && cfg.about.bio2) bio2.textContent = cfg.about.bio2;

            const cExp = document.getElementById('stat-exp-counter');
            if (cExp && cfg.about.expYears !== undefined) {
                cExp.setAttribute('data-target', cfg.about.expYears);
                cExp.textContent = cfg.about.expYears;
            }

            const cProj = document.getElementById('stat-proj-counter');
            if (cProj && cfg.about.projectsCount !== undefined) {
                cProj.setAttribute('data-target', cfg.about.projectsCount);
                cProj.textContent = cfg.about.projectsCount;
            }
        }

        // 4. Contact & Socials
        if (cfg.contact) {
            const emailLink = document.getElementById('footer-email-link');
            if (emailLink && cfg.contact.email) {
                emailLink.href = 'mailto:' + cfg.contact.email;
                emailLink.textContent = cfg.contact.email;
            }
            const locText = document.getElementById('footer-location-text');
            if (locText && cfg.contact.location) locText.textContent = cfg.contact.location;

            const gh = cfg.contact.github;
            const li = cfg.contact.linkedin;
            const ig = cfg.contact.instagram;
            const em = cfg.contact.email ? 'mailto:' + cfg.contact.email : null;

            if (gh) {
                const el1 = document.getElementById('hero-github');
                const el2 = document.getElementById('footer-github');
                if (el1) el1.href = gh;
                if (el2) el2.href = gh;
            }
            if (li) {
                const el1 = document.getElementById('hero-linkedin');
                const el2 = document.getElementById('footer-linkedin');
                if (el1) el1.href = li;
                if (el2) el2.href = li;
            }
            if (ig) {
                const el1 = document.getElementById('hero-instagram');
                const el2 = document.getElementById('footer-instagram');
                if (el1) el1.href = ig;
                if (el2) el2.href = ig;
            }
            if (em) {
                const el1 = document.getElementById('hero-email');
                const el2 = document.getElementById('footer-email');
                if (el1) el1.href = em;
                if (el2) el2.href = em;
            }
        }

        // 5. Media (Images)
        if (cfg.media) {
            const profImg = document.getElementById('profile-img');
            if (profImg && cfg.media.profileImg) {
                profImg.src = cfg.media.profileImg;
            }
            const bgEl = document.getElementById('image-bg');
            if (bgEl && cfg.media.bgImg) {
                bgEl.style.backgroundImage = `url('${cfg.media.bgImg}')`;
            }
        }

        // 6. Animations
        if (cfg.animations) {
            const bgEl = document.getElementById('image-bg');
            if (bgEl) {
                if (cfg.animations.bgZoom === false) {
                    bgEl.style.animation = 'none';
                } else {
                    bgEl.style.animation = '';
                }
            }
            const auroraEl = document.querySelector('.aurora-bg');
            if (auroraEl) {
                auroraEl.style.display = cfg.animations.auroraBg === false ? 'none' : 'block';
            }
            const bokehEl = document.querySelector('.bokeh-bg');
            if (bokehEl) {
                bokehEl.style.display = cfg.animations.bokehBg === false ? 'none' : 'block';
            }
        }
    };

    // Apply saved config immediately from localStorage
    try {
        const localSaved = localStorage.getItem('cv1nkus_site_config');
        if (localSaved) {
            window.applySiteConfig(JSON.parse(localSaved));
        } else {
            initTypewriter();
        }
    } catch(e) {
        initTypewriter();
    }

    // =========================================
    // 2. MODAL LOGIC
    // =========================================
    window.openModal = (card) => {
        const modal = document.getElementById('project-modal');
        document.getElementById('modal-title').textContent = card.dataset.title;
        document.getElementById('modal-desc').textContent = card.dataset.desc;
        document.getElementById('modal-image').src = card.dataset.image;
        document.getElementById('modal-link').href = card.dataset.link;
        
        const techContainer = document.getElementById('modal-tech');
        techContainer.innerHTML = '';
        card.dataset.tech.split(',').forEach(t => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs';
            span.textContent = t.trim();
            techContainer.appendChild(span);
        });

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    };

    window.closeModal = () => {
        document.getElementById('project-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
    };

    // =========================================
    // 2.5. PROJECT FILTERING
    // =========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Scroll to projects section
            document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });

            // Reset styles
            filterBtns.forEach(b => {
                b.classList.remove('active', 'bg-primary/20', 'text-white', 'border-primary');
                b.classList.add('text-slate-400', 'border-white/10');
            });
            
            // Set active style
            btn.classList.remove('text-slate-400', 'border-white/10');
            btn.classList.add('active', 'bg-primary/20', 'text-white', 'border-primary');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.classList.remove('hide');
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    // =========================================
    // 3. REVEAL, NAVBAR, UI EXTENSIONS
    // =========================================
    const revealElements = document.querySelectorAll('.reveal');
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    const updateUIOnScroll = (y) => {
        const scrolled = y || window.scrollY;

        // Navbar
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
            navbar.classList.remove('py-4');
            navbar.classList.add('py-2');
        } else {
            navbar.classList.remove('scrolled');
            navbar.classList.remove('py-2');
            navbar.classList.add('py-4');
        }

        // Scroll Progress
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrolled / docHeight) * 100;
            scrollProgress.style.width = `${scrollPercent}%`;
        }

        // Back to Top Button
        if (backToTopBtn) {
            if (scrolled > 300) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        }

        // Reveal elements (using IntersectionObserver is better, but keep for compat)
        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 100) {
                reveal.classList.add('active');
            }
        });
    };

    // Initial call
    updateUIOnScroll(window.scrollY);

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Mobile Menu
    const menuToggle = document.getElementById('menu-toggle');
    const menuClose = document.getElementById('menu-close');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuToggle && mobileNav) {
        menuToggle.addEventListener('click', () => {
            mobileNav.classList.remove('-translate-y-full', 'opacity-0');
            document.body.style.overflow = 'hidden';
        });

        menuClose.addEventListener('click', () => {
            mobileNav.classList.add('-translate-y-full', 'opacity-0');
            document.body.style.overflow = 'auto';
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.add('-translate-y-full', 'opacity-0');
                document.body.style.overflow = 'auto';
            });
        });
    }

    // Custom Cursor (desktop only — mousemove is expensive)
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    if (cursorDot && cursorOutline && window.innerWidth >= 768) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 500, fill: "forwards" });
        });

        const clickables = document.querySelectorAll('a, button, .cursor-pointer, .project-card');
        clickables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorOutline.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
            });
            el.addEventListener('mouseleave', () => {
                cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorOutline.style.backgroundColor = 'transparent';
            });
        });
    }

    // 3D Tilt Effect
    const tiltElements = document.querySelectorAll('.tilt-element, .project-card, .skill-card');
    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = ((x - centerX) / centerX) * 10;
            const tiltY = ((centerY - y) / centerY) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${tiltY}deg) rotateY(${tiltX}deg) scale3d(1.02, 1.02, 1.02)`;
            el.style.transition = 'none';
        });
        
        el.addEventListener('mouseleave', () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            el.style.transition = 'transform 0.5s ease';
        });
    });

    // =========================================
    // 4. THREE.JS 3D ROBOT HEAD (Removed - Replaced with model-viewer in HTML)
    // =========================================

    // =========================================
    // 5. MAGNETIC EFFECT
    // =========================================
    const magneticElements = document.querySelectorAll('.magnetic');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
        });
    });

    // =========================================
    // 9. GUESTBOOK (FIREBASE)
    // =========================================
    const firebaseConfig = {
        apiKey: "AIzaSyC9JkHeCRkgHuw5_YHhC7W5c8TpEge_OWY",
        authDomain: "cvsaya-e0996.firebaseapp.com",
        projectId: "cvsaya-e0996",
        databaseURL: "https://cvsaya-e0996-default-rtdb.asia-southeast1.firebasedatabase.app/",
        storageBucket: "cvsaya-e0996.firebasestorage.app",
        messagingSenderId: "477452657261",
        appId: "1:477452657261:web:1d349552b452422db5d564"
    };

    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        try {
            firebase.initializeApp(firebaseConfig);
            const database = firebase.database();

            // Realtime Sync with Admin Control Hub
            const siteConfigRef = database.ref('site_config');
            siteConfigRef.on('value', (snap) => {
                const cloudConfig = snap.val();
                if (cloudConfig) {
                    window.applySiteConfig(cloudConfig);
                    try {
                        localStorage.setItem('cv1nkus_site_config', JSON.stringify(cloudConfig));
                    } catch(e) {}
                }
            });

            const guestbookRef = database.ref('guestbook');
            
            database.ref(".info/connected").on("value", (snap) => {
                if (snap.val() === true) {
                    console.log("Firebase Connection Status: Connected");
                } else {
                    console.warn("Firebase Connection Status: Disconnected");
                }
            });

            const guestbookForm = document.getElementById('guestbook-form');
            const guestbookMessages = document.getElementById('comments-container');

            if (guestbookForm) {
                guestbookForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    
                    const name = document.getElementById('guest-name').value;
                    const message = document.getElementById('guest-message').value;

                    guestbookRef.push({
                        name: name,
                        message: message,
                        timestamp: Date.now()
                    }).then(() => {
                        guestbookForm.reset();
                        showToast("Pesan Anda telah berhasil dikirim!");
                    }).catch((err) => {
                        console.error("Push failed:", err);
                    });
                });
            }

            guestbookRef.on('child_added', (snapshot) => {
                const data = snapshot.val();
                const initials = data.name ? data.name.charAt(0).toUpperCase() : '?';
                const messageElement = document.createElement('div');
                messageElement.className = 'p-6 glass rounded-2xl border border-white/10 mb-4 comment-card animate-fade-in';
                messageElement.innerHTML = `
                    <div class="flex gap-4">
                        <div class="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30 flex-shrink-0">
                            ${initials}
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-center mb-1">
                                <h4 class="text-white font-bold text-base">${data.name}</h4>
                                <span class="text-[10px] text-slate-500 uppercase tracking-widest">
                                    ${new Date(data.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <p class="text-slate-400 text-sm leading-relaxed">${data.message}</p>
                        </div>
                    </div>
                `;
                guestbookMessages.prepend(messageElement);
            });
        } catch (error) {
            console.error("Firebase Error:", error);
        }
    }

    // =========================================
    // 10. STATS COUNTER
    // =========================================
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const startCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText.replace('+', '');
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + "+";
                }
            };
            updateCount();
        });
    };

    const observerOptions = { threshold: 0.5 };
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                counterObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const statsSection = document.querySelector('#about');
    if (statsSection) counterObserver.observe(statsSection);


    // =========================================
    // 12a. GSAP INTRO & LOGO ANIMATION (all devices — lightweight, once)
    // =========================================
    if (typeof gsap !== 'undefined') {
        const introTl = gsap.timeline();
        introTl.from("body", { opacity: 0, duration: 0.3 })
               .from(".mesh-bg", { scale: 0.95, opacity: 0, duration: 0.8, ease: "power3.out" })
               .from("#logo-glow", { scale: 0, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.3")
               .fromTo("#logo-ring-1",
                 { attr: { "stroke-dashoffset": 390 } },
                 { attr: { "stroke-dashoffset": 0 }, duration: 1.8, ease: "power2.inOut" }, "-=0.8")
               .fromTo("#logo-ring-2",
                 { attr: { "stroke-dashoffset": 302 } },
                 { attr: { "stroke-dashoffset": 0 }, duration: 1.4, ease: "power2.inOut" }, "-=1.0")
               .from("#logo-diamond", { scale: 0, rotation: 90, opacity: 0, duration: 0.9, ease: "back.out(1.7)" }, "-=0.7")
               .from("#logo-diamond-inner", { scale: 0, rotation: -45, opacity: 0, duration: 0.6, ease: "back.out(2)" }, "-=0.4")
               .from("#logo-dot", { scale: 0, opacity: 0, duration: 0.4, ease: "back.out(3)" }, "-=0.2")
               .from("#logo-dot-1, #logo-dot-2, #logo-dot-3, #logo-dot-4", { scale: 0, opacity: 0, duration: 0.4, stagger: 0.06, ease: "back.out(2)" }, "-=0.1")
               .from("#logo-dot-5, #logo-dot-6, #logo-dot-7, #logo-dot-8", { scale: 0, opacity: 0, duration: 0.3, stagger: 0.05, ease: "back.out(2)" }, "-=0.1")
               .from("#hero-visual .hero-brand > *:not(#gsap-logo)", { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.3")
               .from("#home .hero-heading", { y: 30, opacity: 0, duration: 0.7, ease: "power3.out" }, "-=0.5")
               .from("#home p", { y: 20, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.4")
               .from("#home .social-link", { y: 20, opacity: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.3")
               .from("#home .btn-primary, #home .btn-download", { y: 20, opacity: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.2");
    }

    // =========================================
    // 12b. GSAP SCROLLTRIGGER (desktop only — heavy)
    // =========================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && window.innerWidth >= 768) {
        gsap.registerPlugin(ScrollTrigger);

        // Horizontal Scroll Collage for Projects
        let projectsContainer = document.querySelector(".projects-container");
        let projectsWrapper = document.querySelector(".projects-wrapper");

        if (projectsContainer && projectsWrapper) {
            let mm = gsap.matchMedia();
            mm.add("(min-width: 768px)", () => {
                const getScrollAmount = () => projectsContainer.scrollWidth - window.innerWidth + (window.innerWidth * 0.1);

                const tween = gsap.to(projectsContainer, {
                    x: () => -getScrollAmount(),
                    ease: "none",
                    force3D: true
                });
                ScrollTrigger.create({
                    trigger: projectsWrapper,
                    start: "top top",
                    end: () => `+=${getScrollAmount()}`,
                    pin: true,
                    animation: tween,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    anticipatePin: 1,
                    onUpdate: (self) => {
                        const fill = document.getElementById('project-scroll-fill');
                        if (fill) fill.style.width = (self.progress * 100) + '%';
                    }
                });

                // Refresh once after all images load for accurate widths
                let imagesLoaded = 0;
                const totalImages = projectsContainer.querySelectorAll('img').length;
                if (totalImages > 0) {
                    projectsContainer.querySelectorAll('img').forEach(img => {
                        if (img.complete) {
                            imagesLoaded++;
                            if (imagesLoaded === totalImages) ScrollTrigger.refresh();
                        } else {
                            img.addEventListener('load', () => {
                                imagesLoaded++;
                                if (imagesLoaded === totalImages) ScrollTrigger.refresh();
                            }, { once: true });
                        }
                    });
                }
            });
        }
    }       // end if(gsap)

    // =========================================
    // 14. DOWNLOAD CV CONFETTI EFFECT
    // =========================================
    const btnDownload = document.getElementById("download-cv");
    if (btnDownload) {
        btnDownload.addEventListener("click", () => {
            const duration = 2000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                const particleCount = 50 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
            }, 250);
        });
    }

    // =========================================
    // 15. AOS — SCROLL ANIMATIONS
    // =========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100,
            disable: window.innerWidth < 768 ? 'mobile' : false
        });
    }

    // =========================================
    // 16. SCROLL HANDLER (Ringan)
    // =========================================
    let rafId = false;
    let revealBatch;

    window.addEventListener('scroll', () => {
        if (!rafId) {
            rafId = true;
            requestAnimationFrame(() => {
                updateUIOnScroll(window.scrollY);
                rafId = false;
            });
        }
        clearTimeout(revealBatch);
        revealBatch = setTimeout(() => {
            revealElements.forEach((el) => {
                if (el.getBoundingClientRect().top < window.innerHeight - 100) {
                    el.classList.add('active');
                }
            });
        }, 120);
    }, { passive: true });

    // Anchor smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const mobileNav = document.getElementById('mobile-nav');
            if (mobileNav) mobileNav.classList.add('-translate-y-full', 'opacity-0');
        });
    });

    // =========================================
    // 17. PROGRESS BAR ANIMATION
    // =========================================
    const progressBars = document.querySelectorAll('.progress-bar-fill');
    if (progressBars.length) {
        const barObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.getAttribute('data-width');
                    setTimeout(() => {
                        bar.style.width = width + '%';
                    }, 200);
                    barObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.3 });

        progressBars.forEach(bar => barObserver.observe(bar));
    }


});
