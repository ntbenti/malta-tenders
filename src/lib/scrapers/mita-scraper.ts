import { BaseScraper, ScrapedTender, TenderDetails } from './base-scraper';
import { JSDOM } from 'jsdom';

export class MITAScraper extends BaseScraper {
  constructor() {
    super('src_mita', 'MITA Procurement', 'https://procurement.mita.gov.mt');
  }

  protected async fetchTenderDetails(url: string): Promise<TenderDetails> {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;

      return {
        description: document.querySelector('.tender-description')?.textContent?.trim() || 'No description available',
        procurementType: document.querySelector('.procurement-type')?.textContent?.trim() || 'Not specified',
        procedureType: document.querySelector('.procedure-type')?.textContent?.trim() || 'Not specified',
        documents: Array.from(document.querySelectorAll('.tender-document')).map(doc => ({
          title: doc.querySelector('.doc-title')?.textContent?.trim() || 'Untitled Document',
          url: doc.querySelector('a')?.href || '',
          fileType: doc.querySelector('.doc-type')?.textContent?.trim(),
          fileSize: parseInt(doc.querySelector('.doc-size')?.textContent?.trim() || '0', 10)
        }))
      };
    } catch (error) {
      console.error(`Error fetching tender details from ${url}:`, error);
      return {
        description: 'No description available',
        procurementType: 'Not specified',
        procedureType: 'Not specified',
        documents: []
      };
    }
  }

  async fetchTenders(): Promise<ScrapedTender[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tenders`);
      const html = await response.text();
      const dom = new JSDOM(html);
      const document = dom.window.document;
      
      const tenders: ScrapedTender[] = [];
      const tenderItems = Array.from(document.querySelectorAll('.tender-item'));
      
      for (const item of tenderItems) {
        try {
          const title = item.querySelector('.title')?.textContent?.trim() || 'Untitled Tender';
          const authority = item.querySelector('.authority')?.textContent?.trim() || 'MITA';
          const status = item.querySelector('.status')?.textContent?.trim() || 'Open';
          const detailUrl = item.querySelector('a')?.getAttribute('href') || '';
          const fullDetailUrl = detailUrl.startsWith('http') ? detailUrl : `${this.baseUrl}${detailUrl}`;
          
          const tenderDetails = await this.fetchTenderDetails(fullDetailUrl);
          const now = new Date();
          
          tenders.push({
            sourceId: this.getId(),
            sourceName: this.getName(),
            sourceUrl: fullDetailUrl,
            title,
            description: tenderDetails.description || 'No description available',
            contractingAuthority: authority,
            procurementType: tenderDetails.procurementType || 'Not specified',
            procedureType: tenderDetails.procedureType || 'Not specified',
            status,
            submissionDeadline: new Date(now.setDate(now.getDate() + 30)), // Default to 30 days
            publicationDate: new Date(),
            cpvCodes: [],
            documents: tenderDetails.documents || []
          });
        } catch (error) {
          console.error(`Error processing tender item: ${error}`);
        }
      }
      
      return tenders;
    } catch (error) {
      console.error(`Error fetching tenders from ${this.getName()}: ${error}`);
      throw error;
    }
  }
}
