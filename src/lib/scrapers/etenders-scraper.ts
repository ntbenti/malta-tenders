import { BaseScraper, ScrapedTender } from './base-scraper';
import { JSDOM } from 'jsdom';

export class ETendersScraper extends BaseScraper {
  constructor() {
    super('src_etenders', 'eTenders Malta', 'https://www.etenders.gov.mt');
  }

  async fetchTenders(): Promise<ScrapedTender[]> {
    try {
      // In a real implementation, this would use fetch or axios to get the actual page
      const response = await fetch(`${this.baseUrl}/epps/quickSearchAction.do?searchSelect=1`);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const tenders: ScrapedTender[] = [];
      
      // Find all tender rows in the search results
      const tenderRows = document.querySelectorAll('.resultRow');
      
      for (const row of tenderRows) {
        try {
          const titleElement = row.querySelector('.resultTitle a');
          const authorityElement = row.querySelector('.resultCA');
          const deadlineElement = row.querySelector('.resultDeadline');
          
          if (!titleElement || !authorityElement) continue;
          
          const title = titleElement.textContent?.trim() || '';
          const authority = authorityElement.textContent?.trim().replace('CA: ', '') || '';
          const detailUrl = titleElement.getAttribute('href') || '';
          const fullDetailUrl = detailUrl.startsWith('http') ? detailUrl : `${this.baseUrl}${detailUrl}`;
          
          // Extract deadline if available
          let deadline = null;
          if (deadlineElement) {
            const deadlineText = deadlineElement.textContent?.trim() || '';
            const deadlineMatch = deadlineText.match(/(\d{2}-\d{2}-\d{4})/);
            if (deadlineMatch) {
              const [day, month, year] = deadlineMatch[1].split('-').map(Number);
              deadline = new Date(year, month - 1, day);
            }
          }
          
          // Get tender details by visiting the detail page
          const tenderDetails = await this.fetchTenderDetails(fullDetailUrl);
          
          tenders.push({
            sourceId: this.id,
            sourceName: this.name,
            sourceUrl: fullDetailUrl,
            title,
            contractingAuthority: authority,
            submissionDeadline: deadline,
            ...tenderDetails
          });
        } catch (error) {
          console.error(`Error processing tender row: ${error}`);
        }
      }
      
      return tenders;
    } catch (error) {
      console.error(`Error fetching tenders from ${this.name}: ${error}`);
      throw error;
    }
  }
  
  private async fetchTenderDetails(url: string): Promise<Partial<ScrapedTender>> {
    try {
      // In a real implementation, this would fetch the actual detail page
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      // Extract tender details
      const description = document.querySelector('.tenderDescription')?.textContent?.trim() || '';
      const procurementType = document.querySelector('.procurementType')?.textContent?.trim() || '';
      const procedureType = document.querySelector('.procedureType')?.textContent?.trim() || '';
      const status = document.querySelector('.tenderStatus')?.textContent?.trim() || 'Unknown';
      
      // Extract documents
      const documents = Array.from(document.querySelectorAll('.documentRow')).map(row => {
        const title = row.querySelector('.documentTitle')?.textContent?.trim() || '';
        const url = row.querySelector('a')?.getAttribute('href') || '';
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url}`;
        
        return {
          title,
          url: fullUrl
        };
      });
      
      return {
        description,
        procurementType,
        procedureType,
        status,
        documents
      };
    } catch (error) {
      console.error(`Error fetching tender details: ${error}`);
      return {};
    }
  }
}
