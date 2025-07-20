import React from 'react';
import './TermsOfService.css'; // Reuse your styling for consistency
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../../helpers/useScrollToTop';

function TermsOfService() {
  useScrollToTop();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="coming-soon-container">
      <h1>Terms of Service</h1>
      <p>Last updated: July 20, 2025</p>

      <p>
        Welcome to Little Paws Place. By using our website, you agree to these Terms of Service. Please read them carefully.
      </p>

      <h3>1. Acceptance of Terms</h3>
      <p>
        By accessing or using LittlePawsPlace.com, you agree to be bound by these Terms. If you do not agree, please do not use our site.
      </p>

      <h3>2. Use of the Website</h3>
      <p>
        You may use our site only for lawful purposes. You agree not to use the site to post false or misleading pet listings, harass others, or engage in any activity that violates local or federal laws.
      </p>

      <h3>3. User-Generated Content</h3>
      <p>
        Users are responsible for the accuracy and legality of content they post. We reserve the right to remove any content that violates our guidelines or applicable laws.
      </p>

      <h3>4. No Guarantees</h3>
      <p>
        We do not guarantee the adoption of pets or the accuracy of information in listings. All connections between pet owners and adopters are made at their own discretion and risk.
      </p>

      <h3>5. Limitation of Liability</h3>
      <p>
        Little Paws Place is not liable for any damages or disputes arising from the use of our website or interactions between users.
      </p>

      <h3>6. Third-Party Services</h3>
      <p>
        We may use third-party platforms such as TikTok to promote listings. Your interaction with such services is governed by their respective terms.
      </p>

      <h3>7. Changes to Terms</h3>
      <p>
        We may update these Terms from time to time. Continued use of the site after changes are made constitutes acceptance of those changes.
      </p>

      <h3>8. Contact Us</h3>
      <p>
        For questions about these Terms, contact us at contact@littlepawsplace.com.
      </p>

      <button className="back-button m-4" onClick={goBack}>
        <i className="fa fa-arrow-left"></i> Go Back
      </button>
    </div>
  );
}

export default TermsOfService;
