import React, { useState, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import FeatureComparisonModal from './FeatureComparisonModal';

interface PricingSectionProps {
  id?: string;
}

const PLANS = [
  { 
    name: "Free", 
    monthly: 0, 
    features: [
      "Basic detection of exact duplicate contacts",
      "Up to 100 contacts scanning",
      "Manual merge selection",
      "Basic reports"
    ]
  },
  { 
    name: "Pro", 
    monthly: 29, 
    features: [
      "Smart detection of similar contacts using name and email matching",
      "Up to 5,000 contacts scanning",
      "Smart master record selection",
      "Bulk actions",
      "Custom matching criteria"
    ],
    popular: true
  },
  { 
    name: "Enterprise", 
    monthly: 79, 
    features: [
      "Advanced fuzzy matching to identify and merge contacts with slight variations in names, emails, phone numbers and other fields",
      "Unlimited contacts scanning",
      "AI-powered master record selection",
      "Advanced bulk actions",
      "Custom matching criteria",
      "Detailed merge history reports"
    ]
  }
];

const PricingSection: React.FC<PricingSectionProps> = ({ id }) => {
  const [searchParams] = useSearchParams();
  const [isAnnual, setIsAnnual] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check URL params for billing preference
  useEffect(() => {
    const billing = searchParams.get('billing');
    if (billing === 'annual') {
      setIsAnnual(true);
    }
  }, [searchParams]);

  const calculatePrice = (monthlyPrice: number) => {
    if (monthlyPrice === 0) return 0;
    return isAnnual ? monthlyPrice * 10 : monthlyPrice;
  };

  return (
    <section id={id} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for your business needs.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mt-8 gap-4">
            <span className={`text-sm font-medium ${!isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
              style={{ backgroundColor: isAnnual ? '#3563E9' : '#D1D5DB' }}
              role="switch"
              aria-checked={isAnnual}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  isAnnual ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-medium ${isAnnual ? 'text-gray-900' : 'text-gray-500'}`}>
              Annual
              <span className="ml-1.5 text-primary-600 font-semibold">
                Save 17%
              </span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-sm border ${
                plan.popular
                  ? 'border-2 border-primary-500 shadow-lg transform scale-105 relative'
                  : 'border-gray-200'
              } overflow-hidden hover:shadow-md transition-shadow`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary-500 text-white py-1 px-4 text-sm font-medium rounded-bl-lg">
                  POPULAR
                </div>
              )}
              <div className="p-8 border-b border-gray-100">
                <h3 className="font-semibold text-xl mb-2 text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-bold text-gray-900 transition-all duration-300">
                    ${calculatePrice(plan.monthly)}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {isAnnual ? '/year' : '/month'}
                  </span>
                </div>
                <p className="text-gray-600">
                  {plan.name === 'Free' && "Perfect for trying out the service or occasional use."}
                  {plan.name === 'Pro' && "Ideal for 5-10-client agencies — clean up to 5,000 contacts fast with advanced duplicate detection."}
                  {plan.name === 'Enterprise' && "For agencies with 10+ clients or 100,000+ contacts."}
                </p>
                {isAnnual && plan.monthly > 0 && (
                  <p className="text-sm text-primary-600 font-medium mt-2">
                    2 months free
                  </p>
                )}
              </div>
              
              <div className="p-8">
                <ul className="space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check size={20} className="text-success-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link 
                  to="/auth" 
                  className={`mt-8 block w-full py-3 px-4 ${
                    plan.popular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : plan.name === 'Enterprise'
                        ? 'bg-secondary-600 text-white hover:bg-secondary-700'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  } font-medium rounded-lg text-center transition-colors`}
                >
                  Get Started
                </Link>
                {plan.name === 'Free' && (
                  <p className="text-center text-sm text-gray-500 mt-2">
                    No credit card required
                  </p>
                )}
                {isAnnual && plan.monthly > 0 && (
                  <p className="text-center text-xs text-gray-500 mt-2">
                    Billed yearly
                  </p>
                )}
                {plan.popular && (
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Recommended for most agencies
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            View full comparison
          </button>
        </div>
      </div>

      <FeatureComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default PricingSection;