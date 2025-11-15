import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About';
import Projects from '../components/Projects';
import Packages from '../components/Packages';
import Blog from '../components/Blog';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <About />
      <Projects />
      <Packages />
      <Blog />
      <Footer />
    </>
  );
};

export default Home;
