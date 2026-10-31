// ========================================================
// 1NKUSS ADMIN CONTROL HUB - FIREBASE AUTH & CMS CORE
// ========================================================

const STORAGE_KEY = 'cv1nkus_site_config';

// 1. Factory Default Configuration
const DEFAULT_CONFIG = {
    hero: {
        role: "Energy Data Analyst",
        title1: "Digital & Data",
        titleHighlight: "Solutions",
        subtitle: "Energy Data Analyst & Fullstack Developer — turning complex data into actionable strategy.",
        typewriterWords: ["Developer", "Data Analyst", "Problem Solver", "Tech Enthusiast"],
        typewriterSpeed: 80
    },
    about: {
        vision: "My Vision",
        expYears: 3,
        projectsCount: 15,
        bio1: "Halo, saya Indra Nurul Kusuma, seorang profesional yang mengombinasikan keahlian Web Development dengan analisis data yang mendalam. Saat ini, saya berkarier sebagai Energy Data Analyst di PT Pratama Abadi Industri (IR).",
        bio2: "Saya memiliki passion dalam mengolah data energi yang kompleks menjadi wawasan strategis melalui pengembangan sistem dan visualisasi data yang efisien. Dengan latar belakang teknis yang kuat, saya mampu membangun solusi digital yang tidak hanya estetik secara visual tetapi juga fungsional dan berbasis data untuk mendukung pengambilan keputusan yang cerdas."
    },
    contact: {
        email: "indra1nkuss@gmail.com",
        location: "Tangerang, Indonesia",
        github: "https://github.com/indra1nkuss",
        linkedin: "https://www.linkedin.com/in/indra-nurul-kusuma-0143773ba",
        instagram: "https://www.instagram.com/gus.1nkuss"
    },
    media: {
        profileImg: "images/indra.webp",
        bgImg: "images/background-web.webp"
    },
    theme: {
        primaryColor: "#6366f1",
        accentColor: "#06b6d4",
        preset: "indigo"
    },
    animations: {
        bgZoom: true,
        auroraBg: true,
        bokehBg: true,
        tilt3D: true
    },
    cloudinary: {
        cloudName: "",
        uploadPreset: "",
        enabled: false
    },
    projects: [
        {
            id: "proj_1",
            title: "Portal Energi - Hall of Fame",
            category: "web",
            desc: "Portal informasi pusat untuk pemenang training online tahun 2026. Dilengkapi dengan daftar pemenang interaktif, dokumentasi Solar Photovoltaic, dan Energy AI Assistant untuk mendukung pengembangan kompetensi tim.",
            tech: "Tailwind, Three.js, Firebase",
            image: "images/portal-energi.png",
            link: "https://irenergyportal.vercel.app/"
        },
        {
            id: "proj_2",
            title: "Interactive 3D Portfolio",
            category: "web",
            desc: "Portfolio website pribadi dengan pengalaman pengguna yang imersif. Menggunakan Three.js untuk animasi 3D robot, Terminal CLI interaktif, dan integrasi Firebase untuk Guestbook realtime.",
            tech: "Tailwind, Three.js, Firebase, ChartJS",
            image: "images/portfolio-v3.webp",
            link: "https://indra1nkuss.github.io/cv1nkus/"
        },
        {
            id: "proj_3",
            title: "Pendataan Mesin V2",
            category: "web",
            desc: "Sistem manajemen pendataan mesin industri untuk menentukan ENPI (Energy Performance Indicator) dan SEU (Significant Energy Use) secara akurat per area maupun keseluruhan. Membantu optimasi konsumsi energi di lingkungan pabrik.",
            tech: "Laravel, MySQL, Bootstrap",
            image: "images/pendataan-mesin.webp",
            link: "https://pendataanmesinv2.great-site.net/login"
        },
        {
            id: "proj_4",
            title: "UAS Cashflow App",
            category: "mobile",
            desc: "Aplikasi pencatat keuangan (Cashflow) berbasis mobile. Dibangun menggunakan Flutter dengan integrasi Firebase Authentication dan Realtime Database untuk pengelolaan data pemasukan dan pengeluaran secara efisien.",
            tech: "Flutter, Firebase, Dart",
            image: "images/cashflow-app.webp",
            link: "https://github.com/Julianarwansah/uas_cashflow_app"
        }
    ]
};

let currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
let firebaseDb = null;
let firebaseConfigRef = null;
let firebaseAuth = null;
let currentUser = null;

// ========================================================
// 2. FIREBASE INITIALIZATION & AUTH STATE
// ========================================================
const firebaseConfig = {
    apiKey: "AIzaSyC9JkHeCRkgHuw5_YHhC7W5c8TpEge_OWY",
    authDomain: "cvsaya-e0996.firebaseapp.com",
    projectId: "cvsaya-e0996",
    databaseURL: "https://cvsaya-e0996-default-rtdb.asia-southeast1.firebasedatabase.app/",
    storageBucket: "cvsaya-e0996.firebasestorage.app",
    messagingSenderId: "477452657261",
    appId: "1:477452657261:web:1d349552b452422db5d564"
};

