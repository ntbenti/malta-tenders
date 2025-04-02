// Basic scraper interface
export interface Scraper {
  scrape(): Promise<any>;
}

// Export your scrapers here
export const scrapers: Scraper[] = [];
