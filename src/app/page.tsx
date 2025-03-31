export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Malta Government Tenders
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your comprehensive source for all Maltese government and agency tenders, 
            updated daily with the latest opportunities.
          </p>
        </div>

        <div className="mb-10">
          <div className="bg-white rounded-lg shadow-md p-6">
            <form className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <label htmlFor="search-query" className="sr-only">Search tenders</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search-query"
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 pr-12 py-3 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search for tenders by keyword, category, or authority..."
                  />
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Search
              </button>
              <button
                type="button"
                className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Advanced
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Featured Tenders</h2>
                <a href="/tenders" className="text-blue-600 hover:text-blue-800">
                  View All
                </a>
              </div>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Road Infrastructure Improvement</h3>
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Authority:</span> Transport Malta
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Deadline: April 15, 2025
                    </span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">IT Services Framework Agreement</h3>
                  <div className="text-sm text-gray-500 mb-2">
                    <span className="font-medium">Authority:</span> MITA
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Deadline: April 20, 2025
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
              <div className="grid grid-cols-2 gap-3">
                <a 
                  href="/tenders?category=construction"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Construction</span>
                </a>
                <a 
                  href="/tenders?category=it"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">IT & Technology</span>
                </a>
                <a 
                  href="/tenders?category=healthcare"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Healthcare</span>
                </a>
                <a 
                  href="/tenders?category=education"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors"
                >
                  <span className="text-sm font-medium text-gray-900">Education</span>
                </a>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Upcoming Deadlines</h2>
              <div className="space-y-4">
                <a href="/tenders/1" className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Medical Supplies Procurement
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Ministry of Health
                    </p>
                    <p className="text-xs font-medium text-red-600">
                      Deadline: April 5, 2025 (5 days left)
                    </p>
                  </div>
                </a>
                <a href="/tenders/2" className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md transition-colors">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center bg-yellow-100 text-yellow-600">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      School Furniture Supply
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      Ministry of Education
                    </p>
                    <p className="text-xs font-medium text-yellow-600">
                      Deadline: April 10, 2025 (10 days left)
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">About This Platform</h2>
          <p className="text-gray-600 mb-4">
            The Malta Government Tenders platform aggregates all tenders published by the Maltese government and its agencies into a single, 
            easy-to-use website. Our platform is updated daily to ensure you have access to the latest opportunities.
          </p>
          <p className="text-gray-600 mb-4">
            Key features include:
          </p>
          <ul className="list-disc pl-5 text-gray-600 mb-4 space-y-2">
            <li>Comprehensive collection of all government tenders</li>
            <li>Advanced filtering and search capabilities</li>
            <li>Daily updates with new tender opportunities</li>
            <li>Categorization by industry and sector</li>
            <li>Personalized alerts for tenders matching your interests</li>
            <li>Detailed tender information and documentation</li>
          </ul>
          <p className="text-gray-600">
            Whether you're a small business looking for opportunities or a large corporation tracking government procurement, 
            our platform provides the tools you need to find and apply for relevant tenders.
          </p>
        </div>
      </div>
    </main>
  );
}
