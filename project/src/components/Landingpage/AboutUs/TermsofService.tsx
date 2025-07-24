import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-white px-6 md:px-20 py-10 text-gray-800 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10 text-center">
        Effective Date: July 24, 2025 &nbsp;|&nbsp; Last Updated: July 24, 2025
      </p>

      <section className="space-y-8 text-base leading-7">
        <div>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By using our Service, you agree to comply with and be legally bound by these Terms of Service.
            If you do not agree to these terms, you may not use our Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
          <p>
            [YourAppName] offers recruitment tools for job seekers and employers, including job posting,
            resume submission, interview scheduling, and AI interview tools.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">3. User Eligibility</h2>
          <p>
            You must be at least 18 years old and capable of forming a binding contract to use the Service.
            Employers must provide accurate business information.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">4. User Accounts</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>You must register to access certain features.</li>
            <li>You are responsible for safeguarding your account credentials.</li>
            <li>All information must be accurate and up to date.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">5. Use of the Platform</h2>
          <p>You agree not to:</p>
          <ul className="list-disc ml-6 space-y-1">
            <li>Use the Service unlawfully</li>
            <li>Post fraudulent or misleading listings</li>
            <li>Misuse or harvest user data</li>
            <li>Transmit malware or harmful code</li>
            <li>Reverse-engineer any part of the platform</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">6. Payment & Subscription</h2>
          <ul className="list-disc ml-6 space-y-1">
            <li>Premium features may require a subscription.</li>
            <li>All payments are non-refundable unless otherwise stated.</li>
            <li>Subscriptions auto-renew unless canceled.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Intellectual Property</h2>
          <p>
            All content, branding, and features are owned by [YourAppName] or its licensors. Unauthorized use
            is prohibited.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. Privacy Policy</h2>
          <p>
            Your use of the Service is also governed by our{' '}
            <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">9. Termination</h2>
          <p>
            We may suspend or terminate your account if you violate these Terms. You may also request account
            closure at any time.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">10. Disclaimers</h2>
          <p>
            The Service is provided “as is” without warranties. We don’t guarantee job matches, placements,
            or uninterrupted service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">11. Limitation of Liability</h2>
          <p>
            [YourAppName] is not liable for indirect, incidental, or consequential damages resulting from use
            of the Service.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">12. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Updated terms will be posted here with an effective date.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">13. Contact Us</h2>
          <p>
            If you have questions, please contact us at:<br />
            📧 <a href="mailto:support@yourappname.com" className="text-blue-600">support@yourappname.com</a><br />
            📍 [Your Company Address]
          </p>
        </div>
      </section>
    </div>
  );
};

export default TermsOfService;
