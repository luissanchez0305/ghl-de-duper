import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, Settings, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface Account {
  id: string;
  name: string;
  contactCount: number;
  lastScanned: string | null;
}

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, initiateGHLAuth } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);

  const fetchAccounts = useCallback(async () => {
    if (!user?.accessToken) return;
    
    setIsLoadingAccounts(true);
    try {
      const response = await fetch('/api/accounts', {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch accounts');
      }

      const data = await response.json();
      const accountsWithMetadata = data.accounts.map((account: { id: string; name: string }) => ({
        id: account.id,
        name: account.name,
        contactCount: 0, // Will be updated when scanning
        lastScanned: null,
      }));
      
      setAccounts(accountsWithMetadata);
    } catch (error) {
      console.error('Error fetching accounts:', error);
      toast.error('Failed to fetch accounts. Please try again.');
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [user?.accessToken]);

  // Fetch accounts when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.accessToken) {
      fetchAccounts();
    }
  }, [isAuthenticated, user?.accessToken, fetchAccounts]);

  const fetchContacts = async (accountId: string) => {
    if (!user?.accessToken) return;
    
    try {
      setIsScanning(true);
      setScanProgress(0);

      // Progress simulation
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Fetch contacts from API
      const response = await fetch(`/api/contacts/search?locationId=${accountId}&limit=1000`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch contacts');
      }

      const data = await response.json();
      
      // Update account's contact count and last scanned date
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { 
              ...account, 
              contactCount: data.pagination?.totalContacts || 0,
              lastScanned: new Date().toISOString() 
            }
          : account
      ));

      clearInterval(progressInterval);
      setScanProgress(100);

      toast.success(`Found ${data.groups?.length || 0} duplicate groups!`);
      
      // Short delay before redirect
      setTimeout(() => {
        navigate(`/duplicates?accountId=${accountId}`);
      }, 1000);

    } catch (error) {
      console.error('Error scanning contacts:', error);
      toast.error('Failed to scan contacts. Please try again.');
    } finally {
      setIsScanning(false);
      setScanProgress(0);
    }
  };

  // If not authenticated, show only Quick Start Guide
  if (!isAuthenticated) {
    return (
      <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GHL De-Duper</h1>
          <p className="text-gray-600">
            Connect to your GoHighLevel account to get started with contact deduplication.
          </p>
        </div>

        {/* Quick Start Guide for Unauthenticated Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-semibold text-lg text-gray-900 mb-4">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4 relative">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
                1
              </div>
              <h3 className="font-medium text-gray-900 mb-2 mt-2">Connect Your Account</h3>
              <p className="text-gray-600 text-sm mb-4">
                Connect your GoHighLevel account to start scanning for duplicates.
              </p>
              <button
                onClick={initiateGHLAuth}
                className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
              >
                Connect with GoHighLevel <ArrowRight size={16} className="ml-1" />
              </button>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 relative opacity-50">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-medium">
                2
              </div>
              <h3 className="font-medium text-gray-900 mb-2 mt-2">Scan For Duplicates</h3>
              <p className="text-gray-600 text-sm mb-4">
                Run a scan to find duplicate contacts based on email and phone.
              </p>
              <span className="text-gray-400 flex items-center text-sm font-medium">
                Available after connection
              </span>
            </div>

            <div className="border border-gray-200 rounded-lg p-4 relative opacity-50">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center font-medium">
                3
              </div>
              <h3 className="font-medium text-gray-900 mb-2 mt-2">Merge Duplicates</h3>
              <p className="text-gray-600 text-sm mb-4">
                Review and merge duplicate contacts with a single click.
              </p>
              <span className="text-gray-400 flex items-center text-sm font-medium">
                Available after scanning
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Connected to GoHighLevel. Manage your accounts and find duplicates.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 text-sm font-medium">Connected Accounts</h2>
            <Users size={20} className="text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
          <p className="text-sm text-gray-500 mt-2">Active GoHighLevel accounts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 text-sm font-medium">Total Contacts</h2>
            <Users size={20} className="text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {accounts.reduce((total, account) => total + account.contactCount, 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-2">Across all accounts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 text-sm font-medium">Duplicates Found</h2>
            <Users size={20} className="text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">243</p>
          <p className="text-sm text-gray-500 mt-2">Potential duplicate contacts</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-500 text-sm font-medium">Current Plan</h2>
            <Zap size={20} className="text-primary-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {user?.plan === 'free' ? 'Free' : user?.plan === 'pro' ? 'Pro' : 'Enterprise'}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {user?.plan === 'free' ? (
              <Link to="/#pricing" className="text-primary-600 hover:underline">
                Upgrade now
              </Link>
            ) : (
              'Active subscription'
            )}
          </p>
        </div>
      </div>

      {/* Accounts Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="px-6 py-5 border-b border-gray-100">
          <h2 className="font-semibold text-lg text-gray-900">Connected Accounts</h2>
        </div>

        <div className="overflow-x-auto">
          {isLoadingAccounts ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-primary-600" />
              <span className="ml-3 text-gray-600">Loading accounts...</span>
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No accounts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Unable to fetch your GoHighLevel accounts. Please try reconnecting.
              </p>
              <div className="mt-6">
                <button
                  onClick={fetchAccounts}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacts
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Scanned
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-primary-700 font-semibold">
                          {account.name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-500">ID: {account.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{account.contactCount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {account.lastScanned ? new Date(account.lastScanned).toLocaleDateString() : 'Never scanned'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      account.lastScanned 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {account.lastScanned ? 'Active' : 'Not Scanned'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end items-center space-x-4">
                      <button
                        onClick={() => fetchContacts(account.id)}
                        disabled={isScanning}
                        className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                          isScanning
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                        aria-label={isScanning ? "Scanning contacts..." : "Scan contacts"}
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw size={16} className="mr-2 animate-spin" />
                            Scanning...
                          </>
                        ) : (
                          'Scan Contacts'
                        )}
                      </button>
                      <Link
                        to={`/settings?accountId=${account.id}`}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Settings size={16} />
                      </Link>
                    </div>
                    
                    {/* Progress bar */}
                    {isScanning && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.round(scanProgress)}%` }}
                            role="progressbar"
                            aria-valuenow={Math.round(scanProgress)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {Math.round(scanProgress)}% Complete
                        </p>
                      </div>
                    )}
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="font-semibold text-lg text-gray-900 mb-4">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              1
            </div>
            <h3 className="font-medium text-gray-900 mb-2 mt-2">Connect Your Account</h3>
            <p className="text-gray-600 text-sm mb-4">
              Your GoHighLevel account is connected. You can now scan for duplicates.
            </p>
            <span className="text-green-600 flex items-center text-sm font-medium">
              ✓ Connected
            </span>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              2
            </div>
            <h3 className="font-medium text-gray-900 mb-2 mt-2">Scan For Duplicates</h3>
            <p className="text-gray-600 text-sm mb-4">
              Run a scan to find duplicate contacts based on email and phone.
            </p>
            <Link
              to="/duplicates"
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
            >
              Start Scan <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 relative">
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              3
            </div>
            <h3 className="font-medium text-gray-900 mb-2 mt-2">Merge Duplicates</h3>
            <p className="text-gray-600 text-sm mb-4">
              Review and merge duplicate contacts with a single click.
            </p>
            <Link
              to="/merge"
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
            >
              View Merge Options <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;