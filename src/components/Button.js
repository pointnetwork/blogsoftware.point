import React from 'react';

const PrimaryButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='p-2 text-sm bg-indigo-500 text-white px-4 rounded hover:bg-indigo-700 active:bg-indigo-900 transition-all'
    >
      {children}
    </button>
  );
};

const OutlinedButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='p-2 text-sm bg-white border border-indigo-500  text-indigo-500 px-4 rounded hover:text-indigo-700 active:text-indigo-900 hover:border-indigo-700 active:border-indigo-900 transition-all'
    >
      {children}
    </button>
  );
};

const ErrorButton = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className='p-2 text-sm bg-red-500 text-white px-4 rounded hover:bg-red-700 active:bg-red-900 transition-all'
    >
      {children}
    </button>
  );
};

export { PrimaryButton, ErrorButton, OutlinedButton };
