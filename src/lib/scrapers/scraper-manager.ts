import { BaseScraper, ScrapedTender } from './base-scraper';
import { ETendersScraper } from './etenders-scraper';
import { MITAScraper } from './mita-scraper';
import { v4 as uuidv4 } from 'uuid';

export class ScraperManager {
  private scrapers: BaseScraper[];
  
  constructor() {
    this.scrapers = [
      new ETendersScraper(),
      new MITAScraper()
    ];
  }
  
  async scrapeAllSources(): Promise<{
    tenders: ScrapedTender[],
    stats: {
      sourceId: string,
      sourceName: string,
      tendersCount: number,
      success: boolean,
      error?: string
    }[]
  }> {
    const allTenders: ScrapedTender[] = [];
    const stats: {
      sourceId: string,
      sourceName: string,
      tendersCount: number,
      success: boolean,
      error?: string
    }[] = [];
    
    for (const scraper of this.scrapers) {
      try {
        console.log(`Starting scrape for ${scraper.getName()}`);
        
        const startTime = new Date();
        const tenders = await scraper.fetchTenders();
        
        // Add unique IDs to tenders if they don't have one
        const processedTenders = tenders.map(tender => ({
          ...tender,
          id: uuidv4()
        }));
        
        allTenders.push(...processedTenders);
        
        stats.push({
          sourceId: scraper.getId(),
          sourceName: scraper.getName(),
          tendersCount: tenders.length,
          success: true
        });
        
        console.log(`Completed scrape for ${scraper.getName()}: ${tenders.length} tenders found`);
        
        // In a real implementation, this would log to the database
        await this.logScrapingResult(scraper.getId(), {
          startTime,
          endTime: new Date(),
          status: 'success',
          tendersAdded: tenders.length,
          tendersUpdated: 0
        });
      } catch (error) {
        console.error(`Error scraping ${scraper.getName()}: ${error}`);
        
        stats.push({
          sourceId: scraper.getId(),
          sourceName: scraper.getName(),
          tendersCount: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
        
        // In a real implementation, this would log to the database
        await this.logScrapingResult(scraper.getId(), {
          startTime: new Date(),
          endTime: new Date(),
          status: 'error',
          tendersAdded: 0,
          tendersUpdated: 0,
          errorMessage: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return { tenders: allTenders, stats };
  }
  
  private async logScrapingResult(sourceId: string, result: {
    startTime: Date,
    endTime: Date,
    status: string,
    tendersAdded: number,
    tendersUpdated: number,
    errorMessage?: string
  }): Promise<void> {
    // In a real implementation, this would save to the database
    console.log(`Logging scraping result for ${sourceId}:`, result);
  }
  
  async saveTendersToDatabase(tenders: ScrapedTender[]): Promise<void> {
    // In a real implementation, this would save to the database
    console.log(`Saving ${tenders.length} tenders to database`);
    
    // Process each tender
    for (const tender of tenders) {
      // Check if tender already exists
      // If exists, update it
      // If not, insert it
      // Also handle documents and category mappings
      console.log(`Processing tender: ${tender.title}`);
    }
  }
}
