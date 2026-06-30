import React from 'react';
import HeroSection from '../components/home/HeroSection';
import CategoryGrid from '../components/home/CategoryGrid';

const HomePage = () => {
  return (
    <div className="flex flex-col space-y-12 pb-12">
      <HeroSection />
      <CategoryGrid />
    </div>
  );
};

export default HomePage;