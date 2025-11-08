import './About.css'

function About() {
  return (
    <div className="about">
      <h1>About Echowaves</h1>
      <div className="about-content">
        <p>
          This is a modern React web application built with cutting-edge technologies
          to provide the best development experience and performance.
        </p>
        <h2>Technology Stack</h2>
        <ul className="tech-list">
          <li><strong>React 18.3:</strong> The latest version with improved performance and features</li>
          <li><strong>Vite 5:</strong> Next-generation frontend tooling for blazing fast builds</li>
          <li><strong>TypeScript 5.6:</strong> Type-safe JavaScript for better code quality</li>
          <li><strong>React Router 6:</strong> Declarative routing for React applications</li>
          <li><strong>ESLint:</strong> Code linting to maintain code quality</li>
        </ul>
        <h2>Features</h2>
        <ul className="features-list">
          <li>File-based routing structure</li>
          <li>Hot Module Replacement (HMR)</li>
          <li>TypeScript support out of the box</li>
          <li>Modern CSS with custom properties</li>
          <li>Responsive design</li>
          <li>MIT License - free and open source</li>
        </ul>
      </div>
    </div>
  )
}

export default About
