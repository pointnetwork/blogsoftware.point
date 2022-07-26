import React, { useState } from 'react';
import { useLocation } from 'wouter';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { ErrorButton, OutlinedButton } from './Button';

const BlogPreviewItem = ({ admin, data }: { admin?: boolean; data: any }) => {
  const [, setLocation] = useLocation();

  const [requestDelete, setRequestDelete] = useState<boolean>(false);

  return (
    <div
      className={`flex p-3 border border-white rounded my-3 ${
        admin ? 'mb-6' : ''
      } hover:shadow-lg border-gray-200 relative`}
    >
      {/* DELETE MODAL: START */}
      {requestDelete ? (
        <div className='fixed z-50 top-0 left-0 h-screen w-screen'>
          <div className='relative h-full w-full'>
            <div className='absolute h-full w-full bg-black opacity-30'></div>
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded'>
              <h3 className='text-lg font-medium'>
                Are your sure you want to delete this blog
              </h3>
              <div className='flex justify-end space-x-4 mt-4'>
                <OutlinedButton onClick={() => setRequestDelete(false)}>
                  Cancel
                </OutlinedButton>
                <ErrorButton>Delete</ErrorButton>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {/* DELETE MODAL: END */}
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
              onClick={() => setRequestDelete(true)}
            />
          </div>
        </>
      ) : null}
      <div className='basis-48 bg-slate-200 h-32 mr-3 rounded overflow-hidden'>
        <img
          src={data?.coverImage}
          className='h-full w-full object-cover'
          alt='cover for blog'
        />
      </div>
      <div
        className='flex-1 flex flex-col cursor-pointer'
        onClick={() => setLocation(`/blog/${data.id}`)}
      >
        <h2 className='font-bold text-lg'>{data?.title}</h2>
        <p
          className='text-sm mb-2 text-gray-500 flex-1'
          // TODO: Safegaurd against XSS
          dangerouslySetInnerHTML={{
            __html: `<p>${data?.content.slice(0, 200)}...</p>`,
          }}
        ></p>
        <p className='text-sm'>{data?.createdDate}</p>
      </div>
    </div>
  );
};

export default BlogPreviewItem;
