
import MainLayout from '@/components/layout/MainLayout';
import { Link } from 'react-router-dom';
import { CircleArrowRight } from 'lucide-react';

const Disclaimer = () => {
  return (
    <MainLayout>
      <div className="safe-container py-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-6">Legal Disclaimer</h1>
          
          <div className="prose text-slate-600 max-w-none mb-8">
            <div className="p-4 bg-slate-50 border-l-4 border-sage-500 rounded mb-6">
              <p className="text-lg font-medium">
                SafeSage is for educational purposes only. The information provided does not constitute financial advice.
              </p>
            </div>
            
            <h2 className="text-xl font-medium text-slate-800 mb-3">Not Financial Advice</h2>
            <p>
              The content, information, and analysis provided by SafeSage ("the Service") are for informational and 
              educational purposes only. Nothing contained in the Service should be construed as investment, legal, 
              tax, or other advice. All content is information of a general nature and does not address the circumstances 
              of any particular individual or entity.
            </p>
            <p>
              You should not make any decisions, financial, investment, trading or otherwise, based solely on the 
              information presented on this platform without conducting your own due diligence and consulting with 
              appropriate financial, legal, tax or other advisors.
            </p>
            
            <h2 className="text-xl font-medium text-slate-800 mb-3 mt-6">No Token Storage or Movement</h2>
            <p>
              SafeSage does not store, hold, or move any of your cryptocurrency tokens or assets. The Service 
              only analyzes on-chain data and publicly available information about tokens. SafeSage does not 
              have access to your private keys, and all wallet connections are read-only.
            </p>
            
            <h2 className="text-xl font-medium text-slate-800 mb-3 mt-6">Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by applicable law, SafeSage and its affiliates, officers, directors, 
              agents, partners and employees shall not be liable for any indirect, incidental, special, consequential 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the Service;</li>
              <li>Any conduct or content of any third party on the Service;</li>
              <li>Any content obtained from the Service; and</li>
              <li>Unauthorized access, use or alteration of your transmissions or content.</li>
            </ul>
            
            <h2 className="text-xl font-medium text-slate-800 mb-3 mt-6">Educational Purpose</h2>
            <p>
              SafeSage is built primarily for educational purposes to help users understand potential risks in 
              cryptocurrency investments. The risk scores, analyses, and suggestions are generated by AI models 
              based on available data and should not be considered definitively accurate or complete.
            </p>
            <p>
              The cryptocurrency market is highly volatile and unpredictable. Past performance is not indicative 
              of future results, and cryptocurrencies that appear low-risk may still experience significant losses.
            </p>
          </div>
          
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-sage-100 rounded-full text-sage-600 flex-shrink-0">
                <CircleArrowRight className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-medium text-slate-800 mb-2">Questions or Concerns?</h3>
                <p className="text-slate-600 text-sm mb-3">
                  If you have any questions about this disclaimer or our service, please contact us or visit our About page.
                </p>
                <Link to="/about" className="text-sage-600 text-sm font-medium hover:text-sage-800">
                  Learn more about SafeSage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Disclaimer;
