import React, { useState } from 'react';
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
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [accounts, setAccounts] = useState<Account[]>([
    {
      id: '1',
      name: 'Main Agency Account',
      contactCount: 3245,
      lastScanned: '2025-02-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Client: Acme Corp',
      contactCount: 1876,
      lastScanned: '2025-02-10T14:45:00Z',
    },
    {
      id: '3',
      name: 'Client: XYZ Industries',
      contactCount: 4532,
      lastScanned: null,
    },
    {
      id: '4',
      name: 'Client: ABC Services',
      contactCount: 945,
      lastScanned: null,
    },
  ]);

  const fetchContacts = async (accountId: string) => {
    try {
      setIsScanning(true);
      setScanProgress(0);

      // Simulate API progress updates
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 98) {
            clearInterval(progressInterval);
            return 98;
          }
          return prev + Math.random() * 10;
        });
      }, 500);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Update account's last scanned date
      setAccounts(prev => prev.map(account => 
        account.id === accountId 
          ? { ...account, lastScanned: new Date().toISOString() }
          : account
      ));

      clearInterval(progressInterval);
      setScanProgress(100);

      toast.success('Contact scan completed successfully!');
      
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

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Connect to your GoHighLevel accounts and start finding duplicates.
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
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-900">Connected Accounts</h2>
          <div className="flex items-center space-x-3">
            <Link
              to="/connect"
              className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700"
            >
              Connect New Account
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
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
              Connect your GoHighLevel account to start scanning for duplicates.
            </p>
            <Link
              to="/connect"
              className="text-primary-600 hover:text-primary-700 flex items-center text-sm font-medium"
            >
              Connect Account <ArrowRight size={16} className="ml-1" />
            </Link>
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