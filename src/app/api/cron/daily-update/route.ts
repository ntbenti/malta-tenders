import { ScraperManager } from '@/lib/scrapers';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('Starting daily tender update...');
    
    // Create a new scraper manager
    const scraperManager = new ScraperManager();
    
    // Scrape all sources
    const { tenders, stats } = await scraperManager.scrapeAllSources();
    
    // Save tenders to database
    await scraperManager.saveTendersToDatabase(tenders);
    
    return NextResponse.json({
      success: true,
      message: 'Daily tender update completed successfully',
      stats: {
        totalTenders: tenders.length,
        sources: stats
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
