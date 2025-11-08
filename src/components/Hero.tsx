import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Building the Future of Mobile Development</h1>
        <p className="hero-subtitle">
          High-performance React Native and Expo components for modern mobile applications
        </p>
        <div className="hero-buttons">
          <a href="#packages" className="btn">Explore Packages</a>
          <a href="https://github.com/echowaves" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">100+</div>
            <div className="stat-label">GitHub Stars</div>
          </div>
          <div className="stat">
            <div className="stat-number">43</div>
            <div className="stat-label">Repositories</div>
          </div>
          <div className="stat">
            <div className="stat-number">1,500+</div>
            <div className="stat-label">Weekly Downloads</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
