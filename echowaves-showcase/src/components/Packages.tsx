import React from 'react';
import './Packages.css';

interface Package {
  name: string;
  version: string;
  description: string;
  downloads: string;
  stars: number;
  features: string[];
  npmLink: string;
  githubLink: string;
  icon: string;
}

const Packages: React.FC = () => {
  const packages: Package[] = [
    {
      name: 'expo-cached-image',
      version: '54.0.7',
      description: 'Super fast cached image component for react-native applications powered by expo',
      downloads: '907/week',
      stars: 100,
      icon: '🖼️',
      features: [
        'Fast image loading with local caching',
        'Secure file handling',
        'Configurable cache expiration',
        'Automatic cache cleanup',
        'TypeScript support'
      ],
      npmLink: 'https://www.npmjs.com/package/expo-cached-image',
      githubLink: 'https://github.com/echowaves/expo-cached-image'
    },
    {
      name: 'expo-storage',
      version: '54.0.6',
      description: 'Simple way to store persistent data, which does not have size limitations of react-native async-storage',
      downloads: '599/week',
      stars: 14,
      icon: '💾',
      features: [
        'No size limitations',
        'Promise-based API',
        'TypeScript support',
        'Persistent storage',
        'Built-in security features'
      ],
      npmLink: 'https://www.npmjs.com/package/expo-storage',
      githubLink: 'https://github.com/echowaves/expo-storage'
    },
    {
      name: 'expo-masonry-layout',
      version: '1.1.11',
      description: 'High-performance masonry layout component for React Native and Expo applications',
      downloads: '8/week',
      stars: 0,
      icon: '📐',
      features: [
        'High Performance with VirtualizedList',
        'Responsive layout',
        'Pull-to-refresh support',
        'Infinite scroll',
        'Smart masonry algorithm'
      ],
      npmLink: 'https://www.npmjs.com/package/expo-masonry-layout',
      githubLink: 'https://github.com/echowaves/expo-masonry-layout'
    }
  ];

  return (
    <section id="packages" className="packages">
      <h2>NPM Packages</h2>
      <p className="packages-intro">
        Production-ready React Native and Expo packages used by thousands of developers worldwide
      </p>
      <div className="packages-grid">
        {packages.map((pkg) => (
          <div key={pkg.name} className="package-card">
            <div className="package-icon">{pkg.icon}</div>
            <div className="package-header">
              <h3>{pkg.name}</h3>
              <span className="version-badge">v{pkg.version}</span>
            </div>
            <p className="package-description">{pkg.description}</p>
            
            <div className="package-stats">
              <div className="stat-item">
                <span className="stat-icon">📦</span>
                <span>{pkg.downloads}</span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span>{pkg.stars} stars</span>
              </div>
            </div>

            <div className="package-features">
              <h4>Features:</h4>
              <ul>
                {pkg.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>

            <div className="package-links">
              <a href={pkg.npmLink} className="btn" target="_blank" rel="noopener noreferrer">
                NPM Package
              </a>
              <a href={pkg.githubLink} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </div>

            <div className="install-command">
              <code>npm install {pkg.name}</code>
            </div>
          </div>
        ))}
      </div>

      <div className="packages-highlight">
        <h3>🌟 Used in Production</h3>
        <p>
          All our packages are battle-tested in real-world applications like{' '}
          <a href="https://wisaw.com" target="_blank" rel="noopener noreferrer">WiSaw</a>
          {' '}— a location-based photo sharing app with thousands of users.
        </p>
        <div className="app-links">
          <a href="https://apps.apple.com/us/app/wisaw/id1299949122" target="_blank" rel="noopener noreferrer" className="btn">
            📱 iOS App
          </a>
          <a href="https://play.google.com/store/apps/details?id=com.echowaves.wisaw" target="_blank" rel="noopener noreferrer" className="btn">
            🤖 Android App
          </a>
          <a href="https://github.com/echowaves/WiSaw" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
            💻 Source Code
          </a>
        </div>
      </div>
    </section>
  );
};

export default Packages;
