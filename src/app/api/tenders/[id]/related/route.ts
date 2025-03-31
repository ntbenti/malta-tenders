import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // Mock data for related tenders API
    const relatedTenders = [
      {
        id: id === "tender-001" ? "tender-005" : "tender-001",
        title: id === "tender-001" ? "Public Transport Services" : "Road Infrastructure Improvement",
        contracting_authority: "Transport Malta",
        procurement_type: id === "tender-001" ? "Services" : "Works",
        status: "Open",
        submission_deadline: id === "tender-001" ? "2025-04-18T00:00:00.000Z" : "2025-04-15T00:00:00.000Z",
        category: id === "tender-001" ? "Transport & Logistics" : "Construction & Infrastructure"
      },
      {
        id: "tender-002",
        title: "IT Services Framework Agreement",
        contracting_authority: "MITA",
        procurement_type: "Services",
        status: "Open",
        submission_deadline: "2025-04-20T00:00:00.000Z",
        category: "IT & Technology"
      }
    ];
    
    return NextResponse.json({
      success: true,
      tenders: relatedTenders
    });
  } catch (error) {
    console.error(`Error fetching related tenders for ID ${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching related tenders',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
