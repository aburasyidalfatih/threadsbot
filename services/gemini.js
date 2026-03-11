const fetch = require('node-fetch');
const db = require('../config/database');

class GeminiService {
  static getApiKey() {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'gemini_api_key'").get();
    return row?.value || process.env.GEMINI_API_KEY || '';
  }

  static getModel() {
    const row = db.prepare("SELECT value FROM settings WHERE key = 'gemini_model'").get();
    return row?.value || 'gemini-2.0-flash';
  }

  /**
   * Call Gemini API
   */
  static async callGemini(prompt) {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set it in Settings.');
    }

    const model = this.getModel();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          maxOutputTokens: 2048
        }
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(`Gemini API error: ${data.error.message}`);
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('Gemini returned empty response');
    }

    return text;
  }

  /**
   * Generate main post + follow-up comments for a topic
   */
  static async generatePostContent(topic, commentCount = 3) {
    const prompt = `Kamu adalah content creator Threads (sosial media dari Meta/Instagram) yang viral dan engaging.

Buatkan konten Threads tentang topik: "${topic}"

Aturan:
- Buat 1 POSTINGAN UTAMA yang menarik, provokatif, dan mengundang diskusi
- Buat ${commentCount} KOMENTAR LANJUTAN yang memperdalam topik (seolah-olah kamu reply sendiri ke postinganmu)
- Gunakan bahasa Indonesia yang casual dan relatable  
- Setiap komentar lanjutan harus menambah value/perspektif baru
- Gunakan emoji secukupnya, jangan berlebihan
- Maksimal 500 karakter per postingan/komentar
- Jangan gunakan hashtag

Format output HARUS seperti ini (JSON):
{
  "main_post": "isi postingan utama",
  "comments": [
    "komentar lanjutan 1",
    "komentar lanjutan 2",
    "komentar lanjutan 3"
  ]
}

PENTING: Hanya output JSON saja, tanpa markdown code block atau teks tambahan.`;

    const result = await this.callGemini(prompt);
    return this.parseJsonResponse(result);
  }

  /**
   * Generate affiliate promotion content
   */
  static async generateAffiliateContent(productName, description, affiliateLink, commentCount = 3) {
    const prompt = `Kamu adalah content creator Threads yang ahli dalam soft-selling produk.

Buatkan konten promosi Threads untuk produk affiliate berikut:
- Nama Produk: ${productName}
- Deskripsi: ${description}
- Link Affiliate: ${affiliateLink}

Aturan:
- Buat 1 POSTINGAN UTAMA yang soft-selling, storytelling, atau review personal
- Buat ${commentCount} KOMENTAR LANJUTAN yang memperdalam value produk
- JANGAN langsung jualan di postingan utama, buat penasaran dulu
- Masukkan link affiliate di komentar ke-2 atau ke-3 dengan cara natural
- Gunakan bahasa Indonesia yang casual dan engaging
- Gunakan emoji secukupnya
- Maksimal 500 karakter per postingan/komentar
- Jangan gunakan hashtag

Format output HARUS seperti ini (JSON):
{
  "main_post": "isi postingan utama (soft selling)",
  "comments": [
    "komentar lanjutan 1 (value/review)",
    "komentar lanjutan 2 (detail produk + link)",
    "komentar lanjutan 3 (CTA)"
  ]
}

PENTING: Hanya output JSON saja, tanpa markdown code block atau teks tambahan.`;

    const result = await this.callGemini(prompt);
    return this.parseJsonResponse(result);
  }

  /**
   * Generate auto-reply for incoming comment
   */
  static async generateReply(originalComment, postContext, style = 'friendly') {
    const styleGuide = {
      friendly: 'ramah, hangat, dan supportive',
      witty: 'cerdas, lucu, dan sedikit sarcastic',
      professional: 'sopan, informatif, dan profesional',
      casual: 'santai, gaul, dan relatable'
    };

    const prompt = `Kamu adalah pemilik akun Threads yang sedang membalas komentar.

Konteks postingan asli: "${postContext}"
Komentar yang perlu dibalas: "${originalComment}"

Aturan:
- Balas dengan gaya: ${styleGuide[style] || styleGuide.friendly}
- Maksimal 200 karakter
- Gunakan bahasa Indonesia
- Jangan terlalu formal
- Buat reply yang natural dan personal

Output HANYA teks reply saja, tanpa tanda kutip atau format tambahan.`;

    const result = await this.callGemini(prompt);
    return result.replace(/^["']|["']$/g, '').trim();
  }

  /**
   * Parse JSON from Gemini response, handling markdown code blocks
   */
  static parseJsonResponse(text) {
    // Remove markdown code blocks if present
    let cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    try {
      return JSON.parse(cleaned);
    } catch (e) {
      // Try to extract JSON from text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e2) {
          throw new Error(`Failed to parse Gemini response as JSON: ${text.substring(0, 200)}`);
        }
      }
      throw new Error(`No valid JSON found in Gemini response: ${text.substring(0, 200)}`);
    }
  }
}

module.exports = GeminiService;
