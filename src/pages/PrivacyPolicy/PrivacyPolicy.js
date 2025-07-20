import React from 'react';
import './PrivacyPolicy.css'; // You can keep this if it styles the layout well
import { useNavigate } from 'react-router-dom';
import useScrollToTop from '../../helpers/useScrollToTop';

function PrivacyPolicy() {
  useScrollToTop();
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="coming-soon-container">
      <h1>Privacy Policy</h1>
      <p>Last updated: July 20, 2025</p>

      <p>
        At Little Paws Place, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website.
      </p>

      <h3>Information We Collect</h3>
      <ul>
        <li>Personal details such as name, email, and location when you create a listing or contact someone.</li>
        <li>Device and usage data like browser type, visit duration, and pages viewed.</li>
      </ul>

      <h3>How We Use Your Information</h3>
      <ul>
        <li>To display pet listings and facilitate communication between adopters and pet owners.</li>
        <li>To improve our website functionality and user experience.</li>
        <li>To send notifications and updates (only with your consent).</li>
      </ul>

      <h3>Third-Party Services</h3>
      <p>
        We may integrate with services such as TikTok for marketing purposes. These platforms may collect data based on their own privacy policies.
      </p>

      <h3>Data Security</h3>
      <p>
        We use secure technologies such as HTTPS, AWS Secrets Manager, and authenticated user access to protect your information.
      </p>

      <h3>Your Rights</h3>
      <p>
        You can request to update or delete your information at any time by contacting us at contact@littlepawsplace.com.
      </p>

      <h3>Changes to This Policy</h3>
      <p>
        We may update this policy from time to time. Check back here for the latest version.
      </p>

      <button className="back-button m-4" onClick={goBack}>
        <i className="fa fa-arrow-left"></i> Go Back
      </button>
    </div>
  );
}

export default PrivacyPolicy;
