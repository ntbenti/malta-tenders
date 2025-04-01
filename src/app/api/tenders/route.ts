import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
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

    const response: APIResponse<typeof tenders> = {
      success: true,
      data: tenders
    };

    return NextResponse.json(response);
  } catch (error) {
    const response: APIResponse<never> = {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
    
    return NextResponse.json(response, { status: 500 });
  }
}
