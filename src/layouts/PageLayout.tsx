import React from 'react';
import Loader from '../components/Loader';
import { useAppContext } from '../context/AppContext';

const PageLayout = ({ children }: { children: any }) => {
  const { loading } = useAppContext();

  return (
    <>
      {loading ? (
        <div className='h-screen w-screen flex items-center justify-center'>
          <Loader>Loading...</Loader>
        </div>
      ) : (
        children
      )}
    </>
  );
};

export default PageLayout;
