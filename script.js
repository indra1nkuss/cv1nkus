document.addEventListener('DOMContentLoaded', () => {
    
    // =========================================
    // 0. PRELOADER & TOAST UTILITY
    // =========================================
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

    // Confetti on Download
    const downloadCvBtn = document.getElementById('download-cv');
    if (downloadCvBtn) {
        downloadCvBtn.addEventListener('click', (e) => {
            // Trigger confetti
            if (typeof confetti === 'function') {
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }

                const interval = setInterval(function() {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }

                    const particleCount = 50 * (timeLeft / duration);
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
                    confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
                }, 250);
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
    // 1. TYPEWRITER EFFECT
    // =========================================
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const phrases = ["Developer", "Data Analyst", "Problem Solver"];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIndex];
            
            if (isDeleting) {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150;
            }

            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }

            setTimeout(type, typeSpeed);
        }
        type();
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
    
    const handleScroll = () => {
        const scrolled = window.scrollY;
        
        // Navbar
        if (scrolled > 50) {
            navbar.classList.add('py-2', 'bg-dark/80');
            navbar.classList.remove('py-4');
        } else {
            navbar.classList.remove('py-2', 'bg-dark/80');
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

        // Reveal
        revealElements.forEach((reveal) => {
            const elementTop = reveal.getBoundingClientRect().top;
            if (elementTop < window.innerHeight - 150) {
                reveal.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

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

    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');
    
    if (cursorDot && cursorOutline) {
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
    // 4. THREE.JS 3D ROBOT HEAD (Restored)
    // =========================================
    const container = document.getElementById('robot-3d-container');
    if (container) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        const robotHead = new THREE.Group();
        scene.add(robotHead);

        // Stylized Robot head using a rounded-like geometry
        const mainMaterial = new THREE.MeshPhongMaterial({ color: 0x6366f1, transparent: true, opacity: 0.2, shininess: 100 });
        const wireframeMaterial = new THREE.MeshBasicMaterial({ color: 0x6366f1, wireframe: true, transparent: true, opacity: 0.1 });
        const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

        const geometry = new THREE.BoxGeometry(2, 2.2, 1.8);
        const coreHead = new THREE.Mesh(geometry, mainMaterial);
        const coreWire = new THREE.Mesh(geometry, wireframeMaterial);
        robotHead.add(coreHead);
        robotHead.add(coreWire);

        const eyeGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const eyeL = new THREE.Mesh(eyeGeo, eyeMaterial);
        const eyeR = new THREE.Mesh(eyeGeo, eyeMaterial);
        eyeL.position.set(-0.5, 0.3, 0.9);
        eyeR.position.set(0.5, 0.3, 0.9);
        robotHead.add(eyeL);
        robotHead.add(eyeR);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x6366f1, 2, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        camera.position.z = 5;

        let mouseX = 0, mouseY = 0;
        let targetX = 0, targetY = 0;

        window.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        const animate = () => {
            requestAnimationFrame(animate);
            targetX += (mouseX - targetX) * 0.05;
            targetY += (mouseY - targetY) * 0.05;
            robotHead.rotation.y = targetX * 0.5;
            robotHead.rotation.x = -targetY * 0.3;
            robotHead.position.y = Math.sin(Date.now() * 0.001) * 0.1;
            renderer.render(scene, camera);
        };
        animate();

        window.addEventListener('resize', () => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        });
    }

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
    // 11. ENERGY CHART (CHART.JS)
    // =========================================
    const ctx = document.getElementById('energyChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026', 'Q3 2026', 'Q4 2026'],
                datasets: [
                    {
                        type: 'line',
                        label: 'Akumulasi Penurunan Efisiensi (%)',
                        data: [5, 10, 15, 20, 25, 30, 35, 40],
                        borderColor: '#38bdf8',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.4,
                        pointBackgroundColor: '#38bdf8',
                        pointBorderColor: '#fff',
                        pointHoverRadius: 6,
                        yAxisID: 'y1'
                    },
                    {
                        type: 'bar',
                        label: 'Total Proyek Selesai',
                        data: [1, 2, 3, 4, 5, 6, 7, 8],
                        backgroundColor: 'rgba(99, 102, 241, 0.5)',
                        borderColor: '#6366f1',
                        borderWidth: 1,
                        borderRadius: 4,
                        yAxisID: 'y'
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: { color: '#94a3b8', font: { family: 'Inter' } }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#38bdf8', callback: function(value) { return value + '%' } }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });
    }

    // Fix for "Unsafe attempt to load URL" in file:// mode
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href.startsWith('#')) return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                const mobileNav = document.getElementById('mobile-nav');
                if (mobileNav) mobileNav.classList.add('-translate-y-full', 'opacity-0');
            }
        });
    });

});
