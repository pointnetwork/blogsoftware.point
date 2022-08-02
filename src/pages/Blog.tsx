import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Blog, BlogContractData } from '../@types/interfaces';
import PageLayout from '../layouts/PageLayout';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

const BlogPage = () => {
  const { blogs, getDataFromStorage } = useAppContext();

  const [original, setOriginal] = useState<
    (Blog & BlogContractData) | undefined
  >();
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [displayData, setDisplayData] = useState<
    (Blog & BlogContractData) | undefined
  >();

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const requiredBlog = blogs.data.find((blog) => blog.storageHash === id);
    setOriginal(requiredBlog);
    setDisplayData(requiredBlog);
    setSelectedHash(id!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, blogs]);

  const handleIterationSelect = async (hash: string) => {
    const requiredBlog = await getDataFromStorage(hash);
    setDisplayData(requiredBlog);
    setSelectedHash(hash);
  };

  const handleSelectLatest = () => {
    setDisplayData(original);
    setSelectedHash(id!);
  };

  return (
    <PageLayout>
      <Header />
      <main className='pb-4 pt-8 mx-auto' style={{ maxWidth: '720px' }}>
        <div
          className='flex items-center opacity-40 cursor-pointer hover:opacity-90 transition-all -ml-4'
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon />
          <span>Back</span>
        </div>

        <div className='flex items-center my-4 justify-end'>
          <p className='text-gray-500 mr-4'>Iterations:</p>
          <p
            className={`py-1 px-3 text-sm ${
              selectedHash === id
                ? 'text-white bg-indigo-500'
                : 'bg-gray-100 hover:bg-gray-200'
            } cursor-pointer rounded mr-2`}
            onClick={handleSelectLatest}
          >
            {original?.previousStorageHashes.length! + 1}
          </p>
          {original?.previousStorageHashes.map((hash, i) => (
            <p
              className={`py-1 px-3 text-sm ${
                selectedHash === hash
                  ? 'text-white bg-indigo-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              } cursor-pointer rounded mr-2`}
              key={hash}
              onClick={() => handleIterationSelect(hash)}
            >
              {original?.previousStorageHashes.length - i}
            </p>
          ))}
        </div>
        <h1 className='text-3xl font-bold mt-4'>{displayData?.title}</h1>
        <p className='mt-1 text-sm text-gray-600 mb-6'>
          {displayData?.publishDate}
        </p>
        {displayData?.coverImage ? (
          <div className='bg-gray-200 mb-6'>
            <img
              src={displayData?.coverImage?.toString()}
              alt='cover of the blog'
              className='w-full h-full rounded'
            />
          </div>
        ) : null}
        <div
          // TODO: Safegaurd against XSS
          dangerouslySetInnerHTML={{
            __html: `${displayData?.content}`,
          }}
        ></div>
      </main>
    </PageLayout>
  );
};

export default BlogPage;