try {
    if (typeof firebase !== 'undefined') {
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        firebaseDb = firebase.database();
        firebaseConfigRef = firebaseDb.ref('site_config');
        firebaseAuth = firebase.auth();

        // Realtime connection status
        firebaseDb.ref('.info/connected').on('value', (snap) => {
            const badge = document.getElementById('cloud-status-badge');
            if (badge) {
                if (snap.val() === true) {
                    badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Cloud & Local Synced';
                    badge.className = 'flex items-center gap-1.5 text-emerald-400';
                } else {
                    badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span> Local Offline Mode';
                    badge.className = 'flex items-center gap-1.5 text-amber-400';
                }
            }
        });

        // Firebase Auth Listener
        firebaseAuth.onAuthStateChanged((user) => {
            hideLoadingScreen();
            if (user) {
                currentUser = user;
                onUserLoggedIn(user);
            } else {
                currentUser = null;
                onUserLoggedOut();
            }
        });
    }
} catch (e) {
    console.error("Firebase init error:", e);
    hideLoadingScreen();
}

// ========================================================
// 3. AUTHENTICATION HANDLERS
// ========================================================
function onUserLoggedIn(user) {
    document.getElementById('login-overlay').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');

    // Update user info badges
    const emailBadge = document.getElementById('user-email-badge');
    const emailDisplay = document.getElementById('user-email-display');
    const avatar = document.getElementById('user-avatar');

    if (emailBadge) emailBadge.textContent = user.email || 'Admin';
    if (emailDisplay) emailDisplay.textContent = user.email || 'Admin';
    if (avatar) avatar.textContent = (user.email ? user.email.charAt(0).toUpperCase() : 'A');

    // Load CMS data
    loadConfigFromStorage();
}

function onUserLoggedOut() {
    document.getElementById('admin-dashboard').classList.add('hidden');
    document.getElementById('login-overlay').classList.remove('hidden');
}

function hideLoadingScreen() {
    const loader = document.getElementById('loading-screen');
    if (loader) loader.classList.add('hidden');
}

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const loginError = document.getElementById('login-error');
    const loginErrorMsg = document.getElementById('login-error-msg');
    const loginBtn = document.getElementById('login-btn');
    const loginBtnText = document.getElementById('login-btn-text');
    const loginBox = document.getElementById('login-box');

    if (!firebaseAuth) {
        showLoginError("Firebase Auth belum siap. Cek koneksi internet Anda.");
        return;
    }

    // Set loading state
    loginError.classList.add('hidden');
    loginBtn.disabled = true;
    loginBtn.classList.add('opacity-75');
    loginBtnText.innerHTML = '<i class="fas fa-circle-notch fa-spin mr-1"></i> Memeriksa Akun...';

    firebaseAuth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            showToast("Login berhasil! Selamat datang di Control Hub.", "success");
            loginBtnText.textContent = "Masuk ke Dashboard";
            loginBtn.disabled = false;
            loginBtn.classList.remove('opacity-75');
        })
        .catch((error) => {
            loginBtnText.textContent = "Masuk ke Dashboard";
            loginBtn.disabled = false;
            loginBtn.classList.remove('opacity-75');

            let msg = "Email atau password salah.";
            if (error.code === 'auth/user-not-found') {
                msg = "Email belum terdaftar di Firebase Authentication.";
            } else if (error.code === 'auth/wrong-password') {
                msg = "Password salah. Silakan coba lagi.";
            } else if (error.code === 'auth/invalid-email') {
                msg = "Format email tidak valid.";
            } else if (error.code === 'auth/too-many-requests') {
                msg = "Terlalu banyak percobaan gagal. Silakan coba beberapa saat lagi.";
            } else if (error.code === 'auth/operation-not-allowed') {
                msg = "Metode Email/Password belum diaktifkan di Firebase Console.";
            } else if (error.code === 'auth/network-request-failed') {
                msg = "Gagal terhubung ke server Firebase. Cek koneksi internet Anda.";
            } else {
                msg = error.message;
            }

            showLoginError(msg);
            loginBox.classList.add('animate-shake');
            setTimeout(() => loginBox.classList.remove('animate-shake'), 400);
        });
}

function showLoginError(msg) {
    const loginError = document.getElementById('login-error');
    const loginErrorMsg = document.getElementById('login-error-msg');
    if (loginError && loginErrorMsg) {
        loginErrorMsg.textContent = msg;
        loginError.classList.remove('hidden');
    }
}

