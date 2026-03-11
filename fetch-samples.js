const db = require('./config/database');
const fs = require('fs');

try {
  const data = {};
  data.posts = db.prepare('SELECT type, topic, content_main, content_comments FROM posts ORDER BY created_at DESC LIMIT 3').all();
  data.queue = db.prepare('SELECT topic, content_main, content_comments FROM content_queue ORDER BY created_at DESC LIMIT 3').all();
  
  // Also get the prompt from gemini.js conceptually (we know what it says)
  
  fs.writeFileSync('audit-content.json', JSON.stringify(data, null, 2));
  console.log('Saved to audit-content.json');
} catch (error) {
  console.error('Error fetching samples:', error.message);
} finally {
  db.close();
}
