# ThreadsBot - Sistem Autentikasi & Profil Pengguna

**Last Updated**: 2026-03-12
**Status**: ✅ Implemented

## 📋 Overview

Sistem autentikasi dan profil pengguna telah ditambahkan ke ThreadsBot dengan fitur:
- Login & Register
- Manajemen Profil (Nama, Email)
- Ubah Password
- Session Management
- Database Integration

## 🔐 Fitur Autentikasi

### 1. Login
- **URL**: `https://threadsbot.kelasmaster.id/login`
- **Method**: GET/POST
- **Validasi**: Email dan password
- **Keamanan**: Password di-hash dengan SHA256

### 2. Register
- **URL**: `https://threadsbot.kelasmaster.id/register`
- **Method**: GET/POST
- **Validasi**:
  - Email unik
  - Password minimal 6 karakter
  - Konfirmasi password harus cocok

### 3. Logout
- **URL**: `https://threadsbot.kelasmaster.id/logout`
- **Method**: GET
- **Efek**: Menghapus session dan redirect ke login

## 👤 Menu Profil

### Akses Profil
- **URL**: `https://threadsbot.kelasmaster.id/profile`
- **Lokasi**: Topbar kanan (ikon 👤)
- **Persyaratan**: Harus login

### Fitur Profil

#### 1. Update Informasi Profil
```
POST /profile/update
- name: Nama lengkap
- email: Email (harus unik)
```

#### 2. Ubah Password
```
POST /profile/change-password
- old_password: Password lama (untuk verifikasi)
- new_password: Password baru
- new_password_confirm: Konfirmasi password baru
```

## 📊 Database Schema

### Tabel Users
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🔑 Session Management

### Session Variables
```javascript
req.session.userId      // ID pengguna
req.session.userName    // Nama pengguna
req.session.userEmail   // Email pengguna
```

### Session Duration
- **Max Age**: 24 jam (86400000 ms)
- **Secure**: Cookie-based session

## 🛡️ Keamanan

### Password Hashing
- **Algorithm**: SHA256
- **Storage**: Hashed password di database
- **Verifikasi**: Compare hash saat login

### Middleware Autentikasi
```javascript
// Proteksi route yang memerlukan login
app.use((req, res, next) => {
  if (!req.session.userId && req.path !== '/login' && req.path !== '/register') {
    return res.redirect('/login');
  }
  next();
});
```

## 📁 File Structure

```
threadsbot/
├── middleware/
│   └── auth.js                 # Middleware autentikasi
├── routes/
│   └── auth.js                 # Routes login/register/profile
├── views/
│   ├── login.ejs              # Halaman login
│   ├── register.ejs           # Halaman register
│   ├── profile.ejs            # Halaman profil
│   └── layout.ejs             # Layout dengan menu profil
├── config/
│   └── database.js            # Database config (updated)
└── server.js                  # Main server (updated)
```

## 🚀 Cara Menggunakan

### 1. Registrasi Akun Baru
1. Buka `https://threadsbot.kelasmaster.id/register`
2. Isi form:
   - Nama Lengkap
   - Email
   - Password (min 6 karakter)
   - Konfirmasi Password
3. Klik "Daftar"
4. Redirect ke login

### 2. Login
1. Buka `https://threadsbot.kelasmaster.id/login`
2. Isi email dan password
3. Klik "Login"
4. Redirect ke dashboard

### 3. Akses Profil
1. Klik ikon 👤 di topbar kanan
2. Pilih "Profil"
3. Edit informasi atau ubah password

### 4. Logout
1. Klik ikon 👤 di topbar kanan
2. Pilih "Logout"
3. Session dihapus, redirect ke login

## 🔧 API Endpoints

### Authentication Routes
```
GET  /login                    # Halaman login
POST /login                    # Proses login
GET  /register                 # Halaman register
POST /register                 # Proses register
GET  /logout                   # Logout
GET  /profile                  # Halaman profil
POST /profile/update           # Update profil
POST /profile/change-password  # Ubah password
```

## 📝 Contoh Request

### Login
```bash
curl -X POST http://localhost:5008/login \
  -d "email=user@example.com&password=password123"
```

### Register
```bash
curl -X POST http://localhost:5008/register \
  -d "name=John Doe&email=john@example.com&password=password123&password_confirm=password123"
```

### Update Profil
```bash
curl -X POST http://localhost:5008/profile/update \
  -d "name=John Updated&email=john.new@example.com" \
  -b "connect.sid=<session_id>"
```

### Ubah Password
```bash
curl -X POST http://localhost:5008/profile/change-password \
  -d "old_password=password123&new_password=newpass123&new_password_confirm=newpass123" \
  -b "connect.sid=<session_id>"
```

## 🐛 Troubleshooting

### Login Gagal
- Pastikan email dan password benar
- Cek apakah akun sudah terdaftar
- Lihat logs: `tail -f /home/ubuntu/threadsbot/dashboard.log`

### Email Sudah Terdaftar
- Gunakan email yang berbeda saat register
- Atau gunakan fitur "Lupa Password" (jika ada)

### Session Expired
- Login kembali
- Session berlaku 24 jam

### Password Tidak Bisa Diubah
- Pastikan password lama benar
- Password baru minimal 6 karakter
- Konfirmasi password harus cocok

## 📊 Database Queries

### Lihat Semua User
```bash
sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db "SELECT id, name, email, created_at FROM users;"
```

### Cari User Berdasarkan Email
```bash
sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db "SELECT * FROM users WHERE email = 'user@example.com';"
```

### Update User
```bash
sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db "UPDATE users SET name = 'New Name' WHERE id = 1;"
```

### Hapus User
```bash
sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db "DELETE FROM users WHERE id = 1;"
```

## 🔄 Recent Changes

### 2026-03-12
1. ✅ Tambah tabel `users` di database
2. ✅ Buat middleware autentikasi (`auth.js`)
3. ✅ Buat routes autentikasi (`routes/auth.js`)
4. ✅ Buat views login, register, profile
5. ✅ Update layout dengan menu profil
6. ✅ Update server.js dengan auth middleware
7. ✅ Tambah CSS untuk dropdown menu

## 📋 Maintenance Checklist

### Daily
- [ ] Monitor login attempts
- [ ] Check for failed authentications

### Weekly
- [ ] Review user accounts
- [ ] Check password change logs

### Monthly
- [ ] Backup user database
- [ ] Review security settings

## 🎯 Future Improvements

1. **Forgot Password**: Email reset link
2. **Two-Factor Authentication**: SMS/Email OTP
3. **User Roles**: Admin, User, Moderator
4. **Activity Log**: Track user actions
5. **Email Verification**: Verify email saat register
6. **Social Login**: Google, GitHub OAuth

## 📞 Quick Reference

### Start Service
```bash
sudo supervisorctl start threadsbot
```

### Stop Service
```bash
sudo supervisorctl stop threadsbot
```

### Restart Service
```bash
sudo supervisorctl restart threadsbot
```

### View Logs
```bash
tail -f /home/ubuntu/threadsbot/dashboard.log
```

### Check Database
```bash
sqlite3 /home/ubuntu/threadsbot/data/threadsbot.db ".tables"
```

---

**Version**: 1.0
**Status**: ✅ Production Ready
**Last Verified**: 2026-03-12 06:17
