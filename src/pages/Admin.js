import React from 'react';
import { useLocation } from 'wouter';
import BlogPreviewItem from '../components/BlogPreviewItem';
import { PrimaryButton } from '../components/Button';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';

const Admin = () => {
  const [, setLocation] = useLocation();

  return (
    <div className='h-screen overflow-hidden'>
      <Header />
      <main
        className='flex mt-4 mx-auto'
        style={{ maxWidth: '1000px', height: window.screen.height - 220 }}
      >
        <div className='flex-1 border-r'>
          <div className='flex items-center justify-between mb-4 mr-5'>
            <h2 className='text-3xl font-bold'>Your Blogs</h2>
            <PrimaryButton onClick={() => setLocation('/create')}>
              Create New Blog
            </PrimaryButton>
          </div>
          <div
            className='overflow-y-scroll pr-6'
            style={{ height: window.screen.height - 260 }}
          >
            {Array(10)
              .fill(1)
              .map((_, i) => (
                <BlogPreviewItem admin key={i} />
              ))}
          </div>
        </div>
        <div className='basis-72 flex flex-col overflow-y-scroll px-8 -mr-4'>
          <h2 className='text-3xl font-bold mb-6'>Your Info</h2>
          <IdentityInfo admin />
        </div>
      </main>
    </div>
  );
};

export default Admin;
