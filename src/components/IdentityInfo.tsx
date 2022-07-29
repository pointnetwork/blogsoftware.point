import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { useAppContext } from '../context/AppContext';
import Loader from './Loader';

const EditButton = ({ admin }: { admin?: boolean }) =>
  admin ? (
    <div className='absolute top-0 -right-6 bg-white z-10 rounded-full border border-gray-500 w-6 h-6 flex items-center justify-center opacity-50 transition-all cursor-pointer hover:opacity-100'>
      <EditIcon titleAccess='Edit' sx={{ height: 16, width: 16 }} />
    </div>
  ) : null;

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
          <EditButton admin={admin} />
        </div>
      </div>
      <h2 className='text-xl font-bold my-2'>@{identity}</h2>
      <div className='relative mb-4'>
        <EditButton admin={admin} />
        <p className='text-sm text-gray-600'>{userInfo.data.about}</p>
      </div>
    </>
  ) : (
    <Loader>Loading User Info...</Loader>
  );
};

export default IdentityInfo;