function handleLogout() {
    if (confirm("Apakah Anda yakin ingin keluar dari Admin Hub?")) {
        if (firebaseAuth) {
            firebaseAuth.signOut().then(() => {
                showToast("Anda telah keluar.", "info");
            });
        }
    }
}

function togglePwdVisibility() {
    const pwdInput = document.getElementById('login-password');
    const eyeIcon = document.getElementById('eye-icon');
    if (!pwdInput || !eyeIcon) return;

    if (pwdInput.type === 'password') {
        pwdInput.type = 'text';
        eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        pwdInput.type = 'password';
        eyeIcon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

// ========================================================
// 4. CONFIG MANAGEMENT (LOAD & SAVE)
// ========================================================
function loadConfigFromStorage() {
    // 1. LocalStorage first (instant)
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
        try {
            const parsed = JSON.parse(local);
            currentConfig = deepMerge(DEFAULT_CONFIG, parsed);
        } catch (e) {
            console.error("Local parse error", e);
        }
    }
    populateFormFromConfig();

    // 2. Fetch latest from Firebase
    if (firebaseConfigRef) {
        firebaseConfigRef.once('value').then((snap) => {
            const cloudData = snap.val();
            if (cloudData) {
                currentConfig = deepMerge(DEFAULT_CONFIG, cloudData);
                localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
                populateFormFromConfig();
            }
        }).catch(err => console.log("Firebase sync fallback to local"));
    }
}

function deepMerge(target, source) {
    const result = { ...target };
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
            result[key] = source[key];
        }
    }
    return result;
}

function populateFormFromConfig() {
    // Hero
    setVal('cfg-hero-role', currentConfig.hero.role);
    setVal('cfg-hero-title-1', currentConfig.hero.title1);
    setVal('cfg-hero-title-highlight', currentConfig.hero.titleHighlight);
    setVal('cfg-hero-subtitle', currentConfig.hero.subtitle);
    setVal('cfg-typewriter-speed', currentConfig.hero.typewriterSpeed || 80);
    renderTypewriterWords(currentConfig.hero.typewriterWords || []);

    // About
    setVal('cfg-about-vision', currentConfig.about.vision);
    setVal('cfg-stat-exp', currentConfig.about.expYears);
    setVal('cfg-stat-projects', currentConfig.about.projectsCount);
    setVal('cfg-about-bio-1', currentConfig.about.bio1);
    setVal('cfg-about-bio-2', currentConfig.about.bio2);

    // Contact
    setVal('cfg-contact-email', currentConfig.contact.email);
    setVal('cfg-contact-location', currentConfig.contact.location);
    setVal('cfg-social-github', currentConfig.contact.github);
    setVal('cfg-social-linkedin', currentConfig.contact.linkedin);
    setVal('cfg-social-instagram', currentConfig.contact.instagram);

    // Cloudinary
    if (currentConfig.cloudinary) {
        setChecked('cfg-cloudinary-enabled', currentConfig.cloudinary.enabled);
        setVal('cfg-cloudinary-name', currentConfig.cloudinary.cloudName);
        setVal('cfg-cloudinary-preset', currentConfig.cloudinary.uploadPreset);
        toggleCloudinaryUI();
    }

    // Media
    setVal('cfg-profile-img-url', currentConfig.media.profileImg);
    setVal('cfg-bg-img-url', currentConfig.media.bgImg);
    updateImagePreview('preview-profile-img', currentConfig.media.profileImg, '../images/indra.webp');
    updateImagePreview('preview-bg-img', currentConfig.media.bgImg, '../images/background-web.webp');

    // Theme
    setVal('cfg-color-primary', currentConfig.theme.primaryColor || '#6366f1');
    setVal('cfg-color-primary-text', currentConfig.theme.primaryColor || '#6366f1');
    setVal('cfg-color-accent', currentConfig.theme.accentColor || '#06b6d4');
    setVal('cfg-color-accent-text', currentConfig.theme.accentColor || '#06b6d4');
    updateColorPreview();

    // Animations
    setChecked('cfg-anim-zoom', currentConfig.animations.bgZoom);
    setChecked('cfg-anim-aurora', currentConfig.animations.auroraBg);
    setChecked('cfg-anim-bokeh', currentConfig.animations.bokehBg);
    setChecked('cfg-anim-tilt', currentConfig.animations.tilt3D);

    // Projects CRUD
    renderAdminProjects();
}

