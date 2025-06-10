import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, Database, Layers, Zap } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import PricingSection from '../components/PricingSection';
import FAQSection from '../components/FAQSection';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      
      {/* Feature Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Why Choose Our Bulk De-Duper?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simplify your contact management with powerful tools designed specifically for GoHighLevel users.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Zap size={24} className="text-primary-600" />}
              title="Bulk Processing"
              description="Process thousands of contacts in minutes instead of hours with our optimized scanning algorithm."
            />
            <FeatureCard 
              icon={<Database size={24} className="text-primary-600" />}
              title="Smart Detection"
              description="Fuzzy matching algorithms find duplicates even when data isn't an exact match."
            />
            <FeatureCard 
              icon={<Layers size={24} className="text-primary-600" />}
              title="Master Record Selection"
              description="Intelligently select which contact data to keep during the merging process."
            />
            <FeatureCard 
              icon={<BarChart2 size={24} className="text-primary-600" />}
              title="Detailed Reporting"
              description="Get comprehensive reports on duplicates found and merged to track your progress."
            />
            <FeatureCard 
              icon={<Database size={24} className="text-primary-600" />}
              title="Data Preservation"
              description="Never lose important contact information with our smart merging technology."
            />
            <FeatureCard 
              icon={<Zap size={24} className="text-primary-600" />}
              title="One-Click Merging"
              description="Merge hundreds of duplicates with a single click, saving hours of manual work."
            />
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join hundreds of satisfied GoHighLevel agencies who have cleaned up their client databases.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard 
              quote="This tool saved me hours of manual work. I had over 3,000 duplicate contacts across my client accounts and cleaned them up in minutes!"
              author="Sarah Johnson"
              role="Digital Marketing Agency Owner"
              rating={5}
            />
            <TestimonialCard 
              quote="The fuzzy matching is brilliant. It found duplicates that I never would have caught manually due to slight differences in spelling."
              author="Mark Williams"
              role="CRM Administrator"
              rating={5}
            />
            <TestimonialCard 
              quote="Excellent tool that pays for itself instantly. My client's email deliverability improved dramatically after cleaning up their contact database."
              author="Jessica Miller"
              role="Email Marketing Specialist"
              rating={4}
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Clean Up Your GHL Contacts?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Get started today with our free plan and see the difference organized contact data can make.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'} <ArrowRight size={18} className="ml-2" />
            </Link>
            <a 
              href="#pricing" 
              className="px-6 py-3 bg-transparent border-2 border-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              View Pricing
            </a>
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <PricingSection id="pricing" />
      
      {/* FAQ Section */}
      <FAQSection />
    </div>
  );
};

export default HomePage;