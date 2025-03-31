'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface TenderDocument {
  id: string;
  title: string;
  file_type: string;
  file_size: number;
  url: string;
}

interface TenderDetails {
  id: string;
  title: string;
  description: string;
  summary: string;
  contracting_authority: string;
  published_on_behalf_of: string;
  procurement_type: string;
  procedure_type: string;
  cpv_codes: string[];
  estimated_value: number;
  currency: string;
  publication_date: string;
  submission_deadline: string;
  opening_date: string;
  status: string;
  source_url: string;
  source_id: string;
  source_name: string;
  categories: { id: string; name: string }[];
  documents: TenderDocument[];
}

export default function TenderDetailsPage({ params }: { params: { id: string } }) {
  const [tender, setTender] = useState<TenderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTenderDetails() {
      try {
        const response = await fetch(`/api/tenders/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tender details');
        }
        const data = await response.json();
        setTender(data.tender);
      } catch (err) {
        setError('Error loading tender details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTenderDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Loading tender details...</h1>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-500">{error}</p>
          <Link href="/" className="text-blue-500 mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  if (!tender) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-4">Tender Not Found</h1>
          <p>The requested tender could not be found.</p>
          <Link href="/" className="text-blue-500 mt-4 inline-block">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-500 hover:underline">
            ← Back to all tenders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-start">
            <h1 className="text-2xl font-bold mb-2">{tender.title}</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              tender.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {tender.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <h2 className="text-lg font-semibold mb-3">Tender Details</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Contracting Authority:</span> {tender.contracting_authority}</p>
                <p><span className="font-medium">Procurement Type:</span> {tender.procurement_type}</p>
                <p><span className="font-medium">Procedure Type:</span> {tender.procedure_type}</p>
                <p><span className="font-medium">Estimated Value:</span> {tender.currency} {tender.estimated_value.toLocaleString()}</p>
                <p><span className="font-medium">Categories:</span> {tender.categories.map(cat => cat.name).join(', ')}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Important Dates</h2>
              <div className="space-y-2">
                <p><span className="font-medium">Publication Date:</span> {new Date(tender.publication_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Submission Deadline:</span> {new Date(tender.submission_deadline).toLocaleDateString()}</p>
                <p><span className="font-medium">Opening Date:</span> {new Date(tender.opening_date).toLocaleDateString()}</p>
                <p><span className="font-medium">Days Remaining:</span> {
                  Math.max(0, Math.ceil((new Date(tender.submission_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
                }</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Description</h2>
            <p className="text-gray-700">{tender.description}</p>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-3">Documents</h2>
            {tender.documents.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {tender.documents.map(doc => (
                  <li key={doc.id} className="py-3">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center hover:bg-gray-50 p-2 rounded"
                    >
                      <div className="bg-gray-100 p-2 rounded mr-3">
                        <span className="uppercase font-bold text-xs">{doc.file_type}</span>
                      </div>
                      <div>
                        <p className="font-medium text-blue-600">{doc.title}</p>
                        <p className="text-sm text-gray-500">
                          {(doc.file_size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No documents available for this tender.</p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <a 
              href={tender.source_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Original Tender
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
