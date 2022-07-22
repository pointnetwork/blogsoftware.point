import React from 'react';
import { useLocation } from 'wouter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

const BlogPreviewItem = ({ admin }) => {
  const [location, setLocation] = useLocation();

  return (
    <div
      className={`flex p-3 items-center border border-white rounded my-3 ${
        admin ? 'mb-6' : ''
      } hover:shadow-lg border-gray-200 relative`}
    >
      {admin ? (
        <>
          <div
            style={{ fontSize: 10 }}
            className='-top-3 -right-2 rounded-full bg-green-100 text-green-600 text-sm px-3 border border-green-300 absolute z-10'
          >
            Published
          </div>
          <div className='bottom-2 right-2 absolute flex space-x-2'>
            <DoDisturbIcon
              fontSize='small'
              className='opacity-50 hover:opacity-100 text-orange-500 cursor-pointer'
              titleAccess='Unpublish'
            />
            <CheckCircleOutlineIcon
              fontSize='small'
              className='opacity-50 hover:opacity-100 text-green-600 cursor-pointer'
              titleAccess='Publish'
            />
            <EditIcon
              fontSize='small'
              className='opacity-50 hover:opacity-100 text-gray-500 cursor-pointer'
              titleAccess='Edit'
              onClick={() => setLocation('/create')}
            />
            <DeleteIcon
              fontSize='small'
              className='opacity-50 hover:opacity-100 text-red-500 cursor-pointer'
              titleAccess='Delete'
            />
          </div>
        </>
      ) : null}
      <div className='w-64 bg-slate-200 rounded h-28 mr-3'></div>
      <div>
        <h2
          className='font-bold text-lg cursor-pointer'
          onClick={() => setLocation('/blog')}
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, dolor.
        </h2>
        <p className='text-sm mb-2 text-gray-500'>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam
          molestias, quibusdam excepturi quos iure placeat facere odit dolor
          alias! Iusto...
        </p>
        <p className='text-sm'>12th July 2022</p>
      </div>
    </div>
  );
};

export default BlogPreviewItem;
