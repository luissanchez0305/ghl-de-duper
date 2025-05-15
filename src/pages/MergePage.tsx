import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Info, RefreshCw, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastActivity: string;
  tags: string[];
  address?: string;
  notes?: string;
  company?: string;
  position?: string;
}

interface DuplicateGroup {
  id: string;
  contacts: Contact[];
  matchType: 'email' | 'phone' | 'both';
  similarity: number;
}

const MergePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const accountId = searchParams.get('accountId') || '1';
  const groupIds = searchParams.get('groups')?.split(',') || [];
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isMerging, setIsMerging] = useState(false);
  const [duplicateGroups, setDuplicateGroups] = useState<DuplicateGroup[]>([]);
  const [selectedMasters, setSelectedMasters] = useState<Record<string, string>>({});
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  
  // Mock account data
  const accountName = accountId === '1' 
    ? 'Main Agency Account' 
    : accountId === '2'
      ? 'Client: Acme Corp'
      : accountId === '3'
        ? 'Client: XYZ Industries'
        : 'Client: ABC Services';
  
  // Load duplicate groups
  useEffect(() => {
    if (groupIds.length === 0) {
      navigate('/duplicates');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Generate mock duplicate groups
      const mockGroups: DuplicateGroup[] = [
        {
          id: '1',
          matchType: 'email',
          similarity: 95,
          contacts: [
            {
              id: '101',
              name: 'John Smith',
              email: 'john.smith@example.com',
              phone: '(555) 123-4567',
              lastActivity: '2025-01-15T10:30:00Z',
              tags: ['lead', 'webinar'],
              company: 'Acme Inc',
              position: 'Marketing Manager',
              address: '123 Main St, Anytown, USA',
              notes: 'Attended webinar on Jan 10, 2025'
            },
            {
              id: '102',
              name: 'Johnny Smith',
              email: 'john.smith@example.com',
              phone: '(555) 123-9999',
              lastActivity: '2024-11-20T14:45:00Z',
              tags: ['customer'],
              company: 'Acme Corporation',
              notes: 'Purchased premium plan'
            }
          ]
        },
        {
          id: '2',
          matchType: 'phone',
          similarity: 90,
          contacts: [
            {
              id: '201',
              name: 'Jane Doe',
              email: 'jane@example.com',
              phone: '(555) 987-6543',
              lastActivity: '2025-02-10T09:15:00Z',
              tags: ['lead', 'newsletter'],
              position: 'CEO'
            },
            {
              id: '202',
              name: 'Jane D.',
              email: 'jane.doe@company.com',
              phone: '(555) 987-6543',
              lastActivity: '2024-12-05T16:30:00Z',
              tags: ['prospect'],
              company: 'XYZ Corp'
            },
            {
              id: '203',
              name: 'Jane Doe',
              email: 'janedoe@gmail.com',
              phone: '(555) 987-6543',
              lastActivity: '2025-01-25T11:45:00Z',
              tags: ['webinar', 'lead'],
              address: '456 Oak Ave, Springfield, USA'
            }
          ]
        },
        {
          id: '3',
          matchType: 'both',
          similarity: 98,
          contacts: [
            {
              id: '301',
              name: 'Robert Johnson',
              email: 'robert@example.org',
              phone: '(555) 333-4444',
              lastActivity: '2025-02-05T13:20:00Z',
              tags: ['customer', 'vip'],
              company: 'Johnson & Co',
              position: 'Director',
              notes: 'VIP client, special pricing'
            },
            {
              id: '302',
              name: 'Bob Johnson',
              email: 'robert@example.org',
              phone: '(555) 333-4444',
              lastActivity: '2024-10-15T08:45:00Z',
              tags: ['inactive'],
              address: '789 Pine St, Westville, USA'
            }
          ]
        }
      ];
      
      // Filter groups based on groupIds
      const filteredGroups = mockGroups.filter(group => groupIds.includes(group.id));
      setDuplicateGroups(filteredGroups);
      
      // Set default master records
      const masters: Record<string, string> = {};
      filteredGroups.forEach(group => {
        // Choose the contact with the most recent activity as default master
        const sortedContacts = [...group.contacts].sort(
          (a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime()
        );
        masters[group.id] = sortedContacts[0].id;
      });
      setSelectedMasters(masters);
      
      // Expand all groups by default
      setExpandedGroups(filteredGroups.map(group => group.id));
      
      setIsLoading(false);
    }, 1500);
  }, [groupIds, accountId, navigate]);
  
  // Toggle group expansion
  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      if (prev.includes(groupId)) {
        return prev.filter(id => id !== groupId);
      } else {
        return [...prev, groupId];
      }
    });
  };
  
  // Select master record
  const selectMasterRecord = (groupId: string, contactId: string) => {
    setSelectedMasters(prev => ({
      ...prev,
      [groupId]: contactId
    }));
  };
  
  // Handle merge
  const handleMerge = () => {
    // Check if user is on free plan and trying to merge more contacts than allowed
    if (user?.plan === 'free' && getTotalContactsToMerge() > 10) {
      toast.error('Free plan limited to merging 10 contacts. Please upgrade to merge more.');
      return;
    }
    
    setIsMerging(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Successfully merged all duplicate contacts!');
      setIsMerging(false);
      navigate('/dashboard');
    }, 2000);
  };
  
  // Calculate total contacts to be merged
  const getTotalContactsToMerge = () => {
    return duplicateGroups.reduce((total, group) => total + group.contacts.length - 1, 0);
  };
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <Link 
          to={`/duplicates?accountId=${accountId}`} 
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Duplicates
        </Link>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Merge Duplicates
            </h1>
            <p className="text-gray-600">
              Account: {accountName} • {duplicateGroups.length} groups selected
            </p>
          </div>
          
          <button
            onClick={handleMerge}
            disabled={isMerging || isLoading}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
              isMerging || isLoading
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isMerging ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                Merging...
              </>
            ) : (
              'Merge All Selected Groups'
            )}
          </button>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <div className="flex items-start">
          <Info size={20} className="text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-900 mb-1">How Merging Works</h3>
            <p className="text-blue-800 text-sm">
              For each group, select a master record that will be kept. Data from other contacts will be merged into the master record, and then the duplicate contacts will be deleted. Fields from the master record will be preserved, and missing fields will be supplemented from the duplicate contacts.
            </p>
          </div>
        </div>
      </div>
      
      {/* Plan Limitation Warning */}
      {user?.plan === 'free' && getTotalContactsToMerge() > 10 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <Info size={20} className="text-amber-500 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-amber-900 mb-1">Free Plan Limitation</h3>
              <p className="text-amber-800 text-sm">
                Free plan is limited to merging 10 contacts. You're trying to merge {getTotalContactsToMerge()} contacts. 
                <Link to="/#pricing" className="font-medium underline ml-1">
                  Upgrade your plan
                </Link> to merge all these contacts.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Merge Groups */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <RefreshCw size={32} className="mx-auto mb-4 text-gray-400 animate-spin" />
          <p className="text-gray-600 text-lg">Loading duplicate groups...</p>
        </div>
      ) : (
        <div className="space-y-6">
          {duplicateGroups.map((group) => (
            <div 
              key={group.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div 
                className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center cursor-pointer"
                onClick={() => toggleGroupExpansion(group.id)}
              >
                <div className="flex items-center">
                  <h3 className="font-medium text-gray-900">
                    Duplicate Group #{group.id}
                  </h3>
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
                    {group.contacts.length} contacts
                  </span>
                </div>
                <div>
                  {expandedGroups.includes(group.id) ? (
                    <X size={16} className="text-gray-500" />
                  ) : (
                    <Check size={16} className="text-gray-500" />
                  )}
                </div>
              </div>
              
              {expandedGroups.includes(group.id) && (
                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Select Master Record (will be kept after merge)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.contacts.map((contact) => (
                        <div 
                          key={contact.id}
                          onClick={() => selectMasterRecord(group.id, contact.id)}
                          className={`border rounded-lg p-4 cursor-pointer transition-all ${
                            selectedMasters[group.id] === contact.id
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{contact.name}</p>
                              <p className="text-sm text-gray-600">{contact.email}</p>
                              <p className="text-sm text-gray-600">{contact.phone}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Last activity: {new Date(contact.lastActivity).toLocaleDateString()}
                              </p>
                            </div>
                            {selectedMasters[group.id] === contact.id && (
                              <div className="w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0">
                                <Check size={14} className="text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="grid grid-cols-2 gap-2">
                              {contact.company && (
                                <div>
                                  <p className="text-xs text-gray-500">Company</p>
                                  <p className="text-sm text-gray-900">{contact.company}</p>
                                </div>
                              )}
                              {contact.position && (
                                <div>
                                  <p className="text-xs text-gray-500">Position</p>
                                  <p className="text-sm text-gray-900">{contact.position}</p>
                                </div>
                              )}
                            </div>
                            
                            {contact.address && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Address</p>
                                <p className="text-sm text-gray-900">{contact.address}</p>
                              </div>
                            )}
                            
                            {contact.notes && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Notes</p>
                                <p className="text-sm text-gray-900">{contact.notes}</p>
                              </div>
                            )}
                            
                            {contact.tags.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500">Tags</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {contact.tags.map((tag, index) => (
                                    <span 
                                      key={index}
                                      className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Result After Merge
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {group.contacts.map((contact) => {
                        if (contact.id === selectedMasters[group.id]) {
                          // Calculate merged contact
                          const masterContact = contact;
                          const otherContacts = group.contacts.filter(c => c.id !== masterContact.id);
                          
                          // Merge tags from all contacts
                          const allTags = new Set(masterContact.tags);
                          otherContacts.forEach(c => {
                            c.tags.forEach(tag => allTags.add(tag));
                          });
                          
                          return (
                            <div key={contact.id} className="space-y-3">
                              <div className="flex items-center">
                                <div className="w-6 h-6 rounded-full bg-success-500 flex items-center justify-center mr-2">
                                  <Check size={14} className="text-white" />
                                </div>
                                <span className="font-medium text-success-700">
                                  Master Record - Will be kept
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Contact Details</p>
                                  <ul className="mt-2 space-y-1">
                                    <li className="text-sm">
                                      <span className="text-gray-500">Name:</span>{' '}
                                      <span className="text-gray-900">{masterContact.name}</span>
                                    </li>
                                    <li className="text-sm">
                                      <span className="text-gray-500">Email:</span>{' '}
                                      <span className="text-gray-900">{masterContact.email}</span>
                                    </li>
                                    <li className="text-sm">
                                      <span className="text-gray-500">Phone:</span>{' '}
                                      <span className="text-gray-900">{masterContact.phone}</span>
                                    </li>
                                    {masterContact.company || otherContacts.some(c => c.company) ? (
                                      <li className="text-sm">
                                        <span className="text-gray-500">Company:</span>{' '}
                                        <span className="text-gray-900">
                                          {masterContact.company || otherContacts.find(c => c.company)?.company}
                                        </span>
                                      </li>
                                    ) : null}
                                    {masterContact.position || otherContacts.some(c => c.position) ? (
                                      <li className="text-sm">
                                        <span className="text-gray-500">Position:</span>{' '}
                                        <span className="text-gray-900">
                                          {masterContact.position || otherContacts.find(c => c.position)?.position}
                                        </span>
                                      </li>
                                    ) : null}
                                  </ul>
                                </div>
                                
                                <div>
                                  <p className="text-sm font-medium text-gray-900">Additional Information</p>
                                  <ul className="mt-2 space-y-1">
                                    {masterContact.address || otherContacts.some(c => c.address) ? (
                                      <li className="text-sm">
                                        <span className="text-gray-500">Address:</span>{' '}
                                        <span className="text-gray-900">
                                          {masterContact.address || otherContacts.find(c => c.address)?.address}
                                        </span>
                                      </li>
                                    ) : null}
                                    {masterContact.notes || otherContacts.some(c => c.notes) ? (
                                      <li className="text-sm">
                                        <span className="text-gray-500">Notes:</span>{' '}
                                        <span className="text-gray-900">
                                          {masterContact.notes || otherContacts.find(c => c.notes)?.notes}
                                        </span>
                                      </li>
                                    ) : null}
                                    <li className="text-sm">
                                      <span className="text-gray-500">Last Activity:</span>{' '}
                                      <span className="text-gray-900">
                                        {new Date(masterContact.lastActivity).toLocaleDateString()}
                                      </span>
                                    </li>
                                    <li className="text-sm">
                                      <span className="text-gray-500">Tags:</span>{' '}
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {Array.from(allTags).map((tag, index) => (
                                          <span 
                                            key={index}
                                            className="px-2 py-0.5 text-xs rounded-full bg-gray-200 text-gray-800"
                                          >
                                            {tag}
                                          </span>
                                        ))}
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-error-100 border border-error-200 flex items-center justify-center mr-2">
                            <X size={14} className="text-error-500" />
                          </div>
                          <span className="font-medium text-error-700">
                            {group.contacts.length - 1} contact{group.contacts.length > 2 ? 's' : ''} will be deleted
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex justify-end pt-4">
            <button
              onClick={handleMerge}
              disabled={isMerging}
              className={`flex items-center px-6 py-3 rounded-lg font-medium ${
                isMerging
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {isMerging ? (
                <>
                  <RefreshCw size={18} className="mr-2 animate-spin" />
                  Merging...
                </>
              ) : (
                `Merge All Selected Groups (${duplicateGroups.length})`
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MergePage;