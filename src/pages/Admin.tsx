import React from 'react';
import { useLocation } from 'wouter';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import { PrimaryButton } from '../components/Button';
import { useAppContext } from '../context/AppContext';

const Admin = () => {
  const { blogs } = useAppContext();
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
            {blogs?.length ? (
              blogs.map((blog, i) => (
                <BlogPreviewItem data={blog} admin key={i} />
              ))
            ) : (
              <div className='border-t border-gray-200 text-gray-500 font-medium pt-4'>
                <p className='text-2xl mb-1'>
                  You have not created any blogs yet.
                </p>
                <p className='text-2xl'>
                  Click{' '}
                  <span className='font-bold text-black'>
                    "Create New Blog"
                  </span>{' '}
                  to create your first blog.
                </p>
              </div>
            )}
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