function readFormIntoConfig() {
    // Hero
    currentConfig.hero.role = getVal('cfg-hero-role');
    currentConfig.hero.title1 = getVal('cfg-hero-title-1');
    currentConfig.hero.titleHighlight = getVal('cfg-hero-title-highlight');
    currentConfig.hero.subtitle = getVal('cfg-hero-subtitle');
    currentConfig.hero.typewriterSpeed = parseInt(getVal('cfg-typewriter-speed')) || 80;
    currentConfig.hero.typewriterWords = getTypewriterWordsFromDOM();

    // About
    currentConfig.about.vision = getVal('cfg-about-vision');
    currentConfig.about.expYears = parseInt(getVal('cfg-stat-exp')) || 0;
    currentConfig.about.projectsCount = parseInt(getVal('cfg-stat-projects')) || 0;
    currentConfig.about.bio1 = getVal('cfg-about-bio-1');
    currentConfig.about.bio2 = getVal('cfg-about-bio-2');

    // Contact
    currentConfig.contact.email = getVal('cfg-contact-email');
    currentConfig.contact.location = getVal('cfg-contact-location');
    currentConfig.contact.github = getVal('cfg-social-github');
    currentConfig.contact.linkedin = getVal('cfg-social-linkedin');
    currentConfig.contact.instagram = getVal('cfg-social-instagram');

    // Cloudinary
    if (!currentConfig.cloudinary) currentConfig.cloudinary = {};
    currentConfig.cloudinary.enabled = getChecked('cfg-cloudinary-enabled');
    currentConfig.cloudinary.cloudName = getVal('cfg-cloudinary-name');
    currentConfig.cloudinary.uploadPreset = getVal('cfg-cloudinary-preset');

    // Media
    currentConfig.media.profileImg = getVal('cfg-profile-img-url') || currentConfig.media.profileImg;
    currentConfig.media.bgImg = getVal('cfg-bg-img-url') || currentConfig.media.bgImg;

    // Theme
    currentConfig.theme.primaryColor = getVal('cfg-color-primary');
    currentConfig.theme.accentColor = getVal('cfg-color-accent');

    // Animations
    currentConfig.animations.bgZoom = getChecked('cfg-anim-zoom');
    currentConfig.animations.auroraBg = getChecked('cfg-anim-aurora');
    currentConfig.animations.bokehBg = getChecked('cfg-anim-bokeh');
    currentConfig.animations.tilt3D = getChecked('cfg-anim-tilt');
}

function saveAllChanges() {
    readFormIntoConfig();

    // 1. Save to LocalStorage
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentConfig));
    } catch (e) {
        console.error("LocalStorage save error", e);
    }

    // 2. Save to Firebase Cloud
    if (firebaseConfigRef) {
        firebaseConfigRef.set(currentConfig)
            .then(() => {
                showToast("Semua perubahan berhasil disimpan ke Cloud & Lokal!", "success");
            })
            .catch((err) => {
                console.warn("Firebase cloud save failed, local saved only", err);
                showToast("Tersimpan di LocalStorage (Offline Mode)", "info");
            });
    } else {
        showToast("Perubahan tersimpan di LocalStorage!", "success");
    }
}

// ========================================================
// 5. TYPEWRITER WORDS MANAGER
// ========================================================
function renderTypewriterWords(words) {
    const list = document.getElementById('typewriter-words-list');
    if (!list) return;
    list.innerHTML = '';
    words.forEach((word) => {
        const item = document.createElement('div');
        item.className = 'flex items-center gap-2 typewriter-word-item';
        item.innerHTML = `
            <input type="text" value="${escapeHtml(word)}" class="input-field flex-1">
            <button type="button" onclick="removeTypewriterWord(this)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition" title="Hapus kata">
                <i class="fas fa-trash-can text-xs"></i>
            </button>
        `;
        list.appendChild(item);
    });
}

function addTypewriterWord(text = "Kata Baru") {
    const list = document.getElementById('typewriter-words-list');
    if (!list) return;
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2 typewriter-word-item animate-fade-in';
    item.innerHTML = `
        <input type="text" value="${escapeHtml(text)}" class="input-field flex-1">
        <button type="button" onclick="removeTypewriterWord(this)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition" title="Hapus kata">
            <i class="fas fa-trash-can text-xs"></i>
        </button>
    `;
    list.appendChild(item);
}

function removeTypewriterWord(btn) {
    const row = btn.closest('.typewriter-word-item');
    if (row) row.remove();
}

function getTypewriterWordsFromDOM() {
    const inputs = document.querySelectorAll('#typewriter-words-list input');
    const words = [];
    inputs.forEach(inp => {
        const val = inp.value.trim();
        if (val) words.push(val);
    });
    return words.length > 0 ? words : ["Developer", "Data Analyst"];
}

