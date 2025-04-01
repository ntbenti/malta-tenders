import { BaseScraper, ScrapedTender } from './base-scraper';
import { JSDOM } from 'jsdom';

export class ETendersScraper extends BaseScraper {
  constructor() {
    super('src_etenders', 'eTenders Malta', 'https://www.etenders.gov.mt');
  }
  
  async fetchTenders(): Promise<ScrapedTender[]> {
    try {
      const response = await fetch(`${this.baseUrl}/epps/cft/listContractNotices.do`);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const tenderRows = Array.from(document.querySelectorAll('.resultRow'));
      const tenders: ScrapedTender[] = [];
      const now = new Date();
      
      for (const row of tenderRows) {
        try {
          const titleElement = row.querySelector('.resultTitle a');
          const authorityElement = row.querySelector('.resultCA');
          
          if (titleElement && authorityElement) {
            tenders.push({
              sourceId: this.getId(),
              sourceName: this.getName(),
              sourceUrl: `${this.baseUrl}${titleElement.getAttribute('href') || ''}`,
              title: titleElement.textContent?.trim() || 'Untitled Tender',
              description: 'No description available',
              contractingAuthority: authorityElement.textContent?.trim() || 'Unknown Authority',
              procurementType: 'Not specified',
              procedureType: 'Not specified',
              status: 'Open',
              submissionDeadline: new Date(now.setDate(now.getDate() + 30)), // Default to 30 days
              publicationDate: new Date(),
              cpvCodes: [],
              documents: []
            });
          }
        } catch (error) {
          console.error('Error processing tender row:', error);
        }
      }
      
      return tenders;
    } catch (error) {
      console.error('Error fetching tenders:', error);
      throw error;
    }
  }
}
