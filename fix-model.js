const db = require('./config/database');
try {
  db.prepare("UPDATE settings SET value = 'gemini-2.5-flash' WHERE key = 'gemini_model'").run();
  console.log('Model updated successfully to gemini-2.5-flash');
} catch (e) {
  console.error(e);
}
