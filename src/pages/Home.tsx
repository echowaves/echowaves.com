import './Home.css'

const storeLinks = [
  {
    href: 'http://itunes.apple.com/us/app/wisaw/id1299949122',
    label: 'Download on the App Store',
    badgeClass: 'ios-badge',
  },
  {
    href: 'http://play.google.com/store/apps/details?id=com.echowaves.wisaw',
    label: 'Get it on Google Play',
    badgeClass: 'android-badge',
  },
]

const descriptionParagraphs = [
  'No registration, no sign in — just open the app, start taking photos, and see what\'s posted by other people nearby today.',
  'This is the most minimalistic social sharing possible, yet, it\'s probably the most relevant one as well. It\'s relevant in time and space. You only see what may potentially matter to you. You do not choose what you see. As such, you do not have to spend time and effort making connections, describing your profile etc. You just start using it.',
  'The feed will always stay relevant for your location and time. If you see something you do not like — just delete it, which will have an effect of drastically increasing the quality of the content for everyone, reducing the noise.',
]

const useCases = [
  'Wedding or celebration party',
  'A day at the beach or in the park',
  'Students on campus',
  'Conference attendees capturing the moment',
  'Fans at a football game',
]

const principleItems = [
  {
    title: 'extreme simplicity',
    description: "The app has only 2 screens, but that's all you really need.",
  },
  {
    title: 'absolute privacy',
    description:
      "It's achieved by never asking a user for any personal information (not even login is required). This is the way the application is designed from the very beginning. And we will do everything we can to keep it this way.",
  },
  {
    title: 'complete transparency',
    description:
      'Everyone can see and do everything. As soon as your photo is uploaded through the app, it becomes visible to anyone who is nearby. Anybody viewing a photo has the power to delete it if it is found to be inappropriate. Even if you delete a photo by mistake, no worries — the photos are short-lived and will automagically disappear after a short while.',
  },
]

const screenshots = [
  {
    src: 'https://static.wixstatic.com/media/c90e7e_b63315ecf1524616aa1636a2e03fe14c~mv2.png/v1/fill/w_682,h_1400,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/iPhone%20Xs%20Max%201.png',
    alt: 'WiSaw feed screen showcasing nearby posts',
  },
  {
    src: 'https://static.wixstatic.com/media/c90e7e_e066f1aeab0d44a989fbec0769ac69c0~mv2.png/v1/fill/w_670,h_1410,al_c,q_90,usm_0.66_1.00_0.01,enc_avif,quality_auto/iPhone%20Xs%20Max%202.png',
    alt: 'WiSaw capture screen ready to take a photo',
  },
]

const additionalLinks = [
  { label: 'Who we are', href: 'https://www.echowaves.com/' },
  { label: 'Screenshots', href: 'https://www.echowaves.com/' },
  { label: 'Press', href: 'https://www.echowaves.com/' },
  { label: 'Contact Us', href: 'https://www.echowaves.com/support' },
  { label: 'Blog', href: 'https://www.echowaves.com/blog' },
  { label: 'What I Saw', href: 'https://www.echowaves.com/what-i-saw' },
  { label: 'PlaceChatter', href: 'https://www.echowaves.com/placechatter' },
  { label: 'News', href: 'https://www.echowaves.com/' },
  { label: 'Features', href: 'https://www.echowaves.com/' },
  { label: 'Review', href: 'https://www.echowaves.com/' },
]

function StoreBadges() {
  return (
    <div className="app-badges">
      {storeLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="badge-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={`badge ${link.badgeClass}`}>{link.label}</span>
        </a>
      ))}
    </div>
  )
}

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="hero-preheading">EchoWaves</p>
          <h1 className="hero-title">What I Saw today</h1>
          <p className="hero-subtitle">
            No registration, no sign in — just open the app, start taking photos, and see what\'s
            posted by other people nearby today.
          </p>
          <StoreBadges />
        </div>
        <div className="hero-media">
          <img
            src="https://static.wixstatic.com/media/fc7570_fd1e64b65701485a8606dc3cd01b69e0~mv2.png/v1/fill/w_355,h_720,al_c,lg_1,q_85,enc_avif,quality_auto/fc7570_fd1e64b65701485a8606dc3cd01b69e0~mv2.png"
            alt="WiSaw mobile app preview"
            className="hero-image"
            loading="lazy"
          />
          <img
            src="https://static.wixstatic.com/media/fc7570_13825f90a3ee4eb7899ef4f9154c5772~mv2.gif"
            alt="WiSaw octopus illustration"
            className="hero-graphic"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  )
}

