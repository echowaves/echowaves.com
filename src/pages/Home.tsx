import './Home.css'

function Home() {
  return (
    <div className="home">
      <h1>Welcome to Echowaves</h1>
      <p className="tagline">
        A modern React application built with the latest technologies
      </p>
      <div className="features">
        <div className="feature-card">
          <h3>⚡️ Vite</h3>
          <p>Lightning-fast build tool and dev server</p>
        </div>
        <div className="feature-card">
          <h3>⚛️ React 18</h3>
          <p>Latest React with concurrent features</p>
        </div>
        <div className="feature-card">
          <h3>🛣️ React Router</h3>
          <p>File-based routing for seamless navigation</p>
        </div>
        <div className="feature-card">
          <h3>📘 TypeScript</h3>
          <p>Type-safe development experience</p>
        </div>
      </div>
    </div>
  )
}

export default Home
