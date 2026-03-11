const express = require('express');
const router = express.Router();
const db = require('../config/database');
const AutoPilotService = require('../services/autopilot');

// Autopilot page
router.get('/', (req, res) => {
  const configs = AutoPilotService.getConfigs();
  const accounts = db.prepare('SELECT * FROM accounts WHERE is_active = 1').all();
  const defaultCommentCount = db.prepare("SELECT value FROM settings WHERE key = 'default_comment_count'").get();

  res.render('autopilot', {
    page: 'autopilot',
    configs,
    accounts,
    defaultCommentCount: parseInt(defaultCommentCount?.value || '3', 10)
  });
});

// Save/Update autopilot config
router.post('/save', (req, res) => {
  const { account_id, is_enabled, theme, theme_description, posting_hours, comment_count } = req.body;

  try {
    AutoPilotService.saveConfig(account_id, {
      is_enabled,
      theme,
      theme_description,
      posting_hours,
      comment_count
    });
    res.redirect('/autopilot?success=Konfigurasi+autopilot+tersimpan');
  } catch (error) {
    res.redirect('/autopilot?error=' + encodeURIComponent(error.message));
  }
});

// Delete config
router.post('/delete/:accountId', (req, res) => {
  AutoPilotService.deleteConfig(req.params.accountId);
  res.redirect('/autopilot');
});

// Reset topic history
router.post('/reset-history/:accountId', (req, res) => {
  AutoPilotService.resetHistory(req.params.accountId);
  res.redirect('/autopilot?success=Riwayat+topik+direset');
});

// Trigger manual run for specific account
router.post('/trigger/:accountId', async (req, res) => {
  try {
    const config = db.prepare(`
      SELECT ap.*, a.username, a.threads_user_id, a.access_token
      FROM autopilot_configs ap
      JOIN accounts a ON a.id = ap.account_id
      WHERE ap.account_id = ?
    `).get(req.params.accountId);

    if (!config) {
      return res.redirect('/autopilot?error=Config+not+found');
    }
    if (!config.access_token) {
      return res.redirect('/autopilot?error=Akun+belum+terkoneksi');
    }

    // Force run: set posting_hours to current hour so it always matches
    const currentHour = String(new Date().getHours()).padStart(2, '0');
    await AutoPilotService.processAccount({ ...config, posting_hours: currentHour });
    res.redirect('/autopilot?success=Post+berhasil+di-trigger+untuk+@' + config.username);
  } catch (error) {
    res.redirect('/autopilot?error=' + encodeURIComponent(error.message));
  }
});

module.exports = router;
