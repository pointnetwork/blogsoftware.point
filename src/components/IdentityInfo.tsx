import React from 'react';
import { useAppContext } from '../context/AppContext';
import Loader from './Loader';

const IdentityInfo = ({ admin }: { admin?: boolean }) => {
  const { identity, userInfo } = useAppContext();

  return !userInfo.loading ? (
    <>
      <div className='relative'>
        <div className='h-56 w-56 bg-gray-200 rounded-full self-center mb-4'>
          <img
            src={userInfo.data.avatar.toString()}
            alt='avatar'
            className='w-full h-full rounded-full object-cover'
          />
        </div>
      </div>
      <h2 className='text-xl font-bold my-2'>@{identity}</h2>
      <div className='relative mb-4'>
        <p className='text-sm text-gray-600'>{userInfo.data.about}</p>
      </div>
    </>
  ) : (
    <Loader>Loading User Info...</Loader>
  );
};

export default IdentityInfo;
