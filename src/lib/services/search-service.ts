import { D1Database } from '@cloudflare/workers-types';

interface SearchFilters {
  categories?: string[];
  procurementType?: string;
  procedureType?: string;
  status?: string;
  minValue?: number;
  maxValue?: number;
  fromDate?: Date;
  toDate?: Date;
  contractingAuthority?: string;
}

interface SearchResult {
  id: string;
  title: string;
  description: string;
  contractingAuthority: string;
  submissionDeadline: Date;
  status: string;
  categories: string[];
  relevance: number;
}

interface SavedSearch {
  id: string;
  userId: string;
  keywords: string[];
  categories: string[];
}

interface DbSavedSearch {
  id: string;
  user_id: string;
  keywords: string;
  categories: string;
  is_active: boolean;
}

interface DbSearchResult {
  id: string;
  title: string;
  description: string;
  contracting_authority: string;
  submission_deadline: string;
  status: string;
  relevance: number;
}

export class SearchService {
  constructor(private readonly db: D1Database) {}

  async search(
    query: string,
    filters: SearchFilters,
    page = 1,
    pageSize = 20
  ): Promise<{ results: SearchResult[]; total: number }> {
    const offset = (page - 1) * pageSize;
    const params: any[] = [];
    
    let sql = `
      WITH matched_tenders AS (
        SELECT 
          t.*,
          ts_rank_cd(to_tsvector('english', t.title || ' ' || COALESCE(t.description, '')), 
                     plainto_tsquery('english', ?)) as relevance
        FROM tenders t
        WHERE 1=1
    `;
    params.push(query);

    if (filters.categories?.length) {
      sql += ` AND EXISTS (
        SELECT 1 FROM tender_categories tc 
        WHERE tc.tender_id = t.id 
        AND tc.category_id = ANY(?)
      )`;
      params.push(filters.categories);
    }

    if (filters.status) {
      sql += ` AND t.status = ?`;
      params.push(filters.status);
    }

    if (filters.fromDate) {
      sql += ` AND t.submission_deadline >= ?`;
      params.push(filters.fromDate.toISOString());
    }

    if (filters.toDate) {
      sql += ` AND t.submission_deadline <= ?`;
      params.push(filters.toDate.toISOString());
    }

    sql += `
      ORDER BY relevance DESC, submission_deadline ASC
      LIMIT ? OFFSET ?
    )`;
    params.push(pageSize, offset);

    const results = await this.db.prepare(sql)
      .bind(...params)
      .all<DbSearchResult>();
      
    const total = await this.getSearchResultsCount(query, filters);

    return {
      results: results.results.map(this.mapSearchResult),
      total
    };
  }

  private async getSearchResultsCount(
    query: string,
    filters: SearchFilters
  ): Promise<number> {
    // Similar query as above but just COUNT(*)
    // Implementation details...
    return 0;
  }

  private mapSearchResult(row: DbSearchResult): SearchResult {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      contractingAuthority: row.contracting_authority,
      submissionDeadline: new Date(row.submission_deadline),
      status: row.status,
      categories: [], // Fetch categories in a separate query
      relevance: row.relevance
    };
  }

  async findMatchingSearches(tender: { title: string; description: string; category?: string }): Promise<SavedSearch[]> {
    const searches = await this.db.prepare(`
      SELECT s.*, u.id as user_id 
      FROM saved_searches s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
    `).all<DbSavedSearch>();

    const matchingSearches: SavedSearch[] = [];

    for (const search of searches.results) {
      const keywords = JSON.parse(search.keywords) as string[];
      const categories = JSON.parse(search.categories) as string[];
      
      // Check if tender matches any keywords
      const tenderText = `${tender.title} ${tender.description}`.toLowerCase();
      const keywordMatch = keywords.some((keyword: string) => 
        tenderText.includes(keyword.toLowerCase())
      );

      // Check if tender matches any categories
      const categoryMatch = categories.length === 0 || 
        (tender.category && categories.includes(tender.category));

      if (keywordMatch && categoryMatch) {
        matchingSearches.push({
          id: search.id,
          userId: search.user_id,
          keywords,
          categories
        });
      }
    }

    return matchingSearches;
  }

  async reindexTenders(): Promise<void> {
    // Implement reindexing logic here if needed
    console.log('Reindexing tenders...');
  }

  async index(data: any): Promise<void> {
    // Implement search indexing logic
  }
}

export default new SearchService();
