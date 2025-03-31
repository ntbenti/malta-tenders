import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Mock data for featured tenders API
    const featuredTenders = [
      {
        id: "tender-001",
        title: "Road Infrastructure Improvement",
        contracting_authority: "Transport Malta",
        procurement_type: "Works",
        status: "Open",
        publication_date: "2025-03-15T00:00:00.000Z",
        submission_deadline: "2025-04-15T00:00:00.000Z",
        category: "Construction & Infrastructure",
        featured: true
      },
      {
        id: "tender-002",
        title: "IT Services Framework Agreement",
        contracting_authority: "MITA",
        procurement_type: "Services",
        status: "Open",
        publication_date: "2025-03-20T00:00:00.000Z",
        submission_deadline: "2025-04-20T00:00:00.000Z",
        category: "IT & Technology",
        featured: true
      },
      {
        id: "tender-003",
        title: "Medical Supplies Procurement",
        contracting_authority: "Ministry of Health",
        procurement_type: "Supplies",
        status: "Open",
        publication_date: "2025-03-25T00:00:00.000Z",
        submission_deadline: "2025-04-25T00:00:00.000Z",
        category: "Healthcare & Medical",
        featured: true
      }
    ];
    
    return NextResponse.json({
      success: true,
      tenders: featuredTenders
    });
  } catch (error) {
    console.error('Error fetching featured tenders:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching featured tenders',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
