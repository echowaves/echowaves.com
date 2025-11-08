import { Outlet, Link } from 'react-router-dom'
import './Layout.css'

function Layout() {
  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            EchoWaves
          </Link>
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <a 
                href="https://www.wisaw.com/" 
                className="nav-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                WiSaw
              </a>
            </li>
          </ul>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>EchoWaves</h3>
            <p>A non-profit corporation dedicated to innovative social collaboration</p>
          </div>
          <div className="footer-section">
            <h4>Connect</h4>
            <div className="social-links">
              <a 
                href="https://www.linkedin.com/company/2225408" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a 
                href="https://www.facebook.com/groups/1345368729370777" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a 
                href="https://twitter.com/echowaves" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Twitter
              </a>
            </div>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>
              <a href="mailto:dmitry@echowaves.com">
                dmitry@echowaves.com
              </a>
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} EchoWaves. All rights reserved.</p>
          <p className="built-with">Built with React + Vite + TypeScript</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout
