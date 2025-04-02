// Basic scraper interface
export interface Scraper {
  scrape(): Promise<any>;
}

// Export your scraper implementations
export const scrapers = [];
