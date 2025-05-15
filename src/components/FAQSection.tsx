import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  const faqItems: FAQItem[] = [
    {
      question: "How does the duplicate detection work?",
      answer: "Our system uses a combination of exact matching and fuzzy matching algorithms to identify potential duplicate contacts. It checks email addresses, phone numbers, and names, allowing for slight variations in spelling or formatting."
    },
    {
      question: "Will I lose any contact data during the merge process?",
      answer: "No, our smart merging technology ensures that all valuable data is preserved. When merging contacts, you can select a master record and choose which fields to keep from each contact."
    },
    {
      question: "How many contacts can I process with the free plan?",
      answer: "The free plan allows you to scan up to 100 contacts and identify duplicates. For larger databases, you'll need to upgrade to our Pro or Enterprise plans."
    },
    {
      question: "Does this work with any GoHighLevel account?",
      answer: "Yes, our tool works with any GoHighLevel account that has API access. It's designed to work seamlessly with GHL's infrastructure."
    },
    {
      question: "How do I connect my GoHighLevel account?",
      answer: "Simply sign up for our service, then follow the authentication process to connect your GoHighLevel account. We use secure OAuth to ensure your data remains protected."
    },
    {
      question: "Can I customize the matching criteria?",
      answer: "Yes, with our Pro and Enterprise plans, you can customize the matching criteria and threshold to fit your specific needs. This allows for more precise duplicate detection."
    }
  ];
  
  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions about our GoHighLevel Bulk De-Duper tool.
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <div 
              key={index} 
              className="mb-4 bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 focus:outline-none"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-medium text-lg text-left text-gray-900">{item.question}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="text-gray-500" />
                ) : (
                  <ChevronDown size={20} className="text-gray-500" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-700">
                  <div className="border-t border-gray-100 pt-4">
                    {item.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;