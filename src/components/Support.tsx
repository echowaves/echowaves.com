import React from 'react';
import './Support.css';

const Support: React.FC = () => {
  return (
    <section id="support" className="support">
      <div className="support-container">
        <h1>Support</h1>
        <p className="support-subtitle">We're here to help you</p>

        <div className="support-content">
          <div className="support-section">
            <h2>Contact Us</h2>
            <p>
              Have questions, feedback, or need assistance? We'd love to hear from you! 
              Please reach out to us using any of the methods below.
            </p>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="contact-icon">✉️</div>
                <h3>Email Support</h3>
                <p>
                  <a href="mailto:dmitry@echowaves.com">dmitry@echowaves.com</a>
                </p>
                <p className="contact-description">
                  We typically respond within 24-48 hours during business days.
                </p>
              </div>

              <div className="contact-method">
                <div className="contact-icon">💬</div>
                <h3>GitHub Issues</h3>
                <p>
                  Report bugs or request features on our{' '}
                  <a href="https://github.com/echowaves" target="_blank" rel="noopener noreferrer">
                    GitHub repositories
                  </a>
                </p>
                <p className="contact-description">
                  Perfect for technical issues and feature requests.
                </p>
              </div>

              <div className="contact-method">
                <div className="contact-icon">🐦</div>
                <h3>Social Media</h3>
                <p>
                  Follow us on{' '}
                  <a href="https://twitter.com/echowaves" target="_blank" rel="noopener noreferrer">
                    Twitter
                  </a>
                </p>
                <p className="contact-description">
                  Stay updated with the latest news and announcements.
                </p>
              </div>
            </div>
          </div>

          <div className="support-section">
            <h2>Frequently Asked Questions</h2>
            
            <div className="faq-item">
              <h3>How do I report a bug?</h3>
              <p>
                Please open an issue on the relevant GitHub repository or email us with details 
                about the bug, including steps to reproduce it, expected behavior, and any error messages.
              </p>
            </div>

            <div className="faq-item">
              <h3>Can I contribute to your projects?</h3>
              <p>
                Absolutely! All our projects are open source. Check out our{' '}
                <a href="https://github.com/echowaves" target="_blank" rel="noopener noreferrer">
                  GitHub organization
                </a>{' '}
                and feel free to submit pull requests or open discussions.
              </p>
            </div>

            <div className="faq-item">
              <h3>Do you offer commercial support?</h3>
              <p>
                For enterprise support, custom development, or consulting services, please contact us 
                directly at{' '}
                <a href="mailto:dmitry@echowaves.com">dmitry@echowaves.com</a> to discuss your needs.
              </p>
            </div>

            <div className="faq-item">
              <h3>How can I stay updated with new releases?</h3>
              <p>
                You can watch our GitHub repositories, follow us on social media, or subscribe to our 
                package updates on NPM. We also share updates on our{' '}
                <a href="https://dev.to/dmitryame" target="_blank" rel="noopener noreferrer">
                  Dev.to blog
                </a>.
              </p>
            </div>
          </div>

          <div className="support-section">
            <h2>Documentation & Resources</h2>
            <div className="resources-grid">
              <a href="https://github.com/echowaves" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">📚</div>
                <h3>GitHub Repositories</h3>
                <p>View source code and documentation</p>
              </a>

              <a href="https://www.npmjs.com/~echowaves" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">📦</div>
                <h3>NPM Packages</h3>
                <p>Browse our published packages</p>
              </a>

              <a href="https://dev.to/dmitryame" target="_blank" rel="noopener noreferrer" className="resource-card">
                <div className="resource-icon">✍️</div>
                <h3>Blog & Tutorials</h3>
                <p>Read our latest articles and guides</p>
              </a>

              <a href="/" className="resource-card">
                <div className="resource-icon">🏠</div>
                <h3>Homepage</h3>
                <p>Back to main site</p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Support;
