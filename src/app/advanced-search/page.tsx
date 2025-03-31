'use client';

import { useState } from 'react';
import Link from 'next/link';

interface SearchFilters {
  keyword: string;
  category: string;
  authority: string;
  status: string;
  procurementType: string;
  fromDate: string;
  toDate: string;
}

interface TenderResult {
  id: string;
  title: string;
  contracting_authority: string;
  procurement_type: string;
  status: string;
  publication_date: string;
  submission_deadline: string;
  category: string;
}

export default function AdvancedSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    keyword: '',
    category: '',
    authority: '',
    status: '',
    procurementType: '',
    fromDate: '',
    toDate: '',
  });

  const [results, setResults] = useState<TenderResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setHasSearched(true);
    
    // Mock search results
    setTimeout(() => {
      setResults([
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
        }
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      category: '',
      authority: '',
      status: '',
      procurementType: '',
      fromDate: '',
      toDate: '',
    });
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to homepage
          </Link>
          <h1 className="text-3xl font-bold mt-2">Advanced Search</h1>
          <p className="text-gray-600 mt-1">Find specific tenders using multiple criteria</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSearch}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="keyword" className="block text-sm font-medium text-gray-700">
                      Keyword
                    </label>
                    <input
                      type="text"
                      name="keyword"
                      id="keyword"
                      value={filters.keyword}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="Search in title and description"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={filters.category}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">All Categories</option>
                      <option value="construction">Construction & Infrastructure</option>
                      <option value="it">IT & Technology</option>
                      <option value="healthcare">Healthcare & Medical</option>
                      <option value="education">Education & Training</option>
                      <option value="transport">Transport & Logistics</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="authority" className="block text-sm font-medium text-gray-700">
                      Contracting Authority
                    </label>
                    <select
                      id="authority"
                      name="authority"
                      value={filters.authority}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">All Authorities</option>
                      <option value="transport">Transport Malta</option>
                      <option value="mita">MITA</option>
                      <option value="health">Ministry of Health</option>
                      <option value="education">Ministry of Education</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={filters.status}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">All Statuses</option>
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                      <option value="awarded">Awarded</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="procurementType" className="block text-sm font-medium text-gray-700">
                      Procurement Type
                    </label>
                    <select
                      id="procurementType"
                      name="procurementType"
                      value={filters.procurementType}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="works">Works</option>
                      <option value="services">Services</option>
                      <option value="supplies">Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="fromDate" className="block text-sm font-medium text-gray-700">
                      Publication Date (From)
                    </label>
                    <input
                      type="date"
                      name="fromDate"
                      id="fromDate"
                      value={filters.fromDate}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="toDate" className="block text-sm font-medium text-gray-700">
                      Publication Date (To)
                    </label>
                    <input
                      type="date"
                      name="toDate"
                      id="toDate"
                      value={filters.toDate}
                      onChange={handleFilterChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Search
                    </button>
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Search Results</h2>
              
              {isSearching ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="border border-gray-200 rounded-md p-4">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  ))}
                </div>
              ) : hasSearched ? (
                results.length > 0 ? (
                  <div className="space-y-4">
                    {results.map(tender => (
                      <div key={tender.id} className="border border-gray-200 rounded-md p-4 hover:bg-gray-50">
                        <Link href={`/tenders/${tender.id}`}>
                          <div className="flex justify-between">
                            <h3 className="font-medium text-blue-600">{tender.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              tender.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {tender.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">
                            {tender.contracting_authority} • {tender.procurement_type} • {tender.category}
                          </p>
                          <div className="flex justify-between mt-2 text-sm">
                            <span>Published: {new Date(tender.publication_date).toLocaleDateString()}</span>
                            <span className="font-medium">
                              Deadline: {new Date(tender.submission_deadline).toLocaleDateString()}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tenders match your search criteria.</p>
                    <p className="text-gray-500 mt-1">Try adjusting your filters or search terms.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Use the filters to search for tenders.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
