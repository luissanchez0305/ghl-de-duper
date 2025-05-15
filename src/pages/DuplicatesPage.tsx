import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Check, Filter, RefreshCw, Search, X } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import type { Contact, DuplicateGroup, DuplicateGroupSelection } from '../types';

const DuplicatesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId') || '1';
  const { matchingSettings } = useSettings();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroupSelection[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  
  // Mock account data
  const accountName = accountId === '1' 
    ? 'Main Agency Account' 
    : accountId === '2'
      ? 'Client: Acme Corp'
      : accountId === '3'
        ? 'Client: XYZ Industries'
        : 'Client: ABC Services';
  
  // Mock scan function
  const handleScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    // Simulate progress
    const interval = setInterval(() => {
      setScanProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            loadDuplicates();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };
  
  // Mock load duplicates
  const loadDuplicates = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock duplicate groups
      const mockDuplicates: DuplicateGroupSelection[] = [
        {
          id: '1',
          matchType: 'email',
          similarity: 95,
          masterContactId: '101',
          mergeOptions: {
            keepNotes: true,
            keepTags: true
          },
          contacts: [
            {
              id: '101',
              name: 'John Smith',
              email: 'john.smith@example.com',
              phone: '(555) 123-4567',
              lastActivity: '2025-01-15T10:30:00Z',
              tags: ['lead', 'webinar'],
              notes: 'Attended webinar on Jan 10, 2025'
            },
            {
              id: '102',
              name: 'Johnny Smith',
              email: 'john.smith@example.com',
              phone: '(555) 123-9999',
              lastActivity: '2024-11-20T14:45:00Z',
              tags: ['customer'],
              notes: 'Purchased premium plan'
            }
          ]
        },
        {
          id: '2',
          matchType: 'phone',
          similarity: 90,
          masterContactId: '201',
          mergeOptions: {
            keepNotes: true,
            keepTags: true
          },
          contacts: [
            {
              id: '201',
              name: 'Jane Doe',
              email: 'jane@example.com',
              phone: '(555) 987-6543',
              lastActivity: '2025-02-10T09:15:00Z',
              tags: ['lead', 'newsletter'],
              notes: 'Interested in enterprise plan'
            },
            {
              id: '202',
              name: 'Jane D.',
              email: 'jane.doe@company.com',
              phone: '(555) 987-6543',
              lastActivity: '2024-12-05T16:30:00Z',
              tags: ['prospect'],
              notes: 'Follow up needed'
            },
            {
              id: '203',
              name: 'Jane Doe',
              email: 'janedoe@gmail.com',
              phone: '(555) 987-6543',
              lastActivity: '2025-01-25T11:45:00Z',
              tags: ['webinar', 'lead'],
              notes: 'Webinar attendee'
            }
          ]
        }
      ];
      
      setDuplicateGroups(mockDuplicates);
      setIsLoading(false);
    }, 1500);
  };
  
  // Load duplicates on initial render
  useEffect(() => {
    loadDuplicates();
  }, [accountId]);
  
  // Filter duplicates based on search term
  const filteredDuplicates = duplicateGroups.filter(group => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return group.contacts.some(contact => 
      contact.name.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.toLowerCase().includes(searchLower) ||
      contact.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
  // Toggle selection of a group
  const toggleGroupSelection = (groupId: string) => {
    setSelectedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };
  
  // Toggle selection of all groups
  const toggleSelectAll = () => {
    if (selectedGroups.length === filteredDuplicates.length) {
      setSelectedGroups([]);
    } else {
      setSelectedGroups(filteredDuplicates.map(group => group.id));
    }
  };

  // Update master contact for a group
  const updateMasterContact = (groupId: string, contactId: string) => {
    setDuplicateGroups(prev => prev.map(group => 
      group.id === groupId 
        ? { ...group, masterContactId: contactId }
        : group
    ));
  };

  // Toggle merge options for a group
  const toggleMergeOption = (groupId: string, option: keyof DuplicateGroupSelection['mergeOptions']) => {
    setDuplicateGroups(prev => prev.map(group => 
      group.id === groupId 
        ? {
            ...group,
            mergeOptions: {
              ...group.mergeOptions,
              [option]: !group.mergeOptions[option]
            }
          }
        : group
    ));
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
              Duplicate Contacts
            </h1>
            <p className="text-gray-600">
              Account: {accountName}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {selectedGroups.length > 0 && (
              <Link
                to={`/merge?accountId=${accountId}&groups=${selectedGroups.join(',')}`}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
              >
                Merge Selected ({selectedGroups.length})
              </Link>
            )}
            
            <button
              onClick={handleScan}
              disabled={isScanning}
              className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                isScanning
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isScanning ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  Scanning... {Math.round(scanProgress)}%
                </>
              ) : (
                <>
                  <RefreshCw size={16} className="mr-2" />
                  Scan for Duplicates
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Scan Progress */}
      {isScanning && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-900">Scanning for Duplicates</h2>
            <span className="text-sm text-gray-500">{Math.round(scanProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Analyzing contacts using the following criteria:
            <ul className="mt-2 space-y-1">
              {matchingSettings.useEmail && (
                <li className="flex items-center">
                  <Check size={16} className="text-success-500 mr-2" />
                  Email matching with {matchingSettings.emailThreshold}% similarity threshold
                </li>
              )}
              {matchingSettings.usePhone && (
                <li className="flex items-center">
                  <Check size={16} className="text-success-500 mr-2" />
                  Phone matching with {matchingSettings.phoneThreshold}% similarity threshold
                </li>
              )}
              {matchingSettings.useName && (
                <li className="flex items-center">
                  <Check size={16} className="text-success-500 mr-2" />
                  Name matching with {matchingSettings.nameThreshold}% similarity threshold
                </li>
              )}
            </ul>
          </div>
        </div>
      )}
      
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
              placeholder="Search duplicates..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              Filter
            </button>
            
            <button 
              onClick={toggleSelectAll} 
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              {selectedGroups.length === filteredDuplicates.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Duplicate Groups */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw size={32} className="mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600 text-lg">Loading duplicate contacts...</p>
        </div>
      ) : filteredDuplicates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <Check size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No duplicates found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'No results match your search criteria.' : 'This account has no duplicate contacts.'}
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
        <div className="space-y-6">
          {filteredDuplicates.map((group) => (
            <div 
              key={group.id} 
              className={`bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 ${
                selectedGroups.includes(group.id)
                  ? 'border-2 border-primary-500'
                  : 'border border-gray-100'
              }`}
            >
              <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`group-${group.id}`}
                    checked={selectedGroups.includes(group.id)}
                    onChange={() => toggleGroupSelection(group.id)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`group-${group.id}`} className="ml-2 font-medium text-gray-700">
                    Duplicate Group #{group.id}
                  </label>
                  <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                    group.matchType === 'email' 
                      ? 'bg-blue-100 text-blue-800' 
                      : group.matchType === 'phone'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-purple-100 text-purple-800'
                  }`}>
                    {group.matchType === 'email' 
                      ? 'Email Match' 
                      : group.matchType === 'phone'
                        ? 'Phone Match'
                        : 'Email & Phone Match'}
                  </span>
                  <span className="ml-2 text-xs text-gray-500">
                    {group.similarity}% Similar
                  </span>
                </div>
                <div>
                  <Link
                    to={`/merge?accountId=${accountId}&groups=${group.id}`}
                    className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                  >
                    Merge
                  </Link>
                </div>
              </div>
              
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Master
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Phone
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Activity
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keep Notes
                        </th>
                        <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Keep Tags
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {group.contacts.map((contact) => (
                        <tr key={contact.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="radio"
                              name={`master-${group.id}`}
                              checked={group.masterContactId === contact.id}
                              onChange={() => updateMasterContact(group.id, contact.id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                            <div className="text-xs text-gray-500">ID: {contact.id}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              group.matchType === 'email' || group.matchType === 'both'
                                ? 'text-blue-600 font-medium'
                                : 'text-gray-900'
                            }`}>{contact.email}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className={`text-sm ${
                              group.matchType === 'phone' || group.matchType === 'both'
                                ? 'text-green-600 font-medium'
                                : 'text-gray-900'
                            }`}>{contact.phone}</div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(contact.lastActivity).toLocaleDateString()}
                            </div>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={group.mergeOptions.keepNotes}
                              onChange={() => toggleMergeOption(group.id, 'keepNotes')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={group.mergeOptions.keepTags}
                              onChange={() => toggleMergeOption(group.id, 'keepTags')}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
          
          {/* Batch Actions */}
          {selectedGroups.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
              <div className="max-w-7xl mx-auto flex items-center justify-between">
                <div className="flex items-center">
                  <button 
                    onClick={() => setSelectedGroups([])}
                    className="mr-2 p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={16} className="text-gray-500" />
                  </button>
                  <span className="text-gray-700 font-medium">
                    {selectedGroups.length} group{selectedGroups.length !== 1 ? 's' : ''} selected
                  </span>
                </div>
                <Link
                  to={`/merge?accountId=${accountId}&groups=${selectedGroups.join(',')}`}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
                >
                  Merge Selected
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DuplicatesPage;