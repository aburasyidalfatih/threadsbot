const fetch = require('node-fetch');
const db = require('./config/database');

async function getModels() {
  const apiKey = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get().value;
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(data.models.map(m => m.name).filter(n => n.includes('gemini')));
  } catch (e) {
    console.error(e);
  }
}

getModels();
