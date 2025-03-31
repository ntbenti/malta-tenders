import { BaseScraper, ScrapedTender } from './base-scraper';
import { JSDOM } from 'jsdom';

export class MITAScraper extends BaseScraper {
  constructor() {
    super('src_mita', 'MITA Procurement', 'https://procurement.mita.gov.mt');
  }

  async fetchTenders(): Promise<ScrapedTender[]> {
    try {
      // In a real implementation, this would use fetch or axios to get the actual page
      const response = await fetch(`${this.baseUrl}/tenders`);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const tenders: ScrapedTender[] = [];
      
      // Find all tender items in the list
      const tenderItems = document.querySelectorAll('.tender-item');
      
      for (const item of tenderItems) {
        try {
          const titleElement = item.querySelector('.tender-title a');
          const authorityElement = item.querySelector('.tender-authority');
          const deadlineElement = item.querySelector('.tender-deadline');
          const statusElement = item.querySelector('.tender-status');
          
          if (!titleElement) continue;
          
          const title = titleElement.textContent?.trim() || '';
          const authority = authorityElement?.textContent?.trim() || 'MITA';
          const detailUrl = titleElement.getAttribute('href') || '';
          const fullDetailUrl = detailUrl.startsWith('http') ? detailUrl : `${this.baseUrl}${detailUrl}`;
          const status = statusElement?.textContent?.trim() || 'Unknown';
          
          // Extract deadline if available
          let deadline = null;
          if (deadlineElement) {
            const deadlineText = deadlineElement.textContent?.trim() || '';
            const deadlineMatch = deadlineText.match(/(\d{2}\/\d{2}\/\d{4})/);
            if (deadlineMatch) {
              const [day, month, year] = deadlineMatch[1].split('/').map(Number);
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
            status,
            ...tenderDetails
          });
        } catch (error) {
          console.error(`Error processing tender item: ${error}`);
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
      const description = document.querySelector('.tender-description')?.textContent?.trim() || '';
      const procurementType = document.querySelector('.procurement-type')?.textContent?.trim() || '';
      const procedureType = document.querySelector('.procedure-type')?.textContent?.trim() || '';
      
      // Extract documents
      const documents = Array.from(document.querySelectorAll('.document-item')).map(item => {
        const title = item.querySelector('.document-title')?.textContent?.trim() || '';
        const url = item.querySelector('a')?.getAttribute('href') || '';
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
        documents
      };
    } catch (error) {
      console.error(`Error fetching tender details: ${error}`);
      return {};
    }
  }
}
