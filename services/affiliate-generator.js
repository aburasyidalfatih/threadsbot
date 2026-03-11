const db = require('../config/database');
const GeminiService = require('./gemini');

class AffiliateGenerator {
  /**
   * Generate and save affiliate promotion content
   */
  static async generatePromoPost(productId, accountId, commentCount = 3) {
    const product = db.prepare('SELECT * FROM affiliate_products WHERE id = ?').get(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Generate content using Gemini
    const content = await GeminiService.generateAffiliateContent(
      product.product_name,
      product.description,
      product.affiliate_link,
      commentCount
    );

    // Save as a post
    const result = db.prepare(`
      INSERT INTO posts (account_id, type, topic, content_main, content_comments, comment_count, status)
      VALUES (?, 'affiliate', ?, ?, ?, ?, 'draft')
    `).run(
      accountId,
      `Promo: ${product.product_name}`,
      content.main_post,
      JSON.stringify(content.comments),
      content.comments.length
    );

    return {
      postId: result.lastInsertRowid,
      content
    };
  }

  /**
   * Save a new affiliate product
   */
  static saveProduct(productName, description, affiliateLink, category = '') {
    const result = db.prepare(`
      INSERT INTO affiliate_products (product_name, description, affiliate_link, category)
      VALUES (?, ?, ?, ?)
    `).run(productName, description, affiliateLink, category);

    return result.lastInsertRowid;
  }

  /**
   * Get all affiliate products
   */
  static getProducts() {
    return db.prepare('SELECT * FROM affiliate_products ORDER BY created_at DESC').all();
  }

  /**
   * Delete a product
   */
  static deleteProduct(productId) {
    db.prepare('DELETE FROM affiliate_products WHERE id = ?').run(productId);
  }
}

module.exports = AffiliateGenerator;
