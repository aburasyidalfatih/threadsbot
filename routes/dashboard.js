const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/', (req, res) => {
  try {
    // Stats
    const totalAccounts = db.prepare('SELECT COUNT(*) as count FROM accounts').get()?.count || 0;
    const activeAccounts = db.prepare("SELECT COUNT(*) as count FROM accounts WHERE is_active = 1 AND access_token IS NOT NULL").get()?.count || 0;
    const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get()?.count || 0;
    const donePosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'done'").get()?.count || 0;
    const pendingPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status IN ('draft', 'scheduled')").get()?.count || 0;
    const failedPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'failed'").get()?.count || 0;
    const totalReplies = db.prepare('SELECT COUNT(*) as count FROM reply_logs').get()?.count || 0;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM affiliate_products').get()?.count || 0;

    // Autopilot stats
    const activeAutopilot = db.prepare("SELECT COUNT(*) as count FROM autopilot_configs WHERE is_enabled = 1").get()?.count || 0;
    const autopilotPostsToday = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'autopilot' AND created_at >= date('now')").get()?.count || 0;

    // Token expiry warnings
    const expiringTokens = db.prepare(
      "SELECT username, token_expires_at FROM accounts WHERE is_active = 1 AND token_expires_at IS NOT NULL AND token_expires_at < datetime('now', '+7 days')"
    ).all();

    // Recent activity
    const recentPosts = db.prepare(`
      SELECT p.*, a.username as account_username
      FROM posts p
      LEFT JOIN accounts a ON a.id = p.account_id
      ORDER BY p.created_at DESC LIMIT 10
    `).all();

    const recentReplies = db.prepare(`
      SELECT rl.*, a.username as account_username
      FROM reply_logs rl
      LEFT JOIN accounts a ON a.id = rl.account_id
      ORDER BY rl.replied_at DESC LIMIT 5
    `).all();

    res.render('dashboard', {
      page: 'dashboard',
      stats: { totalAccounts, activeAccounts, totalPosts, donePosts, pendingPosts, failedPosts, totalReplies, totalProducts, activeAutopilot, autopilotPostsToday },
      recentPosts,
      recentReplies,
      expiringTokens
    });
  } catch (error) {
    console.error('[Dashboard Route Error]', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
});

module.exports = router;
