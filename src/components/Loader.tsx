import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';

const Loader = ({ children }: { children: string }) => {
  return (
    <div className='flex items-center'>
      <RefreshIcon className='animate-spin text-indigo-500' />
      <p className='ml-1 font-medium'>{children}</p>
    </div>
  );
};

export default Loader;