// ========================================================
// 6. CLOUDINARY & MEDIA UPLOADS
// ========================================================
function toggleCloudinaryUI() {
    const enabled = getChecked('cfg-cloudinary-enabled');
    const name = getVal('cfg-cloudinary-name');
    const preset = getVal('cfg-cloudinary-preset');
    const badge = document.getElementById('cloudinary-status-badge');
    const fields = document.getElementById('cloudinary-fields');

    if (fields) {
        fields.style.opacity = enabled ? '1' : '0.5';
    }

    if (!badge) return;

    if (!enabled) {
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-slate-500"></span> Mode Upload Lokal (Base64)';
        badge.className = 'text-xs text-slate-400 flex items-center gap-1.5';
    } else if (name && preset) {
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Cloudinary Siap Digunakan';
        badge.className = 'text-xs text-emerald-400 font-medium flex items-center gap-1.5';
    } else {
        badge.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span> Isi Cloud Name & Preset Cloudinary';
        badge.className = 'text-xs text-amber-400 flex items-center gap-1.5';
    }
}

async function uploadToCloudinary(file) {
    const cloudName = getVal('cfg-cloudinary-name') || (currentConfig.cloudinary && currentConfig.cloudinary.cloudName);
    const uploadPreset = getVal('cfg-cloudinary-preset') || (currentConfig.cloudinary && currentConfig.cloudinary.uploadPreset);

    if (!cloudName || !uploadPreset) {
        throw new Error("Harap lengkapi Cloud Name dan Upload Preset Cloudinary!");
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset.trim());

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName.trim()}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error?.message || "Upload ke Cloudinary gagal. Pastikan Upload Preset bertipe 'Unsigned'.");
    }

    const data = await res.json();
    return data.secure_url;
}

async function testCloudinaryConnection() {
    const cloudName = getVal('cfg-cloudinary-name');
    const uploadPreset = getVal('cfg-cloudinary-preset');

    if (!cloudName || !uploadPreset) {
        showToast("Isi Cloud Name dan Upload Preset terlebih dahulu!", "error");
        return;
    }

    showToast("Menguji koneksi ke Cloudinary...", "info");
    try {
        const byteCharacters = atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAA=");
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const testBlob = new Blob([byteArray], { type: 'image/png' });

        await uploadToCloudinary(testBlob);
        showToast("Koneksi Cloudinary Berhasil! CDN siap digunakan.", "success");
        toggleCloudinaryUI();
    } catch(err) {
        showToast(err.message, "error");
    }
}

async function handleProfileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const useCloudinary = getChecked('cfg-cloudinary-enabled') && getVal('cfg-cloudinary-name') && getVal('cfg-cloudinary-preset');

    if (useCloudinary) {
        showToast("Mengunggah foto profil ke Cloudinary CDN...", "info");
        try {
            const url = await uploadToCloudinary(file);
            currentConfig.media.profileImg = url;
            setVal('cfg-profile-img-url', url);
            updateImagePreview('preview-profile-img', url);
            showToast("Foto profil tersimpan di Cloudinary CDN! Klik 'Simpan Semua'.", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message, "error");
        }
    } else {
        compressAndReadImage(file, 600, 800, (base64) => {
            currentConfig.media.profileImg = base64;
            setVal('cfg-profile-img-url', base64);
            updateImagePreview('preview-profile-img', base64);
            showToast("Foto profil baru dimuat! Klik 'Simpan Semua' untuk menerapkannya.", "info");
        });
    }
}

async function handleBackgroundUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const useCloudinary = getChecked('cfg-cloudinary-enabled') && getVal('cfg-cloudinary-name') && getVal('cfg-cloudinary-preset');

    if (useCloudinary) {
        showToast("Mengunggah background ke Cloudinary CDN...", "info");
        try {
            const url = await uploadToCloudinary(file);
            currentConfig.media.bgImg = url;
            setVal('cfg-bg-img-url', url);
            updateImagePreview('preview-bg-img', url);
            showToast("Background tersimpan di Cloudinary CDN! Klik 'Simpan Semua'.", "success");
        } catch (err) {
            console.error(err);
            showToast(err.message, "error");
        }
    } else {
        compressAndReadImage(file, 1920, 1080, (base64) => {
            currentConfig.media.bgImg = base64;
            setVal('cfg-bg-img-url', base64);
            updateImagePreview('preview-bg-img', base64);
            showToast("Background baru dimuat! Klik 'Simpan Semua' untuk menerapkannya.", "info");
        });
    }
}

function applyProfileUrl() {
    const url = getVal('cfg-profile-img-url');
    if (url) {
        currentConfig.media.profileImg = url;
        updateImagePreview('preview-profile-img', url, '../images/indra.webp');
        showToast("URL Foto Profil diperbarui!", "info");
    }
}

function applyBgUrl() {
    const url = getVal('cfg-bg-img-url');
    if (url) {
        currentConfig.media.bgImg = url;
        updateImagePreview('preview-bg-img', url, '../images/background-web.webp');
        showToast("URL Background diperbarui!", "info");
    }
}

