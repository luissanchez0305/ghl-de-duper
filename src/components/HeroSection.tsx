import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const HeroSection: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Bulk De-Duper Wizard for <span className="text-primary-600">GoHighLevel</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Clean up your contact database in minutes! Our wizard scans all contacts, detects duplicates with smart matching, and merges them in bulk with just one click.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center">
                <CheckCircle size={20} className="text-primary-600 mr-3" />
                <span className="text-gray-700">Detect duplicates based on email & phone with fuzzy matching</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-primary-600 mr-3" />
                <span className="text-gray-700">Merge unlimited contacts with one click</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-primary-600 mr-3" />
                <span className="text-gray-700">Smart field selection preserves all important data</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={20} className="text-primary-600 mr-3" />
                <span className="text-gray-700">Works with any GoHighLevel sub-account</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard" 
                className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight size={18} className="ml-2" />
              </Link>
              <a 
                href="#how-it-works" 
                className="px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="p-2 bg-gray-50 border-b border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
              </div>
              <div className="p-6">
                <img 
                  src="https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="GoHighLevel Bulk De-Duper Dashboard Preview" 
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;