import { D1Database } from '@cloudflare/workers-types';

interface CategoryMatch {
  categoryId: string;
  confidence: number;
}

interface Category {
  id: string;
  keywords: string;
}

interface DbTender {
  title: string;
  description: string;
}

export class CategorizationService {
  constructor(private readonly db: D1Database) {}

  async categorizeTender(tender: {
    title: string;
    description: string;
    cpvCodes?: string[];
  }): Promise<CategoryMatch[]> {
    const categories = await this.db.prepare(
      `SELECT id, keywords FROM categories`
    ).all<Category>();

    const matches: CategoryMatch[] = [];
    const text = `${tender.title} ${tender.description}`.toLowerCase();

    for (const category of categories.results) {
      const keywords: string[] = JSON.parse(category.keywords);
      let confidence = 0;

      for (const keyword of keywords) {
        if (text.includes(keyword.toLowerCase())) {
          confidence += keyword.length / text.length;
        }
      }

      if (confidence > 0.1) { // Minimum confidence threshold
        matches.push({
          categoryId: category.id,
          confidence
        });
      }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
  }

  async assignCategories(tenderId: string): Promise<void> {
    const tender = await this.db.prepare(
      `SELECT title, description FROM tenders WHERE id = ?`
    )
    .bind(tenderId)
    .first<DbTender>();

    if (!tender) throw new Error('Tender not found');

    const matches = await this.categorizeTender(tender);

    // Assign top 3 categories
    const topMatches = matches.slice(0, 3);
    
    for (const match of topMatches) {
      await this.db.prepare(
        `INSERT INTO tender_categories (tender_id, category_id, confidence)
         VALUES (?, ?, ?)`
      )
      .bind(tenderId, match.categoryId, match.confidence)
      .run();
    }
  }
}
