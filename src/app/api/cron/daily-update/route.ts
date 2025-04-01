import { ScraperManager } from '@/lib/scrapers';
import { NotificationService, NotificationType } from '@/lib/services/notification-service';
import { CategorizationService } from '@/lib/services/categorization-service';
import { SearchService } from '@/lib/services/search-service';
import { NextRequest, NextResponse } from 'next/server';
import { rateLimiter } from '@/lib/middleware/rate-limiter';
import { D1Database, KVNamespace } from '@cloudflare/workers-types';
import { Tender } from '@/lib/types/tender';

export const dynamic = 'force-dynamic';

interface CloudflareRequest extends NextRequest {
  cf: {
    d1: D1Database;
    kvStore: KVNamespace;
  };
}

async function notifyMatchingUsers(
  notificationService: NotificationService,
  searchService: SearchService,
  tender: Tender
) {
  const matchingSearches = await searchService.findMatchingSearches(tender);
  
  for (const search of matchingSearches) {
    await notificationService.createNotification(
      search.userId,
      NotificationType.SAVED_SEARCH_MATCH,
      {
        title: 'New matching tender found',
        message: `A new tender matches your saved search: ${tender.title}`,
        tenderId: tender.id,
        searchId: search.id
      }
    );
  }
}

export async function GET(request: CloudflareRequest) {
  const rateLimitResponse = await rateLimiter(request);
  if (rateLimitResponse) return rateLimitResponse;

  const startTime = Date.now();
  const stats: any = { sources: [] };
  const errors: any[] = [];

  try {
    console.log('Starting daily tender update...');
    
    const scraperManager = new ScraperManager();
    const categorizationService = new CategorizationService(request.cf.d1);
    const notificationService = new NotificationService(request.cf.d1);
    const searchService = new SearchService(request.cf.d1);
    
    // Scrape all sources
    const { tenders, stats: scrapeStats } = await scraperManager.scrapeAllSources();
    stats.sources = scrapeStats;
    
    // Process each tender
    const tendersToSave: Tender[] = [];
    for (const scrapedTender of tenders) {
      try {
        const tender: Tender = {
          ...scrapedTender,
          id: scrapedTender.id!
        };
        tendersToSave.push(tender);
        await categorizationService.assignCategories(tender.id);
        await notifyMatchingUsers(notificationService, searchService, tender);
      } catch (error) {
        errors.push({
          tenderId: scrapedTender.id,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    // Save all tenders in batch
    if (tendersToSave.length > 0) {
      await scraperManager.saveTendersToDatabase(tendersToSave);
    }
    
    // Create deadline reminders
    await notificationService.createDeadlineReminders();
    
    // Update search index
    await searchService.reindexTenders();
    
    const duration = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      message: 'Daily tender update completed',
      stats: {
        duration,
        totalTenders: tenders.length,
        sources: stats.sources,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    console.error('Error in daily tender update:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error in daily tender update',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
