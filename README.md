# ThreadsBot 🤖

ThreadsBot adalah aplikasi otomasi cerdas untuk platform Meta Threads. Ditenagai oleh **Gemini AI**, aplikasi ini dapat melakukan auto-posting konten organik, diskusi berbalas (thread), promosi produk *affiliate*, hingga *auto-reply* komentar secara sepenuhnya otomatis.

Dibangun dengan Node.js dan SQLite, aplikasi ini ringan, cepat, dan tidak memerlukan setup database server eksternal.

## ✨ Fitur Utama
*   **Auto Pilot**: AI yang menelusuri niche kamu dan menghasilkan konten secara otonom setiap hari.
*   **Content Queue**: Hasilkan puluhan ide konten spesifik dalam sekali klik, masukkan ke antrean, dan biarkan bot mempostingnya sesuai jadwal independen.
*   **Affiliate Promotion**: Pembuat post promosi (contoh: Shopee Affiliate) dengan teknik *soft-selling* dan *storytelling* yang natural.
*   **Smart Auto Reply**: Bot akan mengecek dan membalas komentar baru di postinganmu secara otomatis menggunakan gaya bahasa yang bisa disesuaikan (Friendly, Witty, Professional, Casual).
*   **Multi-Account**: Kelola dan jalankan banyak akun Threads sekaligus dalam satu dashboard.

---

## 🚀 Panduan Instalasi (Lokal & VPS)

### Prasyarat Asar
1. Pastikan kamu sudah menginstal **Node.js** (versi 18 ke atas) di komputer/VPS kamu.
2. Memiliki akun **Google AI Studio** untuk mendapatkan Gemini API Key.
3. Memiliki **Aplikasi Meta Developer** yang sudah dikonfigurasi untuk Threads API.

### Langkah Instalasi
1. **Clone repositori ini:**
   ```bash
   git clone https://github.com/aburasyidalfatih/threadsbot.git
   cd threadsbot
   ```

2. **Install semua dependensi:**
   ```bash
   npm install
   ```

3. **Konfigurasi Environment:**
   *  Copy file template environment: 
      * Windows: `copy .env.example .env`
      * Linux/Mac: `cp .env.example .env`
   *  Buka file `.env` dan isi nilai yang diperlukan (terutama `SESSION_SECRET` dan PORT jika berbeda).

4. **Jalankan Aplikasi:**
   ```bash
   npm start
   ```
   *Dashboard bisa diakses melalui browser di `http://localhost:3000`*

---

## 🌍 Cara Menjalankan 24 Jam di VPS (Rekomendasi)

Agar bot dapat berjalan 24/7 tanpa henti (meskipun terminal SSH VPS ditutup), sangat disarankan menggunakan **PM2** (Process Manager).

1. **Install PM2 secara global:**
   ```bash
   npm install -g pm2
   ```

2. **Jalankan ThreadsBot dengan PM2:**
   Di dalam folder aplikasi (`threadsbot`), jalankan perintah berikut:
   ```bash
   pm2 start server.js --name "threadsbot"
   ```

3. **(Opsional) Simpan konfigurasi agar auto-start saat VPS di-restart:**
   ```bash
   pm2 startup
   pm2 save
   ```

### Utilitas PM2 Berguna:
*   Melihat log realtime: `pm2 logs threadsbot`
*   Memonitor performa RAM & CPU: `pm2 monit`
*   Me-restart aplikasi: `pm2 restart threadsbot`
*   Menghentikan aplikasi: `pm2 stop threadsbot`

---

## ⚙️ Meta App Setup (Untuk Login Threads)
1. Buat aplikasi di [Meta for Developers](https://developers.facebook.com/).
2. Tambahkan produk **Threads API**.
3. Di pengaturan aplikasi Threads, atur **Valid OAuth Redirect URIs** ke:
   * `http://localhost:3000/callback/threads` (untuk pengujian lokal)
   * `https://domain-kamu.com/callback/threads` (jika sudah di VPS)
4. Dapatkan **App ID** dan **App Secret**, lalu masukkan ke menu **Akun** di dalam Dashboard ThreadsBot.

## 🔑 Pengaturan AI (Gemini)
1. Dapatkan API Key gratis dari [Google AI Studio](https://aistudio.google.com/).
2. Masukkan API Key tersebut di menu **Pengaturan** pada Dashboard ThreadsBot.

---
*Dibuat untuk kebutuhan otomasi & kemudahan konten kreator.*
