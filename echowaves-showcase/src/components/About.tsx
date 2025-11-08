import React from 'react';
import './About.css';

const About: React.FC = () => {
  return (
    <section id="about" className="about">
      <h2>About Echowaves</h2>
      <div className="about-content">
        <div className="about-text">
          <p>
            Echowaves Corp. is dedicated to building high-quality, open-source tools and applications 
            for the React Native and Expo ecosystem. With a focus on performance, security, and 
            developer experience, we create solutions that help developers build better mobile applications.
          </p>
          <p>
            Our mission is to solve real-world problems in mobile development by providing robust, 
            well-documented, and actively maintained packages that developers can rely on.
          </p>
        </div>
        <div className="about-features">
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>High Performance</h3>
            <p>Optimized components built for speed and efficiency</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🔒</div>
            <h3>Secure</h3>
            <p>Built-in security features and best practices</p>
          </div>
          <div className="feature">
            <div className="feature-icon">📚</div>
            <h3>Well Documented</h3>
            <p>Comprehensive documentation and examples</p>
          </div>
          <div className="feature">
            <div className="feature-icon">💪</div>
            <h3>Production Ready</h3>
            <p>Battle-tested in real-world applications</p>
          </div>
        </div>
        <div className="about-links">
          <a href="https://www.echowaves.com" target="_blank" rel="noopener noreferrer" className="btn">
            Visit Website
          </a>
          <a href="https://www.linkedin.com/in/dmitryame" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            Connect on LinkedIn
          </a>
          <a href="mailto:dmitry@echowaves.com" className="btn btn-outline">
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
