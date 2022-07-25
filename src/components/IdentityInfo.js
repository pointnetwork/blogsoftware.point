import React from 'react';
import Avatar from 'boring-avatars';
import EditIcon from '@mui/icons-material/Edit';
import { useAppContext } from '../context/AppContext';

const EditButton = ({ admin }) =>
  admin ? (
    <div className='absolute top-0 -right-6 bg-white z-10 rounded-full border border-gray-500 w-6 h-6 flex items-center justify-center opacity-50 transition-all cursor-pointer hover:opacity-100'>
      <EditIcon titleAccess='Edit' sx={{ height: 16, width: 16 }} />
    </div>
  ) : null;

const IdentityInfo = ({ admin }) => {
  const { identity } = useAppContext();

  return (
    <>
      <div className='relative'>
        <div className='h-56 w-56 bg-gray-200 rounded-full self-center mb-4'>
          <Avatar
            size={224}
            name={identity}
            variant='marble'
            colors={['#92A1C6', '#146A7C', '#F0AB3D', '#C271B4', '#C20D90']}
          />
        </div>
        <EditButton admin={admin} />
      </div>
      <h2 className='text-xl font-bold my-2'>@{identity}</h2>
      <div className='relative mb-4'>
        <EditButton admin={admin} />
        <p className='text-sm text-gray-600'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iste officia
          cumque repellat debitis ab tempora maiores nemo fugiat sequi odit.
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Perferendis
          cum, minima labore dolores dolore necessitatibus at
        </p>
      </div>
    </>
  );
};

export default IdentityInfo;
