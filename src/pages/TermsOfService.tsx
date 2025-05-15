import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <Link 
        to="/" 
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
      >
        <ArrowLeft size={16} className="mr-1" /> Back to Home
      </Link>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-sm text-gray-500 mb-8">Effective Date: May 14, 2025</p>

        <p className="mb-6">
          Please read these Terms of Service ("Terms") carefully before using the GHL De-Duper Wizard website and services ("Service").
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">1. Agreement to Terms</h2>
        <p className="mb-6">
          By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of the Terms, you may not access the Service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">2. Subscription and Payments</h2>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Free tier users may scan up to 100 contacts.</li>
          <li className="mb-2">Pro tier subscribers ($29/month) may scan up to 5,000 contacts.</li>
          <li className="mb-2">Enterprise tier subscribers ($79/month) have unlimited scanning capabilities.</li>
          <li className="mb-2">All subscriptions are billed monthly and can be canceled at any time.</li>
          <li className="mb-2">Refunds are provided on a case-by-case basis at our discretion.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">3. User Responsibilities</h2>
        <p className="mb-6">You agree to:</p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Provide accurate and complete information when creating an account</li>
          <li className="mb-2">Maintain the security of your account credentials</li>
          <li className="mb-2">Use the Service in compliance with applicable laws and regulations</li>
          <li className="mb-2">Not attempt to circumvent any limitations or security measures</li>
          <li className="mb-2">Not use the Service to harm others or spread malicious content</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">4. Intellectual Property</h2>
        <p className="mb-6">
          The Service and its original content, features, and functionality are owned by GHL De-Duper Wizard and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">5. Data Processing</h2>
        <p className="mb-6">
          By using our Service, you grant us permission to:
        </p>
        <ul className="list-disc pl-6 mb-6">
          <li className="mb-2">Access and process your GoHighLevel contact data</li>
          <li className="mb-2">Modify contacts when performing merge operations</li>
          <li className="mb-2">Store logs of merge operations for auditing purposes</li>
          <li className="mb-2">Use anonymized data for service improvement</li>
        </ul>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">6. Limitation of Liability</h2>
        <p className="mb-6">
          GHL De-Duper Wizard shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the Service. This includes loss of data, profits, or business opportunities.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">7. Service Modifications</h2>
        <p className="mb-6">
          We reserve the right to modify or discontinue the Service at any time, with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Service.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">8. Termination</h2>
        <p className="mb-6">
          We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users of the Service, us, or third parties, or for any other reason.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">9. Governing Law</h2>
        <p className="mb-6">
          These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">10. Contact Us</h2>
        <p className="mb-6">
          If you have any questions about these Terms, please contact us at:
          <br />
          <a href="mailto:legal@ghldeduper.com" className="text-primary-600 hover:text-primary-700">
            legal@ghldeduper.com
          </a>
        </p>

        <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">11. Changes to Terms</h2>
        <p className="mb-6">
          We reserve the right to update or change these Terms at any time. We will provide notice of any material changes by posting the new Terms on this page and updating the "Effective Date" above. Your continued use of the Service after such modifications will constitute your acknowledgment and agreement to the modified Terms.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;