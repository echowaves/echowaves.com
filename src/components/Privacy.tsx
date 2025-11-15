import React from 'react';
import './Privacy.css';

const Privacy: React.FC = () => {
  return (
    <section id="privacy" className="privacy">
      <div className="privacy-container">
        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: November 15, 2025</p>

        <div className="privacy-content">
          <h2>Introduction</h2>
          <p>
            Echowaves Corp. ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
            explains how we collect, use, disclose, and safeguard your information when you visit our website 
            and use our applications and services.
          </p>

          <h2>Information We Collect</h2>
          <h3>Personal Information</h3>
          <p>
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul>
            <li>Contact us via email or other communication methods</li>
            <li>Use our applications or services</li>
            <li>Subscribe to our newsletters or updates</li>
            <li>Participate in surveys or feedback requests</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <p>
            When you visit our website, we may automatically collect certain information about your device, including:
          </p>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring website</li>
            <li>Pages viewed and time spent on pages</li>
            <li>Access times and dates</li>
          </ul>

          <h2>Use of Your Information</h2>
          <p>
            We use the information we collect to:
          </p>
          <ul>
            <li>Provide, operate, and maintain our website and services</li>
            <li>Improve, personalize, and expand our offerings</li>
            <li>Understand and analyze how you use our services</li>
            <li>Develop new products, services, features, and functionality</li>
            <li>Communicate with you for customer service and support</li>
            <li>Send you updates, marketing communications, and other information (with your consent)</li>
            <li>Detect, prevent, and address technical issues or security threats</li>
          </ul>

          <h2>Google Analytics</h2>
          <p>
            We use Google Analytics to collect and analyze information about the use of our website. 
            Google Analytics collects information such as how often users visit the site, what pages they visit, 
            and what other sites they used prior to coming to our site. We use the information from Google Analytics 
            to improve our website and services.
          </p>
          <p>
            Google Analytics collects only the IP address assigned to you on the date you visit our site, 
            rather than your name or other identifying information. For more information about Google Analytics, 
            please visit{' '}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              Google's Privacy Policy
            </a>.
          </p>

          <h2>Cookies and Tracking Technologies</h2>
          <p>
            We may use cookies, web beacons, and other tracking technologies to collect information about your 
            browsing behavior. You can instruct your browser to refuse all cookies or to indicate when a cookie 
            is being sent. However, if you do not accept cookies, you may not be able to use some portions of our services.
          </p>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational security measures to protect your personal information. 
            However, please note that no method of transmission over the Internet or electronic storage is 100% secure, 
            and we cannot guarantee absolute security.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            Our website may contain links to third-party websites and services. We are not responsible for the 
            privacy practices or content of these third-party sites. We encourage you to review the privacy policies 
            of any third-party sites you visit.
          </p>

          <h2>Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13. We do not knowingly collect personal 
            information from children under 13. If you are a parent or guardian and believe your child has provided 
            us with personal information, please contact us so we can delete such information.
          </p>

          <h2>Your Data Rights</h2>
          <p>
            Depending on your location, you may have certain rights regarding your personal information, including:
          </p>
          <ul>
            <li>The right to access your personal information</li>
            <li>The right to correct inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to object to or restrict processing</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent</li>
          </ul>

          <h2>Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the 
            new Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this 
            Privacy Policy periodically for any changes.
          </p>

          <h2>Contact Us</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy, please contact us at:
          </p>
          <p className="contact-info">
            <strong>Echowaves Corp.</strong><br />
            Email: <a href="mailto:dmitry@echowaves.com">dmitry@echowaves.com</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Privacy;
