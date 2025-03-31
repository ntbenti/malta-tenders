import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Mock data for categories API
    const categories = [
      {
        id: "cat_construction",
        name: "Construction & Infrastructure",
        description: "Building, renovation, and infrastructure projects",
        icon: "building",
        count: 12
      },
      {
        id: "cat_healthcare",
        name: "Healthcare & Medical",
        description: "Medical equipment, pharmaceuticals, and healthcare services",
        icon: "medical",
        count: 8
      },
      {
        id: "cat_it",
        name: "IT & Technology",
        description: "Software, hardware, and IT services",
        icon: "computer",
        count: 15
      },
      {
        id: "cat_education",
        name: "Education & Training",
        description: "Educational services, training, and related supplies",
        icon: "school",
        count: 6
      },
      {
        id: "cat_transport",
        name: "Transport & Logistics",
        description: "Vehicles, transportation services, and logistics",
        icon: "truck",
        count: 9
      },
      {
        id: "cat_energy",
        name: "Energy & Utilities",
        description: "Energy production, distribution, and related services",
        icon: "energy",
        count: 7
      },
      {
        id: "cat_environment",
        name: "Environment & Sustainability",
        description: "Environmental services, waste management, and sustainability",
        icon: "leaf",
        count: 5
      },
      {
        id: "cat_financial",
        name: "Financial & Consulting",
        description: "Financial services, consulting, and advisory",
        icon: "chart",
        count: 10
      },
      {
        id: "cat_security",
        name: "Security & Defense",
        description: "Security equipment, services, and defense",
        icon: "shield",
        count: 4
      },
      {
        id: "cat_social",
        name: "Social & Community",
        description: "Social services, community projects, and welfare",
        icon: "people",
        count: 3
      }
    ];
    
    return NextResponse.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Error fetching categories',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