function resetProfileImg() {
    const def = DEFAULT_CONFIG.media.profileImg;
    currentConfig.media.profileImg = def;
    setVal('cfg-profile-img-url', def);
    updateImagePreview('preview-profile-img', def, '../' + def);
    showToast("Foto profil di-reset ke bawaan.", "info");
}

function resetBgImg() {
    const def = DEFAULT_CONFIG.media.bgImg;
    currentConfig.media.bgImg = def;
    setVal('cfg-bg-img-url', def);
    updateImagePreview('preview-bg-img', def, '../' + def);
    showToast("Background di-reset ke bawaan.", "info");
}

function updateImagePreview(id, src, fallback) {
    const img = document.getElementById(id);
    if (!img) return;
    if (src.startsWith('data:') || src.startsWith('http')) {
        img.src = src;
    } else {
        img.src = '../' + src;
    }
    img.onerror = () => {
        if (fallback) img.src = fallback;
    };
}

function compressAndReadImage(file, maxW, maxH, callback) {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
        const image = new Image();
        image.onload = () => {
            let canvas = document.createElement('canvas');
            let width = image.width;
            let height = image.height;

            if (width > height) {
                if (width > maxW) {
                    height = Math.round((height * maxW) / width);
                    width = maxW;
                }
            } else {
                if (height > maxH) {
                    width = Math.round((width * maxH) / height);
                    height = maxH;
                }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(image, 0, 0, width, height);

            const dataUrl = canvas.toDataURL('image/webp', 0.82);
            callback(dataUrl);
        };
        image.src = readerEvent.target.result;
    };
    reader.readAsDataURL(file);
}

// ========================================================
// 7. THEME & COLORS
// ========================================================
function applyColorPreset(primary, accent) {
    setVal('cfg-color-primary', primary);
    setVal('cfg-color-primary-text', primary);
    setVal('cfg-color-accent', accent);
    setVal('cfg-color-accent-text', accent);
    updateColorPreview();
    showToast("Palet warna diterapkan!", "info");
}

function syncColorFromPicker(type) {
    if (type === 'primary') {
        const val = getVal('cfg-color-primary');
        setVal('cfg-color-primary-text', val);
    } else {
        const val = getVal('cfg-color-accent');
        setVal('cfg-color-accent-text', val);
    }
    updateColorPreview();
}

function syncColorFromText(type) {
    if (type === 'primary') {
        const val = getVal('cfg-color-primary-text');
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            setVal('cfg-color-primary', val);
            updateColorPreview();
        }
    } else {
        const val = getVal('cfg-color-accent-text');
        if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
            setVal('cfg-color-accent', val);
            updateColorPreview();
        }
    }
}

function updateColorPreview() {
    const primary = getVal('cfg-color-primary');
    const accent = getVal('cfg-color-accent');
    setVal('cfg-color-primary-text', primary);
    setVal('cfg-color-accent-text', accent);

    const btn = document.getElementById('preview-btn-sample');
    if (btn) {
        btn.style.background = `linear-gradient(135deg, ${primary}, #4f46e5)`;
    }

    const badge = document.getElementById('preview-badge-sample');
    if (badge) {
        badge.style.background = `${accent}33`;
        badge.style.color = accent;
        badge.style.border = `1px solid ${accent}55`;
    }

    const text = document.getElementById('preview-text-sample');
    if (text) {
        text.style.background = `linear-gradient(135deg, ${primary}, ${accent})`;
        text.style.webkitBackgroundClip = 'text';
        text.style.webkitTextFillColor = 'transparent';
    }
}

// ========================================================
// 8. BACKUP & RESTORE
// ========================================================
function exportBackupJSON() {
    readFormIntoConfig();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentConfig, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `1nkuss_portfolio_config_${new Date().toISOString().slice(0,10)}.json`);
    dlAnchor.click();
    dlAnchor.remove();
    showToast("File backup JSON berhasil diunduh!", "success");
}

function importBackupJSON(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const imported = JSON.parse(event.target.result);
            currentConfig = deepMerge(DEFAULT_CONFIG, imported);
            populateFormFromConfig();
            saveAllChanges();
            showToast("Konfigurasi dari file berhasil dipulihkan!", "success");
        } catch (err) {
            showToast("File JSON tidak valid!", "error");
        }
    };
    reader.readAsText(file);
}

function resetToFactoryDefaults() {
    if (confirm("Apakah Anda yakin ingin mengembalikan semua data ke setelan awal pabrik? Tindakan ini tidak dapat dibatalkan.")) {
        currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        populateFormFromConfig();
        saveAllChanges();
        showToast("Semua pengaturan telah di-reset ke setelan awal!", "success");
    }
}

