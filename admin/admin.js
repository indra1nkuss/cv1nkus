// ========================================================
// 1NKUSS ADMIN CONTROL HUB - JAVASCRIPT CORE
// ========================================================

const STORAGE_KEY = 'cv1nkus_site_config';
const AUTH_KEY = 'cv1nkus_admin_auth';
const DEFAULT_PIN = '1nkuss2026';

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
    security: {
        adminPin: DEFAULT_PIN
    }
};

let currentConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
let firebaseDb = null;
let firebaseConfigRef = null;

// ========================================================
// 2. FIREBASE INITIALIZATION
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

        // Check connection
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
    }
} catch (e) {
    console.warn("Firebase init skipped:", e);
}

// ========================================================
// 3. AUTHENTICATION & SESSION
// ========================================================
function checkAuth() {
    loadConfigFromStorage();
    const isAuth = sessionStorage.getItem(AUTH_KEY);
    const loginOverlay = document.getElementById('login-overlay');
    const adminDashboard = document.getElementById('admin-dashboard');

    if (isAuth === 'true') {
        loginOverlay.classList.add('hidden');
        adminDashboard.classList.remove('hidden');
        populateFormFromConfig();
    } else {
        loginOverlay.classList.remove('hidden');
        adminDashboard.classList.add('hidden');
    }
}

function handleLogin(event) {
    event.preventDefault();
    const pinInput = document.getElementById('login-pin').value;
    const loginBox = document.getElementById('login-box');
    const loginError = document.getElementById('login-error');

    const validPin = (currentConfig.security && currentConfig.security.adminPin) ? currentConfig.security.adminPin : DEFAULT_PIN;

    if (pinInput === validPin) {
        sessionStorage.setItem(AUTH_KEY, 'true');
        loginError.classList.add('hidden');
        document.getElementById('login-overlay').classList.add('hidden');
        document.getElementById('admin-dashboard').classList.remove('hidden');
        populateFormFromConfig();
        showToast("Selamat datang di Admin Control Hub!", "success");
    } else {
        loginError.classList.remove('hidden');
        loginBox.classList.add('animate-shake');
        setTimeout(() => loginBox.classList.remove('animate-shake'), 400);
    }
}

function handleLogout() {
    sessionStorage.removeItem(AUTH_KEY);
    window.location.reload();
}

function togglePasswordVisibility() {
    const pinInput = document.getElementById('login-pin');
    const eyeIcon = document.getElementById('eye-icon');
    if (pinInput.type === 'password') {
        pinInput.type = 'text';
        eyeIcon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        pinInput.type = 'password';
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

    // 2. Fetch from Firebase if online
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
        console.error("LocalStorage save error (storage limit?)", e);
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
    list.innerHTML = '';
    words.forEach((word, index) => {
        const item = document.createElement('div');
        item.className = 'flex items-center gap-2 typewriter-word-item';
        item.innerHTML = `
            <input type="text" value="${escapeHtml(word)}" class="flex-1 px-3 py-2 bg-darker/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary">
            <button type="button" onclick="removeTypewriterWord(this)" class="w-9 h-9 flex items-center justify-center rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition" title="Hapus kata">
                <i class="fas fa-trash-can text-xs"></i>
            </button>
        `;
        list.appendChild(item);
    });
}

function addTypewriterWord(text = "Kata Baru") {
    const list = document.getElementById('typewriter-words-list');
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2 typewriter-word-item animate-fade-in';
    item.innerHTML = `
        <input type="text" value="${escapeHtml(text)}" class="flex-1 px-3 py-2 bg-darker/60 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-primary">
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
// 6. MEDIA & IMAGE UPLOADS (WITH FAST COMPRESSION)
// ========================================================
function handleProfileUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    compressAndReadImage(file, 600, 800, (base64) => {
        currentConfig.media.profileImg = base64;
        setVal('cfg-profile-img-url', base64);
        updateImagePreview('preview-profile-img', base64);
        showToast("Foto profil baru dimuat! Klik 'Simpan Semua' untuk menerapkannya.", "info");
    });
}

function handleBackgroundUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    compressAndReadImage(file, 1920, 1080, (base64) => {
        currentConfig.media.bgImg = base64;
        setVal('cfg-bg-img-url', base64);
        updateImagePreview('preview-bg-img', base64);
        showToast("Background baru dimuat! Klik 'Simpan Semua' untuk menerapkannya.", "info");
    });
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

            // Compress to webp or jpeg quality 0.8
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
function applyColorPreset(primary, accent, presetName) {
    setVal('cfg-color-primary', primary);
    setVal('cfg-color-primary-text', primary);
    setVal('cfg-color-accent', accent);
    setVal('cfg-color-accent-text', accent);
    currentConfig.theme.preset = presetName;
    updateColorPreview();
    showToast(`Palet ${presetName.toUpperCase()} dipilih!`, "info");
}

function syncColorInput(type) {
    if (type === 'primary') {
        const textVal = getVal('cfg-color-primary-text');
        if (/^#[0-9A-F]{6}$/i.test(textVal)) {
            setVal('cfg-color-primary', textVal);
            updateColorPreview();
        }
    } else {
        const textVal = getVal('cfg-color-accent-text');
        if (/^#[0-9A-F]{6}$/i.test(textVal)) {
            setVal('cfg-color-accent', textVal);
            updateColorPreview();
        }
    }
}

function updateColorPreview() {
    const primary = getVal('cfg-color-primary');
    const accent = getVal('cfg-color-accent');
    setVal('cfg-color-primary-text', primary);
    setVal('cfg-color-accent-text', accent);

    // Update preview samples
    const btn = document.getElementById('preview-btn-sample');
    if (btn) {
        btn.style.background = `linear-gradient(135deg, ${primary}, #4f46e5)`;
        btn.style.boxShadow = `0 4px 15px ${primary}40`;
    }

    const badge = document.getElementById('preview-badge-sample');
    if (badge) {
        badge.style.background = `${accent}20`;
        badge.style.color = accent;
        badge.style.border = `1px solid ${accent}40`;
    }

    const text = document.getElementById('preview-text-sample');
    if (text) {
        text.style.background = `linear-gradient(135deg, ${primary}, ${accent})`;
        text.style.webkitBackgroundClip = 'text';
        text.style.webkitTextFillColor = 'transparent';
    }
}

// ========================================================
// 8. SECURITY & BACKUP
// ========================================================
function updateAdminPin() {
    const p1 = getVal('cfg-new-pin');
    const p2 = getVal('cfg-confirm-pin');

    if (!p1 || p1.length < 4) {
        showToast("PIN minimal harus 4 karakter!", "error");
        return;
    }
    if (p1 !== p2) {
        showToast("Konfirmasi PIN tidak cocok!", "error");
        return;
    }

    if (!currentConfig.security) currentConfig.security = {};
    currentConfig.security.adminPin = p1;
    saveAllChanges();
    setVal('cfg-new-pin', '');
    setVal('cfg-confirm-pin', '');
    showToast("PIN Admin berhasil diperbarui!", "success");
}

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
        toastIcon.className = 'w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm';
    } else if (type === "error") {
        toastTitle.textContent = "Gagal";
        toastIcon.innerHTML = '<i class="fas fa-xmark"></i>';
        toastIcon.className = 'w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-sm';
    } else {
        toastTitle.textContent = "Informasi";
        toastIcon.innerHTML = '<i class="fas fa-info"></i>';
        toastIcon.className = 'w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm';
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

// Initial Boot
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
});

