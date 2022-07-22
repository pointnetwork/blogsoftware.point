import { useState } from 'react';
import Header from '../components/Header';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditIcon from '@mui/icons-material/Edit';
import {
  ErrorButton,
  OutlinedButton,
  PrimaryButton,
} from '../components/Button';

const Create = () => {
  const [value, setValue] = useState('');

  return (
    <>
      <Header />
      <main
        className='flex mx-auto pt-4 overflow-hidden'
        style={{ maxWidth: '1000px', height: window.screen.height - 276 }}
      >
        <div className='flex-1 pr-8 pl-1 mr-4 flex flex-col overflow-y-scroll'>
          <h3 className='text-lg font-bold mb-2'>Title</h3>
          <input
            type='text'
            className='p-1 rounded border border-gray-300 w-full'
          />
          <h3 className='text-lg font-bold mt-6 mb-2'>Content</h3>
          <ReactQuill
            className='h-full'
            theme='snow'
            value={value}
            onChange={setValue}
          />
        </div>
        <div className='basis-72'>
          <h3 className='text-lg font-bold mb-2'>Cover Image</h3>
          <div className='relative'>
            <div className='absolute -top-8 right-0 bg-white z-10 rounded-full border border-gray-500 w-6 h-6 flex items-center justify-center opacity-50 transition-all cursor-pointer hover:opacity-100'>
              <EditIcon titleAccess='Edit' sx={{ height: 16, width: 16 }} />
            </div>
            <div className='w-full bg-slate-200 rounded h-48 mr-3'></div>
          </div>
        </div>
      </main>
      <div className='mt-6 bg-white border-t border-gray-200 pt-3'>
        <div className='flex space-x-4 mx-auto' style={{ maxWidth: '1000px' }}>
          <PrimaryButton>Publish</PrimaryButton>
          <OutlinedButton>Save Draft</OutlinedButton>
          <ErrorButton>Cancel</ErrorButton>
        </div>
      </div>
    </>
  );
};

export default Create;