// ========================================================
// 8.5. PROJECT CRUD MANAGEMENT (TAMBAH / EDIT / HAPUS)
// ========================================================
function renderAdminProjects() {
    const grid = document.getElementById('admin-projects-grid');
    if (!grid) return;

    if (!currentConfig.projects || !Array.isArray(currentConfig.projects)) {
        currentConfig.projects = JSON.parse(JSON.stringify(DEFAULT_CONFIG.projects));
    }

    if (currentConfig.projects.length === 0) {
        grid.innerHTML = `
            <div class="sm:col-span-2 text-center py-12 glass-card rounded-2xl border border-white/5">
                <i class="fas fa-folder-open text-4xl text-slate-500 mb-3"></i>
                <h4 class="text-white font-bold text-base mb-1">Belum ada proyek</h4>
                <p class="text-slate-400 text-xs mb-4">Klik tombol di atas untuk menambahkan proyek pertama Anda.</p>
                <button type="button" onclick="openProjectModal()" class="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-semibold transition">
                    + Tambah Proyek Sekarang
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = currentConfig.projects.map((p, index) => {
        const catBadge = {
            'web': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'mobile': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            'data': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            'system': 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        }[p.category] || 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';

        const imgSrc = p.image.startsWith('http') || p.image.startsWith('data:') ? p.image : ('../' + p.image);

        return `
            <div class="glass-card rounded-2xl border border-white/10 overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition duration-300">
                <div>
                    <div class="aspect-[16/9] w-full overflow-hidden relative bg-dark">
                        <img src="${imgSrc}" alt="${escapeHtml(p.title)}" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" onerror="this.src='../images/portfolio-v3.webp'">
                        <span class="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${catBadge}">
                            ${p.category || 'Web'}
                        </span>
                    </div>

                    <div class="p-5">
                        <h3 class="text-base font-bold text-white mb-2 line-clamp-1">${escapeHtml(p.title)}</h3>
                        <p class="text-xs text-slate-400 mb-3 line-clamp-2 leading-relaxed">${escapeHtml(p.desc || '-')}</p>
                        
                        <div class="flex flex-wrap gap-1.5 mb-3">
                            ${(p.tech || '').split(',').map(t => t.trim()).filter(Boolean).map(t => `
                                <span class="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-slate-300 font-mono">${escapeHtml(t)}</span>
                            `).join('')}
                        </div>

                        ${p.link ? `
                            <a href="${escapeHtml(p.link)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-medium transition">
                                <i class="fas fa-link text-[10px]"></i> <span class="truncate max-w-[240px]">${escapeHtml(p.link)}</span> <i class="fas fa-arrow-up-right-from-square text-[9px]"></i>
                            </a>
                        ` : `
                            <span class="text-xs text-slate-500 italic">Belum ada link website</span>
                        `}
                    </div>
                </div>

                <div class="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-2">
                    <span class="text-[11px] text-slate-500 font-mono">#${index + 1}</span>
                    <div class="flex items-center gap-2">
                        <button type="button" onclick="openProjectModal('${p.id}')" class="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
                            <i class="fas fa-pen text-[10px]"></i> Edit
                        </button>
                        <button type="button" onclick="deleteProject('${p.id}')" class="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-semibold transition flex items-center gap-1.5">
                            <i class="fas fa-trash-can text-[10px]"></i> Hapus
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function openProjectModal(id) {
    const modal = document.getElementById('project-form-modal');
    const titleText = document.getElementById('project-modal-title-text');
    if (!modal) return;

    if (id) {
        // Edit mode
        const proj = (currentConfig.projects || []).find(p => p.id === id);
        if (!proj) return;

        titleText.innerHTML = '<i class="fas fa-pen-to-square text-primary"></i> Edit Proyek';
        setVal('proj-edit-id', proj.id);
        setVal('proj-input-title', proj.title);
        setVal('proj-input-category', proj.category || 'web');
        setVal('proj-input-tech', proj.tech || '');
        setVal('proj-input-link', proj.link || '');
        setVal('proj-input-desc', proj.desc || '');
        setVal('proj-input-image', proj.image || '');

        const preview = document.getElementById('proj-preview-image');
        if (preview) {
            const src = proj.image;
            preview.src = src.startsWith('http') || src.startsWith('data:') ? src : ('../' + src);
        }
    } else {
        // Create new mode
        titleText.innerHTML = '<i class="fas fa-folder-plus text-primary"></i> Tambah Proyek Baru';
        setVal('proj-edit-id', '');
        setVal('proj-input-title', '');
        setVal('proj-input-category', 'web');
        setVal('proj-input-tech', '');
        setVal('proj-input-link', '');
        setVal('proj-input-desc', '');
        setVal('proj-input-image', 'images/portfolio-v3.webp');

        const preview = document.getElementById('proj-preview-image');
        if (preview) preview.src = '../images/portfolio-v3.webp';
    }

    modal.classList.remove('hidden');
}

function closeProjectModal() {
    const modal = document.getElementById('project-form-modal');
    if (modal) modal.classList.add('hidden');
}

function saveProjectItem(e) {
    e.preventDefault();

    const id = getVal('proj-edit-id');
    const title = getVal('proj-input-title');
    const category = getVal('proj-input-category') || 'web';
    const tech = getVal('proj-input-tech');
    const link = getVal('proj-input-link');
    const desc = getVal('proj-input-desc');
    const image = getVal('proj-input-image') || 'images/portfolio-v3.webp';

    if (!title) {
        showToast("Judul proyek wajib diisi!", "error");
        return;
    }

    if (!currentConfig.projects) currentConfig.projects = [];

    if (id) {
        // Update existing
        const idx = currentConfig.projects.findIndex(p => p.id === id);
        if (idx !== -1) {
            currentConfig.projects[idx] = {
                id,
                title,
                category,
                tech,
                link,
                desc,
                image
            };
            showToast("Proyek berhasil diperbarui!", "success");
        }
    } else {
        // Create new
        const newProj = {
            id: 'proj_' + Date.now(),
            title,
            category,
            tech,
            link,
            desc,
            image
        };
        currentConfig.projects.unshift(newProj);
        showToast("Proyek baru berhasil ditambahkan!", "success");
    }

    closeProjectModal();
    saveAllChanges();
    renderAdminProjects();
}

function deleteProject(id) {
    const proj = (currentConfig.projects || []).find(p => p.id === id);
    const title = proj ? proj.title : 'proyek ini';

    if (confirm(`Apakah Anda yakin ingin menghapus "${title}"?`)) {
        currentConfig.projects = (currentConfig.projects || []).filter(p => p.id !== id);
        saveAllChanges();
        renderAdminProjects();
        showToast("Proyek berhasil dihapus.", "info");
    }
}

async function handleProjectImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const useCloudinary = getChecked('cfg-cloudinary-enabled') && getVal('cfg-cloudinary-name') && getVal('cfg-cloudinary-preset');

    if (useCloudinary) {
        showToast("Mengunggah gambar proyek ke Cloudinary CDN...", "info");
        try {
            const url = await uploadToCloudinary(file);
            setVal('proj-input-image', url);
            const preview = document.getElementById('proj-preview-image');
            if (preview) preview.src = url;
            showToast("Foto proyek berhasil diupload ke Cloudinary!", "success");
        } catch(err) {
            console.error(err);
            showToast(err.message, "error");
        }
    } else {
        compressAndReadImage(file, 800, 500, (base64) => {
            setVal('proj-input-image', base64);
            const preview = document.getElementById('proj-preview-image');
            if (preview) preview.src = base64;
            showToast("Foto proyek siap disimpan!", "info");
        });
    }
}

function updateProjectPreviewFromInput() {
    const url = getVal('proj-input-image');
    const preview = document.getElementById('proj-preview-image');
    if (preview && url) {
        preview.src = url.startsWith('http') || url.startsWith('data:') ? url : ('../' + url);
    }
}

function testProjectLink() {
    const url = getVal('proj-input-link');
    if (!url) {
        showToast("Masukkan link website terlebih dahulu!", "error");
        return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
}

// ========================================================
// 9. UI HELPERS & TABS
// ========================================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.remove('hidden');

    const targetBtn = document.getElementById('btn-' + tabId);
    if (targetBtn) targetBtn.classList.add('active');
}

function showToast(msg, type = "success") {
    const toast = document.getElementById('admin-toast');
    const toastMsg = document.getElementById('admin-toast-msg');
    const toastTitle = document.getElementById('admin-toast-title');
    const toastIcon = document.getElementById('admin-toast-icon');

    if (!toast) return;

    toastMsg.textContent = msg;

    if (type === "success") {
        toastTitle.textContent = "Berhasil";
        toastIcon.innerHTML = '<i class="fas fa-check"></i>';
        toastIcon.className = 'w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm';
    } else if (type === "error") {
        toastTitle.textContent = "Gagal";
        toastIcon.innerHTML = '<i class="fas fa-xmark"></i>';
        toastIcon.className = 'w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm';
    } else {
        toastTitle.textContent = "Informasi";
        toastIcon.innerHTML = '<i class="fas fa-info"></i>';
        toastIcon.className = 'w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm';
    }

    toast.classList.remove('translate-y-24', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-24', 'opacity-0');
    }, 3200);
}

function getVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val !== undefined && val !== null ? val : '';
}

function getChecked(id) {
    const el = document.getElementById(id);
    return el ? el.checked : false;
}

function setChecked(id, val) {
    const el = document.getElementById(id);
    if (el) el.checked = Boolean(val);
}

function escapeHtml(str) {
    return str ? String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
}
