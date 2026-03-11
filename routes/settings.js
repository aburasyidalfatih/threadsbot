const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Settings page
router.get('/', (req, res) => {
  const settings = {};
  const rows = db.prepare('SELECT key, value FROM settings').all();
  rows.forEach(row => { settings[row.key] = row.value; });

  const accounts = db.prepare('SELECT * FROM accounts').all();
  const autoReplyConfigs = db.prepare(`
    SELECT arc.*, a.username
    FROM auto_reply_config arc
    JOIN accounts a ON a.id = arc.account_id
  `).all();

  res.render('settings', {
    page: 'settings',
    settings,
    accounts,
    autoReplyConfigs
  });
});

// Save settings
router.post('/save', (req, res) => {
  const { gemini_api_key, default_comment_count, post_delay_seconds, auto_reply_style, gemini_model } = req.body;

  const updateSetting = db.prepare("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?");

  if (gemini_api_key !== undefined) updateSetting.run(gemini_api_key, 'gemini_api_key');
  if (default_comment_count) updateSetting.run(default_comment_count, 'default_comment_count');
  if (post_delay_seconds) updateSetting.run(post_delay_seconds, 'post_delay_seconds');
  if (auto_reply_style) updateSetting.run(auto_reply_style, 'auto_reply_style');
  if (gemini_model) updateSetting.run(gemini_model, 'gemini_model');

  res.redirect('/settings?success=Pengaturan+berhasil+disimpan');
});

// Update auto-reply config
router.post('/auto-reply/:accountId', (req, res) => {
  const { is_enabled, check_interval_minutes, reply_style, max_replies_per_check } = req.body;
  const accountId = req.params.accountId;

  db.prepare(`
    INSERT INTO auto_reply_config (account_id, is_enabled, check_interval_minutes, reply_style, max_replies_per_check)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(account_id) DO UPDATE SET
      is_enabled = ?,
      check_interval_minutes = ?,
      reply_style = ?,
      max_replies_per_check = ?
  `).run(
    accountId,
    is_enabled ? 1 : 0,
    parseInt(check_interval_minutes || '5', 10),
    reply_style || 'friendly',
    parseInt(max_replies_per_check || '5', 10),
    is_enabled ? 1 : 0,
    parseInt(check_interval_minutes || '5', 10),
    reply_style || 'friendly',
    parseInt(max_replies_per_check || '5', 10)
  );

  res.redirect('/settings');
});

module.exports = router;
