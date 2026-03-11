const db = require('./config/database');

try {
  const totalAccounts = db.prepare('SELECT COUNT(*) as count FROM accounts').get().count;
  console.log('totalAccounts:', totalAccounts);

  const activeAccounts = db.prepare("SELECT COUNT(*) as count FROM accounts WHERE is_active = 1 AND access_token IS NOT NULL").get().count;
  console.log('activeAccounts:', activeAccounts);

  const totalPosts = db.prepare('SELECT COUNT(*) as count FROM posts').get().count;
  console.log('totalPosts:', totalPosts);

  const totalReplies = db.prepare('SELECT COUNT(*) as count FROM reply_logs').get().count;
  console.log('totalReplies:', totalReplies);

  const recentPosts = db.prepare(`
    SELECT p.*, a.username as account_username
    FROM posts p
    LEFT JOIN accounts a ON a.id = p.account_id
    ORDER BY p.created_at DESC LIMIT 10
  `).all();
  console.log('recentPosts count:', recentPosts.length);

  const recentReplies = db.prepare(`
    SELECT rl.*, a.username as account_username
    FROM reply_logs rl
    LEFT JOIN accounts a ON a.id = rl.account_id
    ORDER BY rl.replied_at DESC LIMIT 5
  `).all();
  console.log('recentReplies count:', recentReplies.length);

  console.log('All queries passed!');
} catch (err) {
  console.error('Query failed:', err.message);
}
