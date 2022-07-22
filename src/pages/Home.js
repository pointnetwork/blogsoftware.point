import React from 'react';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';

const Home = () => {
  return (
    <div className='h-screen overflow-hidden'>
      <Header />
      <main
        className='flex mt-4 mx-auto'
        style={{ maxWidth: '1000px', height: window.screen.height - 220 }}
      >
        <div className='flex-1 pr-6 border-r h-full overflow-y-scroll'>
          {Array(10)
            .fill(1)
            .map((_, i) => (
              <BlogPreviewItem key={i} />
            ))}
        </div>
        <div className='basis-72 flex flex-col pl-8 mt-8 overflow-y-scroll pr-4'>
          <IdentityInfo />
        </div>
      </main>
    </div>
  );
};

export default Home;
