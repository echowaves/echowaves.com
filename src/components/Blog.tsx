import React from 'react';
import './Blog.css';

interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  link: string;
  readTime: string;
  pinned?: boolean;
}

const Blog: React.FC = () => {
  const featuredPosts: BlogPost[] = [
    {
      title: 'The Token Tax: Why AI-Generated Code Costs More Than You Think',
      description: 'The hidden costs of AI-generated code — token bloat, maintenance debt, and why less is more.',
      date: 'Apr 29, 2026',
      tags: ['AI', 'Architecture', 'Productivity'],
      link: 'https://dev.to/dmitryame/the-token-tax-why-ai-generated-code-costs-more-than-you-think-4a1b',
      readTime: '6 min read'
    },
    {
      title: 'Velocity is a Vanity Metric. Ship Less, Matter More.',
      description: 'Why shipping faster does not mean shipping better — and what actually matters.',
      date: 'Apr 23, 2026',
      tags: ['Engineering', 'Leadership', 'Agile'],
      link: 'https://dev.to/dmitryame/velocity-is-a-vanity-metric-ship-less-matter-more-2k9f',
      readTime: '5 min read'
    },
    {
      title: 'From Vibe Coding to Spec-Driven Development',
      description: 'How I evolved past vibe coding into a structured, spec-driven workflow with AI agents.',
      date: 'Mar 30, 2026',
      tags: ['AI', 'SDD', 'Workflow'],
      link: 'https://dev.to/dmitryame/from-vibe-coding-to-spec-driven-development-3g7h',
      readTime: '7 min read'
    },
    {
      title: 'The End of Vibe Coding',
      description: 'Why the vibe coding era is ending and what disciplined AI-assisted development looks like.',
      date: 'Mar 8, 2026',
      tags: ['AI', 'Vibe Coding', 'Future'],
      link: 'https://dev.to/dmitryame/the-end-of-vibe-coding-4k2m',
      readTime: '5 min read'
    },
    {
      title: 'Make Coding Fun Again',
      description: 'How GenAI and GitHub Copilot are transforming the development experience.',
      date: 'Apr 26, 2025',
      tags: ['GenAI', 'GitHub Copilot', 'JavaScript'],
      link: 'https://dev.to/dmitryame/make-coding-fun-again-1p2a',
      readTime: '8 min read'
    },
    {
      title: "Before vs. After: How AI 'Vibe-Coded' a Mobile App Makeover",
      description: 'UX improvements for mobile app using AI — a before and after side-by-side comparison.',
      date: 'Jun 15, 2025',
      tags: ['AI', 'React Native', 'UX'],
      link: 'https://dev.to/dmitryame/vibe-coding-ux-improvements-for-mobile-app-before-and-after-side-by-side-comparison-h3j',
      readTime: '4 min read'
    },
    {
      title: 'Minimalistic architecture for Minimalistic product',
      description: 'The philosophy behind building lean systems — why less infrastructure means more resilience.',
      date: 'Feb 20, 2019',
      tags: ['Architecture', 'AWS', 'Minimalism'],
      link: 'https://dev.to/dmitryame/minimalistic-architecture-for-minimalistic-product-1lji',
      readTime: '6 min read',
      pinned: true
    }
  ];

  const topicAreas = [
    { icon: '🤖', name: 'AI & Agentic Coding' },
    { icon: '📱', name: 'React Native & Expo' },
    { icon: '🏗️', name: 'Architecture' },
    { icon: '🎸', name: 'Vibe Coding' },
    { icon: '☁️', name: 'AWS & Cloud' },
    { icon: '🚀', name: 'Engineering Leadership' }
  ];

  return (
    <section id="blog" className="blog">
      <h2>Technical Blog</h2>
      <div className="blog-intro">
        <p>
          Sharing insights on React Native, Expo, AI, AWS, and software development best practices.
          Follow along on <a href="https://dev.to/dmitryame" target="_blank" rel="noopener noreferrer">Dev.to</a> for the latest articles.
        </p>
        <div className="blog-stats">
          <div className="blog-stat">
            <span className="blog-stat-number">31</span>
            <span className="blog-stat-label">Posts Published</span>
          </div>
          <div className="blog-stat">
            <span className="blog-stat-number">19</span>
            <span className="blog-stat-label">Comments Written</span>
          </div>
          <div className="blog-stat">
            <span className="blog-stat-number">7+</span>
            <span className="blog-stat-label">Years Active</span>
          </div>
        </div>
      </div>

      <div className="topic-areas">
        <h3>Topics Covered</h3>
        <div className="topics-grid">
          {topicAreas.map((topic) => (
            <div key={topic.name} className="topic-card">
              <span className="topic-icon">{topic.icon}</span>
              <span className="topic-name">{topic.name}</span>
            </div>
          ))}
        </div>
      </div>

      <h3 className="featured-title">Featured Articles</h3>
      <div className="blog-posts">
        {featuredPosts.map((post) => (
          <a 
            key={post.title} 
            href={post.link} 
            className={`blog-post-card${post.pinned ? ' pinned' : ''}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="blog-post-header">
              <h4>{post.title}</h4>
              <span className="read-time">{post.readTime}</span>
            </div>
            <p className="blog-post-description">{post.description}</p>
            <div className="blog-post-tags">
              {post.tags.map((tag) => (
                <span key={tag} className="blog-tag">#{tag}</span>
              ))}
            </div>
            <div className="blog-post-footer">
              <span className="blog-post-date">{post.date}</span>
              <span className="blog-post-link">Read article →</span>
            </div>
          </a>
        ))}
      </div>

      <div className="blog-footer">
        <a href="https://dev.to/dmitryame" className="btn" target="_blank" rel="noopener noreferrer">
          View All 31 Articles on Dev.to
        </a>
      </div>

      <div className="blog-highlight">
        <h3>💡 From the Blog</h3>
        <blockquote>
          "Source of complex solutions to your simple problems."
        </blockquote>
        <p className="blog-bio">
          <strong>Dmitry Amelchenko</strong> — builder at Echowaves, based in Boston MA. 
          Writing about AI-assisted development, spec-driven workflows, React Native, 
          and the philosophy of minimalistic architecture since 2019.
        </p>
      </div>
    </section>
  );
};

export default Blog;
