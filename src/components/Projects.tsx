import React from 'react';
import './Projects.css';

interface Project {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  link: string;
  tags: string[];
}

const Projects: React.FC = () => {
  const projects: Project[] = [
    {
      name: 'WiSaw',
      description: 'Incognito photos and short videos, anonymous posting. A location-based photo sharing mobile app.',
      stars: 35,
      forks: 6,
      language: 'JavaScript',
      link: 'https://github.com/echowaves/WiSaw',
      tags: ['Mobile', 'Photo Sharing', 'React Native']
    },
    {
      name: 'WiSaw.cdk',
      description: 'Infrastructure as code for WiSaw using AWS CDK',
      stars: 0,
      forks: 0,
      language: 'TypeScript',
      link: 'https://github.com/echowaves/WiSaw.cdk',
      tags: ['AWS', 'CDK', 'Infrastructure']
    },
    {
      name: 'WiSaw.client',
      description: 'Client application for WiSaw photo sharing platform',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      link: 'https://github.com/echowaves/WiSaw.client',
      tags: ['Client', 'Frontend', 'React Native']
    },
    {
      name: 'get2knowu',
      description: 'Social networking application for getting to know people',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      link: 'https://github.com/echowaves/get2knowu',
      tags: ['Social', 'Networking']
    },
    {
      name: 'chimingClock',
      description: 'A beautiful chiming clock application',
      stars: 0,
      forks: 0,
      language: 'JavaScript',
      link: 'https://github.com/echowaves/chimingClock',
      tags: ['Utility', 'Clock']
    }
  ];

  return (
    <section id="projects" className="projects">
      <h2>Our Projects</h2>
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.name} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className="language-badge">{project.language}</span>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className="project-stats">
              <span>⭐ {project.stars}</span>
              <span>🔱 {project.forks}</span>
            </div>
            <a href={project.link} className="project-link" target="_blank" rel="noopener noreferrer">
              View on GitHub →
            </a>
          </div>
        ))}
      </div>
      <div className="projects-footer">
        <a href="https://github.com/orgs/echowaves/repositories" className="btn" target="_blank" rel="noopener noreferrer">
          View All 43 Repositories
        </a>
      </div>
    </section>
  );
};

export default Projects;
