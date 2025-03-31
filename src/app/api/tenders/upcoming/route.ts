import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Mock data for upcoming deadlines API
    const upcomingTenders = [
      {
        id: "tender-004",
        title: "School Furniture Supply",
        contracting_authority: "Ministry of Education",
        procurement_type: "Supplies",
        status: "Open",
        publication_date: "2025-03-22T00:00:00.000Z",
        submission_deadline: "2025-04-10T00:00:00.000Z",
        category: "Education & Training",
        days_remaining: 5
      },
      {
        id: "tender-001",
        title: "Road Infrastructure Improvement",
        contracting_authority: "Transport Malta",
        procurement_type: "Works",
        status: "Open",
        publication_date: "2025-03-15T00:00:00.000Z",
        submission_deadline: "2025-04-15T00:00:00.000Z",
        category: "Construction & Infrastructure",
        days_remaining: 10
      },
      {
        id: "tender-005",
        title: "Public Transport Services",
        contracting_authority: "Transport Malta",
        procurement_type: "Services",
        status: "Open",
        publication_date: "2025-03-18T00:00:00.000Z",
        submission_deadline: "2025-04-18T00:00:00.000Z",
        category: "Transport & Logistics",
        days_remaining: 13
      }
    ];
    
    return NextResponse.json({
      success: true,
      tenders: upcomingTenders
    });
  } catch (error) {
    console.error('Error fetching upcoming deadlines:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching upcoming deadlines',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
