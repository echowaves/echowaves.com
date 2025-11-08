import './About.css'

function About() {
  return (
    <div className="about">
      <h1>About EchoWaves</h1>
      <div className="about-content">
        <section className="mission">
          <h2>Our Mission</h2>
          <p>
            Echowaves is a <strong>non-profit corporation</strong> dedicated to providing 
            new and innovative ways to collaborate online through research and innovation 
            in modern technology and user experience.
          </p>
        </section>

        <section className="wisaw-section">
          <h2>What I Saw (WiSaw)</h2>
          <p>
            Our most recent work is a new social collaboration platform called{' '}
            <a href="https://www.wisaw.com/" target="_blank" rel="noopener noreferrer">
              WiSaw
            </a>
            , which stands for <strong>"What I Saw today"</strong>.
          </p>
          <p>
            The main goal is to create an alternative to Facebook, Twitter, SnapChat, and
            similar platforms. By no means are FB, Twitter, and SnapChat the de-facto 
            standards of social collaboration. However, these standards are rapidly getting 
            out of date, mostly due to privacy concerns, improper handling of personal data, 
            and complexity.
          </p>
        </section>

        <section className="tech-philosophy">
          <h2>Our Philosophy</h2>
          <div className="philosophy-grid">
            <div className="philosophy-item">
              <h3>Extreme Simplicity</h3>
              <p>
                We believe that the best tools are the simplest ones. WiSaw has only 2 screens, 
                but that's all you really need. No complicated features, no overwhelming options 
                – just what matters.
              </p>
            </div>
            <div className="philosophy-item">
              <h3>Absolute Privacy</h3>
              <p>
                Privacy is achieved by never asking users for any personal information – not 
                even a login is required. This is how the application is designed from the 
                very beginning, and we will do everything we can to keep it this way.
              </p>
            </div>
            <div className="philosophy-item">
              <h3>Complete Transparency</h3>
              <p>
                Everyone can see and do everything. Photos are visible to anyone nearby, but 
                anyone viewing a photo has the power to delete it if inappropriate. Photos 
                are short-lived and automagically disappear after a short while.
              </p>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <h2>Technology Stack</h2>
          <p>This website is built with modern web technologies:</p>
          <ul className="tech-list">
            <li><strong>React 18.3:</strong> Latest React with improved performance and features</li>
            <li><strong>Vite 5:</strong> Next-generation frontend tooling for blazing fast builds</li>
            <li><strong>TypeScript 5.6:</strong> Type-safe JavaScript for better code quality</li>
            <li><strong>React Router 6:</strong> Declarative routing for React applications</li>
          </ul>
          <p>
            The WiSaw mobile app is built in <strong>React Native</strong> and published with{' '}
            <a href="https://expo.io/@dmitryame/projects/WiSaw" target="_blank" rel="noopener noreferrer">
              Expo
            </a>.
          </p>
        </section>

        <section className="open-source">
          <h2>Open Source</h2>
          <p>
            This project is open source and licensed under the <strong>MIT License</strong>. 
            We believe in transparency and community collaboration.
          </p>
        </section>

        <section className="contact-section">
          <h2>Get in Touch</h2>
          <p>
            We'd love to hear from you! Whether you have questions, feedback, or just want 
            to say hello, feel free to reach out.
          </p>
          <p className="contact-email">
            <a href="mailto:dmitry@echowaves.com?subject=getting%20in%20touch%20with%20Echowaves">
              dmitry@echowaves.com
            </a>
          </p>
          <div className="social-links-about">
            <a 
              href="https://www.linkedin.com/company/2225408" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              LinkedIn
            </a>
            <a 
              href="https://www.facebook.com/groups/1345368729370777" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              Facebook
            </a>
            <a 
              href="https://twitter.com/echowaves" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              Twitter
            </a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
