# Dokumentasi Portfolio v1nkus (Indra Nurul Kusuma)

Dokumentasi ini berisi penjelasan mengenai alur fitur, tampilan (UI), serta struktur kode dari website portfolio ini untuk mempermudah pengembangan atau perubahan di masa mendatang.

## 📁 Struktur File Utama
- `index.html`: Kerangka utama halaman web, memuat struktur HTML, CDN library pihak ketiga, dan konten statis.
- `style.css`: Berisi *custom styling* (variabel warna, glassmorphism, background dinamis, custom cursor, animasi marquee, dll).
- `script.js`: Berisi semua logika interaktif website, mulai dari animasi (GSAP), grafik (Chart.js), logika Terminal 3D/CLI, hingga integrasi backend untuk Guestbook (Firebase).

---

## 🎨 Tampilan dan Alur Fitur (UI/UX)

### 1. Global UI & Navigasi
- **Preloader**: Muncul di awal sebelum seluruh aset selesai di-load.
- **Custom Cursor**: Kursor diganti dengan titik (`cursor-dot`) dan garis luar bundar (`cursor-outline`) yang membesar/memberi efek highlight saat di-hover pada elemen yang bisa diklik.
- **Dynamic Background**: Latar belakang menggunakan kombinasi radial gradient (mesh-bg) dan overlay noise SVG untuk kesan futuristik dan modern.
- **Theme Toggle**: Tombol di pojok kanan atas navigasi (icon matahari/bulan) untuk beralih antara Dark Mode (default) dan Light Mode. Preferensi disimpan di `localStorage`.
- **Scroll Progress**: Bar progres di bagian paling atas layar yang bertambah seiring user melakukan *scroll* ke bawah.
- **Back to Top**: Tombol muncul saat scroll ke bawah untuk kembali ke atas halaman dengan mulus.

### 2. Beranda (Hero Section)
- Menampilkan teks perkenalan dengan efek **Typewriter** (Ketik otomatis) yang berganti-ganti ("Developer", "Data Analyst", "Problem Solver").
- Menampilkan **Animasi Burung Terbang 3D** menggunakan `<model-viewer>`. Animasi ini akan secara otomatis menampilkan burung yang terbang (posisi mengepakkan sayap). Jika burung tersebut di-klik, ia akan mengepakkan sayap dan terbang 3x lebih cepat selama 2 detik sebelum kembali ke kecepatan normal! Sama seperti sebelumnya, navigasi *scroll* di HP tetap aman dan mulus tanpa *bug* (anti nyangkut) berkat `touch-action="pan-y"`.
- Tombol **Download CV** yang jika ditekan akan memicu efek konfeti (Confetti.js) dari kedua sisi bawah layar.

### 3. Tentang (About)
- Teks ringkasan tentang Indra sebagai *Energy Data Analyst* dan *Web Developer*.
- **Stats Counter**: Angka pengalaman dan proyek (0 ke 3 dan 0 ke 15) yang otomatis terhitung naik (count up) saat elemen mulai terlihat di layar.
- **Tilt Card Profile**: Foto profil (indra.png) memiliki efek 3D Tilt interaktif saat mouse bergerak di atasnya.

### 4. Skills (Tech & Tools Arsenal)
- Menggunakan efek animasi **Marquee** tanpa henti yang menampilkan deretan kartu skill/teknologi (HTML, CSS, JS, React, Tailwind, Laravel, dll).

### 5. Analytics (Analitik Energi)
- Menampilkan grafik performa / penurunan efisiensi energi menggunakan **Chart.js**. Grafik gabungan dari garis (Line) dan batang (Bar).

### 6. Projects (Featured Projects)
- **Horizontal Scroll Parallax**: Dibangun dengan GSAP `ScrollTrigger`. Saat user men-scroll ke bawah di bagian ini, kartu proyek akan bergeser ke kiri secara halus (menyamping) alih-alih ke bawah.
- **Filter**: Tombol "Semua", "Web App", dan "Mobile" untuk memfilter proyek sesuai kategori (`data-category`).
- **Modal Detail Proyek**: Jika proyek diklik, popup (Modal) akan muncul menampilkan detail proyek, tumpukan teknologi, dan tombol untuk mengunjungi website bersangkutan.

### 7. Interactive Terminal (CLI)
- Simulasi terminal berbasis web. Pengguna dapat mengetikkan perintah di kolom input.
- Perintah yang didukung: 
  - `help`: Melihat daftar perintah
  - `whoami`: Menampilkan profil singkat
  - `skills`: Menampilkan list keahlian
  - `contact`: Menampilkan email & info kontak
  - `clear`: Membersihkan layar terminal.

### 8. Certificates
- Card statis yang menampilkan sertifikat (AWS dan Bootcamp Full Stack).

### 9. Kontak & Guestbook (Sharing Bareng)
- **Form Buku Tamu**: Pengunjung bisa memasukkan Nama dan Pesan.
- **Integrasi Firebase**: Data pesan langsung terhubung ke Firebase Realtime Database. Saat pengunjung mengirim pesan, pesan tersebut langsung disimpan di database dan secara *real-time* muncul di panel "Diskusi Terbaru" di sebelahnya tanpa perlu me-refresh halaman.
- **Toast Notification**: Popup hijau muncul sebentar di pojok kanan atas dengan animasi saat pesan berhasil terkirim.

---

## 🛠️ Panduan untuk Melakukan Perubahan

1. **Mengubah Tema Warna:**
   Buka `style.css` dan ubah nilai pada blok `:root` (untuk dark mode) atau blok `body.light-mode` (untuk light mode). Anda juga bisa mengubah setting konfigurasi tailwind pada tag `<script>` di `<head>` pada file `index.html`.
2. **Mengubah Konten Typewriter (Animasi Ketik):**
   Buka `script.js` lalu cari variabel `const phrases = ["Developer", "Data Analyst", "Problem Solver"];`. Ubah isi array tersebut sesuai keinginan.
3. **Mengubah Data Proyek:**
   Buka `index.html` dan cari bagian `<div class="project-card ...">`. Anda dapat menambah atau menghapus card dengan struktur yang sama, dan pastikan mengatur *data attributes* (`data-title`, `data-desc`, `data-tech`, `data-link`, `data-image`).
4. **Menambah Perintah Terminal:**
   Buka `script.js` dan cari objek `const commands = { ... }`. Tambahkan key (nama perintah) dan value (respon HTML yang ingin dimunculkan).
5. **Konfigurasi Firebase:**
   Jika ingin menggunakan database milik sendiri, ganti `firebaseConfig` di bagian bawah file `script.js` dengan kredensial Firebase Anda sendiri.
