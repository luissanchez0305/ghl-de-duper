import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, Filter, RefreshCw, Search } from 'lucide-react';

interface MergeEvent {
  id: string;
  accountId: string;
  accountName: string;
  timestamp: string;
  duplicatesFound: number;
  mergedContacts: number;
  status: 'completed' | 'failed' | 'partial';
  user: string;
}

const HistoryPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [mergeHistory, setMergeHistory] = useState<MergeEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load merge history
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockHistory: MergeEvent[] = [
        {
          id: '1',
          accountId: '1',
          accountName: 'Main Agency Account',
          timestamp: '2025-04-01T13:45:00Z',
          duplicatesFound: 42,
          mergedContacts: 42,
          status: 'completed',
          user: 'Demo User'
        },
        {
          id: '2',
          accountId: '2',
          accountName: 'Client: Acme Corp',
          timestamp: '2025-03-28T09:15:00Z',
          duplicatesFound: 83,
          mergedContacts: 76,
          status: 'partial',
          user: 'Demo User'
        },
        {
          id: '3',
          accountId: '3',
          accountName: 'Client: XYZ Industries',
          timestamp: '2025-03-25T16:30:00Z',
          duplicatesFound: 12,
          mergedContacts: 12,
          status: 'completed',
          user: 'Demo User'
        },
        {
          id: '4',
          accountId: '2',
          accountName: 'Client: Acme Corp',
          timestamp: '2025-03-20T10:45:00Z',
          duplicatesFound: 5,
          mergedContacts: 0,
          status: 'failed',
          user: 'Demo User'
        },
        {
          id: '5',
          accountId: '1',
          accountName: 'Main Agency Account',
          timestamp: '2025-03-15T14:20:00Z',
          duplicatesFound: 28,
          mergedContacts: 28,
          status: 'completed',
          user: 'Demo User'
        }
      ];
      
      setMergeHistory(mockHistory);
      setIsLoading(false);
    }, 1500);
  }, []);
  
  // Filter history based on search term
  const filteredHistory = mergeHistory.filter(item => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      item.accountName.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      item.user.toLowerCase().includes(searchLower)
    );
  });
  
  // Status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-success-100 text-success-800';
      case 'partial':
        return 'bg-warning-100 text-warning-800';
      case 'failed':
        return 'bg-error-100 text-error-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          to="/dashboard" 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Merge History
            </h1>
            <p className="text-gray-600">
              View and export your contact merge history
            </p>
          </div>
          
          <button
            onClick={() => window.print()}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
          >
            <Download size={16} className="mr-2" />
            Export Report
          </button>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filter
            </button>
          </div>
        </div>
      </div>
      
      {/* History Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw size={32} className="mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600 text-lg">Loading merge history...</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Download size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No merge history found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No results match your search criteria.' : 'You haven\'t merged any contacts yet.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duplicates Found
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacts Merged
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(event.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{event.accountName}</div>
                      <div className="text-xs text-gray-500">ID: {event.accountId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.duplicatesFound}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.mergedContacts}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {event.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary-600 hover:text-primary-900">
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;