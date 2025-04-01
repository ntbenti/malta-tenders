import { BaseScraper } from './base-scraper';
import { ETendersScraper } from './etenders-scraper';
import { MITAScraper } from './mita-scraper';
import { ScrapedTender, Tender } from '@/lib/types/tender';
import { v4 as uuidv4 } from 'uuid';

export class ScraperManager {
  private scrapers: BaseScraper[];
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000;
  
  constructor() {
    this.scrapers = [
      new ETendersScraper(),
      new MITAScraper()
    ];
  }

  private async retryOperation<T>(
    operation: () => Promise<T>,
    retries = this.maxRetries
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.retryOperation(operation, retries - 1);
      }
      throw error;
    }
  }

  async scrapeAllSources(): Promise<{ tenders: ScrapedTender[], stats: any[] }> {
    const allTenders: ScrapedTender[] = [];
    const stats: any[] = [];
    
    for (const scraper of this.scrapers) {
      try {
        console.log(`Starting scrape for ${scraper.getName()}`);
        
        const startTime = new Date();
        const tenders = await this.retryOperation(() => scraper.fetchTenders());
        
        const processedTenders = tenders.map(tender => ({
          ...tender,
          id: uuidv4(),
          scrapedAt: new Date().toISOString(),
          sourceId: tender.sourceId || scraper.getId(),
          sourceName: tender.sourceName || scraper.getName(),
          sourceUrl: tender.sourceUrl,
          title: tender.title,
          description: tender.description,
          contractingAuthority: tender.contractingAuthority,
          procurementType: tender.procurementType,
          procedureType: tender.procedureType,
          cpvCodes: tender.cpvCodes || [],
          submissionDeadline: tender.submissionDeadline,
          publicationDate: tender.publicationDate,
          status: tender.status,
          documents: tender.documents || []
        } as ScrapedTender));
        
        allTenders.push(...processedTenders);
        
        stats.push({
          sourceId: scraper.getId(),
          sourceName: scraper.getName(),
          tendersCount: tenders.length,
          success: true
        });
        
        await this.logScrapingResult(scraper.getId(), {
          startTime,
          endTime: new Date(),
          status: 'success',
          tendersCount: tenders.length
        });
      } catch (error) {
        console.error(`Error scraping ${scraper.getName()}:`, error);
        stats.push({
          sourceId: scraper.getId(),
          sourceName: scraper.getName(),
          tendersCount: 0,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return { tenders: allTenders, stats };
  }
  
  async saveTendersToDatabase(tenders: Tender[]): Promise<void> {
    console.log(`Saving ${tenders.length} tenders to database`);
    
    for (const tender of tenders) {
      try {
        console.log(`Processing tender: ${tender.title}`);
        // Implementation for saving to database
      } catch (error) {
        console.error(`Error saving tender ${tender.id}:`, error);
        throw error;
      }
    }
  }

  private async logScrapingResult(scraperId: string, result: {
    startTime: Date;
    endTime: Date;
    status: string;
    tendersCount: number;
  }): Promise<void> {
    // Implementation for logging scraping results
  }
}
