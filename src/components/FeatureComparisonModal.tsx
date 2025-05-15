import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface Feature {
  category: string;
  name: string;
  description: string;
  free: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

interface FeatureComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features: Feature[] = [
  {
    category: 'Contact Management',
    name: 'Contact Scanning',
    description: 'Scan contacts for duplicates',
    free: '100 contacts',
    pro: '5,000 contacts',
    enterprise: 'Unlimited',
  },
  {
    category: 'Contact Management',
    name: 'Fuzzy Matching',
    description: 'Smart detection of similar contacts with typo tolerance',
    free: 'Basic',
    pro: 'Advanced',
    enterprise: 'Premium',
  },
  {
    category: 'Contact Management',
    name: 'Bulk Actions',
    description: 'Perform actions on multiple contacts',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Matching Features',
    name: 'Email Matching',
    description: 'Match contacts by email',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Matching Features',
    name: 'Phone Matching',
    description: 'Match contacts by phone number',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Matching Features',
    name: 'Name Matching',
    description: 'Match contacts by name similarity',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Matching Features',
    name: 'Custom Match Rules',
    description: 'Create custom matching criteria',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Merging Options',
    name: 'Manual Merge',
    description: 'Manually select records to merge',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Merging Options',
    name: 'Auto-Merge',
    description: 'Automatically merge duplicates',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Merging Options',
    name: 'Smart Field Selection',
    description: 'AI-powered field selection during merge',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    category: 'Reporting',
    name: 'Basic Reports',
    description: 'View duplicate detection results',
    free: true,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Reporting',
    name: 'Advanced Analytics',
    description: 'Detailed merge history and statistics',
    free: false,
    pro: true,
    enterprise: true,
  },
  {
    category: 'Reporting',
    name: 'Custom Reports',
    description: 'Create and schedule custom reports',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    category: 'API Access',
    name: 'API Integration',
    description: 'Access via REST API',
    free: false,
    pro: 'Limited',
    enterprise: 'Full access',
  },
  {
    category: 'Support',
    name: 'Email Support',
    description: 'Get help via email',
    free: 'Basic',
    pro: 'Priority',
    enterprise: '24/7 Priority',
  },
  {
    category: 'Support',
    name: 'Phone Support',
    description: 'Get help via phone',
    free: false,
    pro: false,
    enterprise: true,
  },
  {
    category: 'Support',
    name: 'Onboarding',
    description: 'Personalized setup assistance',
    free: false,
    pro: 'Basic',
    enterprise: 'Advanced',
  }
];

const FeatureComparisonModal: React.FC<FeatureComparisonModalProps> = ({ isOpen, onClose }) => {
  // Handle ESC key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Group features by category
  const groupedFeatures = features.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<string, Feature[]>);

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="feature-comparison-modal"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 bg-white rounded-md hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              onClick={onClose}
              aria-label="Close"
            >
              <X size={24} />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="w-full mt-3 text-center sm:mt-0 sm:text-left">
              <h3 
                className="text-2xl font-bold text-gray-900 mb-8" 
                id="feature-comparison-modal"
              >
                Full Feature Comparison
              </h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="py-3 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 w-1/3">
                        Feature
                      </th>
                      <th scope="col" className="px-3 py-3 text-center text-sm font-semibold text-gray-900 w-1/6">
                        Free
                      </th>
                      <th scope="col" className="px-3 py-3 text-center text-sm font-semibold text-gray-900 w-1/6">
                        Pro
                      </th>
                      <th scope="col" className="px-3 py-3 text-center text-sm font-semibold text-gray-900 w-1/6">
                        Enterprise
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {Object.entries(groupedFeatures).map(([category, categoryFeatures]) => (
                      <React.Fragment key={category}>
                        <tr className="bg-gray-50">
                          <th
                            colSpan={4}
                            scope="colgroup"
                            className="py-2 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            {category}
                          </th>
                        </tr>
                        {categoryFeatures.map((feature, featureIdx) => (
                          <tr key={feature.name} className={featureIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="py-4 pl-4 pr-3 text-sm sm:pl-6">
                              <div className="font-medium text-gray-900">{feature.name}</div>
                              <div className="text-gray-500">{feature.description}</div>
                            </td>
                            <td className="px-3 py-4 text-sm text-center">
                              {typeof feature.free === 'boolean' ? (
                                feature.free ? (
                                  <span className="text-success-600">✓</span>
                                ) : (
                                  <span className="text-error-600">✕</span>
                                )
                              ) : (
                                <span className="text-gray-900">{feature.free}</span>
                              )}
                            </td>
                            <td className="px-3 py-4 text-sm text-center">
                              {typeof feature.pro === 'boolean' ? (
                                feature.pro ? (
                                  <span className="text-success-600">✓</span>
                                ) : (
                                  <span className="text-error-600">✕</span>
                                )
                              ) : (
                                <span className="text-gray-900">{feature.pro}</span>
                              )}
                            </td>
                            <td className="px-3 py-4 text-sm text-center">
                              {typeof feature.enterprise === 'boolean' ? (
                                feature.enterprise ? (
                                  <span className="text-success-600">✓</span>
                                ) : (
                                  <span className="text-error-600">✕</span>
                                )
                              ) : (
                                <span className="text-gray-900">{feature.enterprise}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureComparisonModal;