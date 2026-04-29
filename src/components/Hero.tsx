import React from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <p className="hero-tagline">$ npm install the-future</p>
        <h1 className="hero-title">Open-Source Expo &amp; React Native Tools</h1>
        <p className="hero-upside-down">Sonɹɔǝ oɟ ɔoɯdlǝx solnʇᴉous ʇo ʎonɹ sᴉɯdlǝ dɹoqlǝɯs˙</p>
        <p className="hero-subtitle">
          High-performance packages for mobile development, battle-tested in production apps.
          Built by Dmitry Amelchenko in Boston.
        </p>
        <div className="hero-buttons">
          <a href="#packages" className="btn">Explore Packages</a>
          <a href="https://github.com/echowaves" className="btn btn-outline" target="_blank" rel="noopener noreferrer">
            View on GitHub
          </a>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-number">103+</div>
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
