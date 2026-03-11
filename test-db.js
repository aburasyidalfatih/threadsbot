const db = require('./config/database');

try {
  console.log('Testing Dashboard Queries...');
  
  console.log('1. totalAccounts');
  const totalAccounts = db.prepare('SELECT COUNT(*) as count FROM accounts').get()?.count || 0;
  console.log('   Value:', totalAccounts);

  console.log('2. activeAccounts');
  const activeAccounts = db.prepare("SELECT COUNT(*) as count FROM accounts WHERE is_active = 1 AND access_token IS NOT NULL").get()?.count || 0;
  console.log('   Value:', activeAccounts);

  console.log('3. totalPosts');
  const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get()?.count || 0;
  console.log('   Value:', totalPosts);

  console.log('4. donePosts');
  const donePosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'done'").get()?.count || 0;
  console.log('   Value:', donePosts);

  console.log('5. pendingPosts');
  const pendingPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status IN ('draft', 'scheduled')").get()?.count || 0;
  console.log('   Value:', pendingPosts);

  console.log('6. failedPosts');
  const failedPosts = db.prepare("SELECT COUNT(*) as count FROM posts WHERE status = 'failed'").get()?.count || 0;
  console.log('   Value:', failedPosts);

  console.log('7. totalReplies');
  const totalReplies = db.prepare('SELECT COUNT(*) as count FROM reply_logs').get()?.count || 0;
  console.log('   Value:', totalReplies);

  console.log('8. totalProducts');
  const totalProducts = db.prepare('SELECT COUNT(*) as count FROM affiliate_products').get()?.count || 0;
  console.log('   Value:', totalProducts);

  console.log('9. activeAutopilot');
  const activeAutopilot = db.prepare("SELECT COUNT(*) as count FROM autopilot_configs WHERE is_enabled = 1").get()?.count || 0;
  console.log('   Value:', activeAutopilot);

  console.log('10. autopilotPostsToday');
  const autopilotPostsToday = db.prepare("SELECT COUNT(*) as count FROM posts WHERE type = 'autopilot' AND created_at >= date('now')").get()?.count || 0;
  console.log('   Value:', autopilotPostsToday);

  console.log('11. expiringTokens');
  const expiringTokens = db.prepare(
    "SELECT username, token_expires_at FROM accounts WHERE is_active = 1 AND token_expires_at IS NOT NULL AND token_expires_at < datetime('now', '+7 days')"
  ).all();
  console.log('   Value count:', expiringTokens.length);

  console.log('12. recentPosts');
  const recentPosts = db.prepare(`
    SELECT p.*, a.username as account_username
    FROM posts p
    LEFT JOIN accounts a ON a.id = p.account_id
    ORDER BY p.created_at DESC LIMIT 10
  `).all();
  console.log('   Value count:', recentPosts.length);

  console.log('13. recentReplies');
  const recentReplies = db.prepare(`
    SELECT rl.*, a.username as account_username
    FROM reply_logs rl
    LEFT JOIN accounts a ON a.id = rl.account_id
    ORDER BY rl.replied_at DESC LIMIT 5
  `).all();
  console.log('   Value count:', recentReplies.length);

  console.log('SUCCESS: All queries executed fine.');
} catch (error) {
  console.error('FAILURE:', error.message);
  console.error(error.stack);
} finally {
  db.close();
}
