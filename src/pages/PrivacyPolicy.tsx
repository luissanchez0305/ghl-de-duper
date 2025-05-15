import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link 
        to="/" 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500 mb-8">Effective Date: May 14, 2025</p>

        <p className="mb-6">
          This Privacy Policy describes how GHL De-Duper Wizard ("we," "us," or "our") collects, uses, and shares personal information of users ("you") of our website and services.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Information We Collect</h2>
        <p>We collect the following types of information:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>Personal Information:</strong> This includes your name, email address, and any other information you provide when you create an account, log in, or contact us.</li>
          <li className="mb-2"><strong>GoHighLevel Account Information:</strong> With your explicit consent, we access and store your GoHighLevel location ID and access token to connect to your account and retrieve contact data.</li>
          <li className="mb-2"><strong>Usage Data:</strong> We collect information about how you use our services, such as the number of contacts scanned, duplicates found, and merges performed.</li>
          <li className="mb-2"><strong>Log Data:</strong> Our servers automatically record information created by your use of our services, including your IP address, browser type, operating system, and the dates and times of your visits.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. How We Use Your Information</h2>
        <p>We use your information for the following purposes:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>Providing and Improving Services:</strong> To operate, maintain, and improve our services, including duplicate detection and contact merging.</li>
          <li className="mb-2"><strong>Personalization:</strong> To personalize your experience and provide tailored content and features.</li>
          <li className="mb-2"><strong>Communication:</strong> To communicate with you about your account, updates to our services, and promotional offers.</li>
          <li className="mb-2"><strong>Analytics:</strong> To analyze usage patterns and trends to improve our services.</li>
          <li className="mb-2"><strong>Legal Compliance:</strong> To comply with applicable laws and regulations.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. Data Security</h2>
        <p className="mb-6">
          We take reasonable measures to protect your information from unauthorized access, use, or disclosure. These measures include encryption, firewalls, and access controls. However, no method of transmission over the internet or method of electronic storage is completely secure.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Your Rights</h2>
        <p>You have the following rights with respect to your personal information:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2"><strong>Access:</strong> You have the right to access the personal information we hold about you.</li>
          <li className="mb-2"><strong>Correction:</strong> You have the right to correct any inaccurate or incomplete personal information.</li>
          <li className="mb-2"><strong>Deletion:</strong> You have the right to request the deletion of your personal information.</li>
          <li className="mb-2"><strong>Objection:</strong> You have the right to object to the processing of your personal information.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Contact Us</h2>
        <p className="mb-6">
          If you have any questions about this Privacy Policy, please contact us at:
          <br />
          <a href="mailto:privacy@ghldeduper.com" className="text-primary-600 hover:text-primary-700">
            privacy@ghldeduper.com
          </a>
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Changes to This Privacy Policy</h2>
        <p className="mb-6">
          We may update this Privacy Policy from time to time. We will post any changes on our website and update the "Effective Date" above.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;