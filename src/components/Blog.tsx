import React, { useEffect, useState } from 'react';
import { getBlogData, type DevToBlogData } from '../utils/devto';
import './Blog.css';

interface BlogProps {
  blogData?: DevToBlogData;
}

const topicAreas = [
  'AI & Agentic Coding',
  'React Native & Expo',
  'Architecture',
  'Vibe Coding',
  'AWS & Cloud',
  'Engineering Leadership'
];

const Blog: React.FC<BlogProps> = ({ blogData: initialBlogData }) => {
  const [data, setData] = useState<DevToBlogData | null>(initialBlogData);
  const [loading, setLoading] = useState(!initialBlogData);

  // Refresh on every mount so the list is always current; the build-time
  // snapshot (if any) renders immediately and stays as a fallback on error.
  useEffect(() => {
    getBlogData()
      .then(setData)
      .catch(() => {
        if (!data) {
          setData({
            posts: [],
            totalPosts: 0,
            totalComments: 0,
            totalReactions: 0,
            yearsActive: '0+',
          });
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <section id="blog" className="blog">
        <h2>Technical Blog</h2>
        <div className="blog-articles loading">
          <div className="posts-grid">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="post-card loading">
                <div className="post-card-header">
                  <h4>Article Title</h4>
                  <span className="read-time">Loading...</span>
                </div>
                <p className="post-card-description">Description will be loaded...</p>
                <div className="post-card-tags">
                  <span className="post-card-tag">Loading</span>
                </div>
                <div className="post-card-footer">
                  <span className="post-card-date">Loading</span>
                  <span className="post-card-link">Read article →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="blog">
      <h2>Technical Blog</h2>
      <div className="topic-areas">
        <h3>Topics Covered</h3>
        <div className="topics-grid">
          {topicAreas.map((topic) => (
            <div key={topic} className="topic-card">
              <span className="topic-name">{topic}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="blog-articles">
        <h3 className="featured-title">Latest Articles</h3>
        <div className="posts-grid">
          {data?.posts && data.posts.length > 0 ? (
            data.posts.map((post) => (
              <a
                key={post.id}
                href={post.url}
                className={`post-card${post.pinned ? ' pinned' : ''}`}
              >
                <div className="post-card-header">
                  <h4>{post.title}</h4>
                  <span className="read-time">{post.reading_time_minutes} min read</span>
                </div>
                <p className="post-card-description">{post.description}</p>
                <div className="post-card-tags">
                  {post.tag_list.map((tag) => (
                    <span key={tag} className="post-card-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="post-card-footer">
                  <span className="post-card-date">{post.readable_publish_date}</span>
                  <span className="post-card-link">Read article →</span>
                </div>
              </a>
            ))
          ) : (
            <div className="no-posts">
              <p>Latest articles will appear here when you visit the site.</p>
            </div>
          )}
        </div>
      </div>
      <div className="blog-footer">
        <a href="https://dev.to/dmitryame" className="btn" target="_blank" rel="noopener noreferrer">
          {data?.totalPosts ? `View All ${data.totalPosts} Articles on Dev.to` : 'View All Articles on Dev.to'}
        </a>
      </div>
    </section>
  );
};

export default Blog;
