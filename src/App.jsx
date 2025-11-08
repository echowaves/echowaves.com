import {
  companyOverview,
  flagshipProject,
  principles,
  activities,
  pressQuotes,
  libraries
} from './companyData.js';

const Section = ({ title, children }) => (
  <section>
    <h2>{title}</h2>
    {children}
  </section>
);

export default function App() {
  return (
    <main>
      <header>
        <h1>{companyOverview.name}</h1>
        <p>{companyOverview.description}</p>
      </header>

      <Section title="Mission">
        <p>{companyOverview.mission}</p>
      </Section>

      <Section title="Flagship Project: WiSaw (What I Saw today)">
        <p>{flagshipProject.summary}</p>
        <div className="grid" style={{ marginTop: '1rem' }}>
          {flagshipProject.platforms.map((platform) => (
            <div className="card" key={platform.label}>
              <strong>{platform.label}</strong>
              <div>
                <a href={platform.url} target="_blank" rel="noreferrer">
                  Visit {platform.label}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="screenshots" style={{ marginTop: '1.5rem' }}>
          {flagshipProject.screenshots.map((src, index) => (
            <img src={src} alt={`WiSaw screenshot ${index + 1}`} key={src} />
          ))}
        </div>
      </Section>

      <Section title="Open Source Libraries">
        <div className="grid principles-grid">
          {libraries.map((library) => (
            <div className="card" key={library.name}>
              <h3>{library.name}</h3>
              <p>{library.description}</p>
              <p>
                <strong>Latest:</strong> {library.version} (published {library.published})
              </p>
              <a href={library.url} target="_blank" rel="noreferrer">
                View package details
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Innovation Principles">
        <div className="grid principles-grid">
          {principles.map((principle) => (
            <div className="card" key={principle.title}>
              <h3>{principle.title}</h3>
              <p>{principle.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What We Work On">
        <div className="grid activities-grid">
          {activities.map((activity) => (
            <div className="card" key={activity.title}>
              <h3>{activity.title}</h3>
              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Press">
        {pressQuotes.map((item) => (
          <blockquote key={item.quote}>
            “{item.quote}”
            <footer>
              — {item.author}, {item.date}
            </footer>
          </blockquote>
        ))}
      </Section>

      <Section title="Stay in Touch">
        <p>
          Questions or feedback? Reach the team via{' '}
          <a href={`mailto:${companyOverview.contact.email}`}>
            {companyOverview.contact.email}
          </a>{' '}
          or the support form.
        </p>
        <ul>
          <li>
            <a href={companyOverview.contact.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={companyOverview.contact.facebook} target="_blank" rel="noreferrer">
              Facebook Community
            </a>
          </li>
          <li>
            <a href={companyOverview.contact.twitter} target="_blank" rel="noreferrer">
              Twitter
            </a>
          </li>
          <li>
            <a href="https://dev.to/dmitryame" target="_blank" rel="noreferrer">
              Dev.to Articles
            </a>
          </li>
        </ul>
      </Section>

      <footer>© Echowaves — Privacy-first collaboration experiments.</footer>
    </main>
  );
}
