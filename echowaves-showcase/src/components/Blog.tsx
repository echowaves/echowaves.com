import React from 'react';
import './Blog.css';

interface BlogPost {
  title: string;
  description: string;
  date: string;
  tags: string[];
  link: string;
  readTime: string;
}

const Blog: React.FC = () => {
  const featuredPosts: BlogPost[] = [
    {
      title: 'From 18 to 3 Hours: When Gen AI Overdelivers (or Did It?)',
      description: 'Exploring how Gen AI performs against its own estimates and holds itself accountable.',
      date: 'Aug 14, 2024',
      tags: ['AI', 'GenAI', 'Productivity'],
      link: 'https://dev.to/dmitryame/how-good-is-gen-ai-at-providing-estimates-and-then-holding-itself-accountable-for-meeting-them-3pee',
      readTime: '2 min read'
    },
    {
      title: "Before vs. After: How AI 'Vibe-Coded' a Mobile App Makeover That Defies Expectations!",
      description: 'UX improvements for mobile app using AI - a before and after side-by-side comparison.',
      date: 'Jun 15, 2024',
      tags: ['AI', 'React Native', 'UX'],
      link: 'https://dev.to/dmitryame/vibe-coding-ux-improvements-for-mobile-app-before-and-after-side-by-side-comparison-h3j',
      readTime: '4 min read'
    },
    {
      title: 'Design Smarter: Testing Top LLMs for Mobile UI Optimization',
      description: 'Comparing different LLMs for optimizing mobile interface design.',
      date: 'Jun 15, 2024',
      tags: ['AI', 'React Native', 'Design'],
      link: 'https://dev.to/dmitryame/design-smarter-testing-top-llms-for-mobile-interface-optimization-k89',
      readTime: '5 min read'
    },
    {
      title: 'Make Coding Fun Again',
      description: 'How GenAI and GitHub Copilot are transforming the development experience.',
      date: 'Apr 26, 2024',
      tags: ['GenAI', 'GitHub Copilot', 'JavaScript'],
      link: 'https://dev.to/dmitryame/make-coding-fun-again-1p2a',
      readTime: '8 min read'
    },
    {
      title: 'Simple alternative to react-native async-storage',
      description: 'Introduction to expo-storage - a better solution for persistent data storage.',
      date: 'Aug 20, 2021',
      tags: ['React Native', 'Storage', 'Expo'],
      link: 'https://dev.to/dmitryame/simple-alternative-to-react-native-async-storage-5hid',
      readTime: '4 min read'
    },
    {
      title: 'Implementing fast-image for react-native expo apps',
      description: 'The origin story of expo-cached-image - solving image caching in React Native.',
      date: 'Jan 19, 2021',
      tags: ['React Native', 'Hooks', 'JavaScript'],
      link: 'https://dev.to/dmitryame/implementing-fast-image-for-react-native-expo-apps-1dn3',
      readTime: '4 min read'
    }
  ];

  const topicAreas = [
    { icon: '🤖', name: 'AI & GenAI', color: '#667eea' },
    { icon: '📱', name: 'React Native', color: '#61dafb' },
    { icon: '☁️', name: 'AWS & Cloud', color: '#ff9900' },
    { icon: '🚀', name: 'Agile & Leadership', color: '#00c853' },
    { icon: '🔧', name: 'Performance', color: '#f4511e' },
    { icon: '🔒', name: 'Security & Privacy', color: '#e91e63' }
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
            <span className="blog-stat-number">26</span>
            <span className="blog-stat-label">Posts Published</span>
          </div>
          <div className="blog-stat">
            <span className="blog-stat-number">19</span>
            <span className="blog-stat-label">Comments Written</span>
          </div>
          <div className="blog-stat">
            <span className="blog-stat-number">6+</span>
            <span className="blog-stat-label">Years Active</span>
          </div>
        </div>
      </div>

      <div className="topic-areas">
        <h3>Topics Covered</h3>
        <div className="topics-grid">
          {topicAreas.map((topic) => (
            <div key={topic.name} className="topic-card" style={{ borderColor: topic.color }}>
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
            className="blog-post-card"
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
          View All 26 Articles on Dev.to
        </a>
      </div>

      <div className="blog-highlight">
        <h3>💡 From the Blog</h3>
        <blockquote>
          "Source of complex solutions to your simple problems."
        </blockquote>
        <p className="blog-bio">
          <strong>Dmitry Amelchenko</strong> - CTO at Echowaves, based in Boston MA. 
          Joined Dev.to on Feb 19, 2019. Skills: React Native, Node.js, GraphQL, AWS, SQL, 
          Agile, Team Building, Motivation, Mentoring.
        </p>
      </div>
    </section>
  );
};

export default Blog;