function DescriptionSection() {
  return (
    <section className="description">
      <div className="description-content">
        {descriptionParagraphs.map((copy) => (
          <p key={copy.slice(0, 20)}>{copy}</p>
        ))}
        <p>
          This works best for events, large and small. Wedding or celebration party, at a beach or a
          park, student at a campus, or a conference attendee, or a group of fans at a football game —
          these all will benefit from WiSaw and will definitely make it a lot more fun.
        </p>
        <ul className="use-case-list">
          {useCases.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p>
          The project is built in React Native and published with Expo at{' '}
          <a
            href="https://expo.io/@dmitryame/projects/WiSaw"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://expo.io/@dmitryame/projects/WiSaw
          </a>
          .
        </p>
      </div>
    </section>
  )
}

function InnovationSection() {
  return (
    <section className="innovation-principles">
      <h2>Innovation Principles</h2>
      <p className="principles-intro">
        The main goal is to create an alternative to Facebook, Twitter, SnapChat, and such. Main
        innovation principles WiSaw is built upon:
      </p>
      <div className="principles-grid">
        {principleItems.map((principle) => (
          <div key={principle.title} className="principle-card">
            <h3>{principle.title}</h3>
            <p>{principle.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function WhoWeAreSection() {
  return (
    <section className="about-echowaves">
      <div className="about-content">
        <h2>Who we are</h2>
        <p className="nonprofit">Echowaves is a non-profit corporation.</p>
        <p>
          Our main objective is to provide new cool ways to collaborate online, through research and
          innovation in modern technology and user experience.
        </p>
        <p>
          The most recent work is a new social collaboration platform called WiSaw, which stands for
          <strong> What I Saw today.</strong>
        </p>
        <p>
          The main goal is to create an alternative to FaceBook, Twitter, SnapChat, and such. The
          standards of social collaboration are rapidly getting out of date, mostly due to privacy
          concerns, improper handling of personal data, and complexity.
        </p>
      </div>
    </section>
  )
}

function ScreenshotsSection() {
  return (
    <section className="screenshots">
      <div className="screenshots-heading">
        <h2>ScreenShots</h2>
        <p className="screenshots-subheading">that's right, only two</p>
      </div>
      <div className="screenshots-grid">
        {screenshots.map((image) => (
          <figure key={image.src} className="screenshot-card">
            <img src={image.src} alt={image.alt} loading="lazy" />
          </figure>
        ))}
      </div>
    </section>
  )
}

function PressSection() {
  return (
    <section className="press-review">
      <h2>Press Review</h2>
      <blockquote className="review">
        <p className="review-text">
          “Really up front, what you see is what you get, and I'm getting something unique and bold.”
        </p>
        <footer className="review-author">
          <cite>Isaac Picado</cite>
          <time dateTime="2018-02-24">February 24, 2018</time>
        </footer>
      </blockquote>
    </section>
  )
}

function AdditionalLinksSection() {
  return (
    <section className="additional-links">
      <h2>Additional Links</h2>
      <ul>
        {additionalLinks.map((link) => (
          <li key={link.label}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CallToActionSection() {
  return (
    <section className="cta">
      <h2>Download &amp; Have Fun Now!</h2>
      <StoreBadges />
      <div className="contact">
        <p>
          <a href="mailto:dmitry@echowaves.com?subject=getting%20in%20touch%20with%20Echowaves">
            dmitry@echowaves.com
          </a>
        </p>
        <div className="cta-social-links">
          <a href="https://www.linkedin.com/company/2225408" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
          <a
            href="https://www.facebook.com/groups/1345368729370777"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>
          <a href="https://twitter.com/echowaves" target="_blank" rel="noopener noreferrer">
            Twitter
          </a>
        </div>
      </div>
    </section>
  )
}

function Home() {
  return (
    <div className="home">
      <HeroSection />
      <DescriptionSection />
      <InnovationSection />
      <WhoWeAreSection />
      <ScreenshotsSection />
      <PressSection />
      <AdditionalLinksSection />
      <CallToActionSection />
    </div>
  )
}

export default Home
