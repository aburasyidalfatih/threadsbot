const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/database');
const { checkAuth, checkGuest } = require('../middleware/auth');

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password).digest('hex');
};

// Login page
router.get('/login', checkGuest, (req, res) => {
  res.render('login', { error: req.query.error });
});

// Register page
router.get('/register', checkGuest, (req, res) => {
  res.render('register', { error: req.query.error });
});

// Login process
router.post('/login', checkGuest, (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.redirect('/login?error=Email dan password harus diisi');
  }

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    
    if (!user || user.password !== hashPassword(password)) {
      return res.redirect('/login?error=Email atau password salah');
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;
    req.session.save((err) => {
      if (err) console.error(err);
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login?error=Terjadi kesalahan');
  }
});

// Register process
router.post('/register', checkGuest, (req, res) => {
  const { name, email, password, password_confirm } = req.body;
  
  if (!name || !email || !password || !password_confirm) {
    return res.redirect('/register?error=Semua field harus diisi');
  }

  if (password !== password_confirm) {
    return res.redirect('/register?error=Password tidak cocok');
  }

  if (password.length < 6) {
    return res.redirect('/register?error=Password minimal 6 karakter');
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.redirect('/register?error=Email sudah terdaftar');
    }

    db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
      .run(name, email, hashPassword(password));

    res.redirect('/login?success=Registrasi berhasil, silakan login');
  } catch (err) {
    console.error(err);
    res.redirect('/register?error=Terjadi kesalahan');
  }
});

// Profile page
router.get('/profile', checkAuth, (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email FROM users WHERE id = ?').get(req.session.userId);
    res.render('profile', { page: 'profile', user, error: req.query.error, success: req.query.success });
  } catch (err) {
    console.error(err);
    res.redirect('/?error=Terjadi kesalahan');
  }
});

// Update profile
router.post('/profile/update', checkAuth, (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.redirect('/profile?error=Nama dan email harus diisi');
  }

  try {
    const existing = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.session.userId);
    if (existing) {
      return res.redirect('/profile?error=Email sudah digunakan');
    }

    db.prepare('UPDATE users SET name = ?, email = ? WHERE id = ?')
      .run(name, email, req.session.userId);

    req.session.userName = name;
    req.session.userEmail = email;
    res.redirect('/profile?success=Profil berhasil diperbarui');
  } catch (err) {
    console.error(err);
    res.redirect('/profile?error=Terjadi kesalahan');
  }
});

// Change password
router.post('/profile/change-password', checkAuth, (req, res) => {
  const { old_password, new_password, new_password_confirm } = req.body;
  
  if (!old_password || !new_password || !new_password_confirm) {
    return res.redirect('/profile?error=Semua field harus diisi');
  }

  if (new_password !== new_password_confirm) {
    return res.redirect('/profile?error=Password baru tidak cocok');
  }

  if (new_password.length < 6) {
    return res.redirect('/profile?error=Password minimal 6 karakter');
  }

  try {
    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.session.userId);
    
    if (user.password !== hashPassword(old_password)) {
      return res.redirect('/profile?error=Password lama salah');
    }

    db.prepare('UPDATE users SET password = ? WHERE id = ?')
      .run(hashPassword(new_password), req.session.userId);

    res.redirect('/profile?success=Password berhasil diubah');
  } catch (err) {
    console.error(err);
    res.redirect('/profile?error=Terjadi kesalahan');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

module.exports = router;
