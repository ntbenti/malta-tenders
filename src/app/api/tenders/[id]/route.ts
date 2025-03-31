import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    // Mock data for tender details
    const tenderDetails = {
      id,
      title: id === "tender-001" 
        ? "Road Infrastructure Improvement" 
        : id === "tender-002"
        ? "IT Services Framework Agreement"
        : id === "tender-003"
        ? "Medical Supplies Procurement"
        : id === "tender-004"
        ? "School Furniture Supply"
        : "Public Transport Services",
      description: "This tender is for the procurement of services related to the improvement and maintenance of infrastructure in Malta. The successful bidder will be responsible for delivering high-quality services according to the specifications outlined in the tender documents.",
      summary: "Procurement of services for infrastructure improvement and maintenance.",
      contracting_authority: id === "tender-001" || id === "tender-005"
        ? "Transport Malta"
        : id === "tender-002"
        ? "MITA"
        : id === "tender-003"
        ? "Ministry of Health"
        : "Ministry of Education",
      published_on_behalf_of: "",
      procurement_type: id === "tender-001" ? "Works" : id === "tender-003" || id === "tender-004" ? "Supplies" : "Services",
      procedure_type: "Open",
      cpv_codes: ["45000000", "45233000"],
      estimated_value: 500000,
      currency: "EUR",
      publication_date: "2025-03-15T00:00:00.000Z",
      submission_deadline: id === "tender-004" 
        ? "2025-04-10T00:00:00.000Z" 
        : id === "tender-001"
        ? "2025-04-15T00:00:00.000Z"
        : id === "tender-005" || id === "tender-002"
        ? "2025-04-18T00:00:00.000Z"
        : "2025-04-25T00:00:00.000Z",
      opening_date: "2025-04-26T10:00:00.000Z",
      status: "Open",
      source_url: `https://www.etenders.gov.mt/epps/cft/prepareViewCfTWS.do?resourceId=${id}`,
      source_id: "src_etenders",
      source_name: "eTenders Malta",
      categories: [
        id === "tender-001" || id === "tender-005"
          ? { id: "cat_construction", name: "Construction & Infrastructure" }
          : id === "tender-002"
          ? { id: "cat_it", name: "IT & Technology" }
          : id === "tender-003"
          ? { id: "cat_healthcare", name: "Healthcare & Medical" }
          : { id: "cat_education", name: "Education & Training" }
      ],
      documents: [
        {
          id: `doc-${id}-1`,
          title: "Tender Specifications",
          file_type: "pdf",
          file_size: 2500000,
          url: `https://www.etenders.gov.mt/epps/cft/downloadDocument.do?documentId=${id}-spec`
        },
        {
          id: `doc-${id}-2`,
          title: "Bill of Quantities",
          file_type: "xlsx",
          file_size: 500000,
          url: `https://www.etenders.gov.mt/epps/cft/downloadDocument.do?documentId=${id}-boq`
        },
        {
          id: `doc-${id}-3`,
          title: "Terms and Conditions",
          file_type: "pdf",
          file_size: 1200000,
          url: `https://www.etenders.gov.mt/epps/cft/downloadDocument.do?documentId=${id}-terms`
        }
      ]
    };
    
    return NextResponse.json({
      success: true,
      tender: tenderDetails
    });
  } catch (error) {
    console.error(`Error fetching tender details for ID ${params.id}:`, error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching tender details',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
