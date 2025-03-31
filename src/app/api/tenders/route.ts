import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Mock data for tenders API
    const tenders = [
      {
        id: "tender-001",
        title: "Road Infrastructure Improvement",
        contracting_authority: "Transport Malta",
        procurement_type: "Works",
        status: "Open",
        publication_date: "2025-03-15T00:00:00.000Z",
        submission_deadline: "2025-04-15T00:00:00.000Z",
        category: "Construction & Infrastructure"
      },
      {
        id: "tender-002",
        title: "IT Services Framework Agreement",
        contracting_authority: "MITA",
        procurement_type: "Services",
        status: "Open",
        publication_date: "2025-03-20T00:00:00.000Z",
        submission_deadline: "2025-04-20T00:00:00.000Z",
        category: "IT & Technology"
      },
      {
        id: "tender-003",
        title: "Medical Supplies Procurement",
        contracting_authority: "Ministry of Health",
        procurement_type: "Supplies",
        status: "Open",
        publication_date: "2025-03-25T00:00:00.000Z",
        submission_deadline: "2025-04-25T00:00:00.000Z",
        category: "Healthcare & Medical"
      },
      {
        id: "tender-004",
        title: "School Furniture Supply",
        contracting_authority: "Ministry of Education",
        procurement_type: "Supplies",
        status: "Open",
        publication_date: "2025-03-22T00:00:00.000Z",
        submission_deadline: "2025-04-10T00:00:00.000Z",
        category: "Education & Training"
      },
      {
        id: "tender-005",
        title: "Public Transport Services",
        contracting_authority: "Transport Malta",
        procurement_type: "Services",
        status: "Open",
        publication_date: "2025-03-18T00:00:00.000Z",
        submission_deadline: "2025-04-18T00:00:00.000Z",
        category: "Transport & Logistics"
      }
    ];
    
    // Get query parameters
    const searchQuery = request.nextUrl.searchParams.get('search') || '';
    const category = request.nextUrl.searchParams.get('category') || '';
    const authority = request.nextUrl.searchParams.get('authority') || '';
    const status = request.nextUrl.searchParams.get('status') || '';
    
    // Filter tenders based on query parameters
    let filteredTenders = tenders;
    
    if (searchQuery) {
      filteredTenders = filteredTenders.filter(tender => 
        tender.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tender.contracting_authority.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (category) {
      filteredTenders = filteredTenders.filter(tender => 
        tender.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    if (authority) {
      filteredTenders = filteredTenders.filter(tender => 
        tender.contracting_authority.toLowerCase() === authority.toLowerCase()
      );
    }
    
    if (status) {
      filteredTenders = filteredTenders.filter(tender => 
        tender.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    return NextResponse.json({
      success: true,
      tenders: filteredTenders,
      total: filteredTenders.length
    });
  } catch (error) {
    console.error('Error fetching tenders:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching tenders',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
