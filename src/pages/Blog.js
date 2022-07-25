import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useLocation } from 'wouter';
import { useAppContext } from '../context/AppContext';

const Blog = () => {
  const { blogs } = useAppContext();
  const [data, setData] = useState();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    setData(blogs.find((blog) => blog.id === location.slice(6)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      <Header />
      <main className='pb-4 pt-8 mx-auto' style={{ maxWidth: '720px' }}>
        <div
          className='flex items-center opacity-40 cursor-pointer hover:opacity-90 transition-all'
          onClick={() => setLocation('/')}
        >
          <ArrowBackIosNewIcon />
          <span>Back</span>
        </div>
        <h1 className='text-3xl font-bold mt-4'>{data?.title}</h1>
        <div className='bg-gray-200 my-6'>
          <img
            src={data?.coverImage}
            alt='cover of the blog'
            className='w-full h-full rounded'
          />
        </div>
        <div
          // TODO: Safegaurd against XSS
          dangerouslySetInnerHTML={{
            __html: `${data?.content}`,
          }}
        ></div>
      </main>
    </>
  );
};

export default Blog;
