import React from 'react';
import { useAppContext } from '../context/AppContext';
import Loader from './Loader';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { RoutesEnum } from '../@types/enums';

const IdentityInfo = ({ admin }: { admin?: boolean }) => {
  const navigate = useNavigate();
  const { identity, userInfo } = useAppContext();

  return !userInfo.loading ? (
    <>
      {admin ? (
        <div
          className='flex items-center text-sm opacity-50 hover:opacity-95 underline -mt-4 mb-3 cursor-pointer'
          onClick={() => navigate(RoutesEnum.edit_profile)}
        >
          <p className='mx-1'>Edit Profile</p>
          <EditIcon fontSize='small' />
        </div>
      ) : null}
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
