import React from 'react';
import { useLocation } from 'wouter';
import { PrimaryButton } from './Button';

const Header = () => {
  const [location, setLocation] = useLocation();

  return (
    <header className='py-3 sticky top-0 bg-white shadow z-10'>
      <div
        className='mx-auto flex items-center justify-between'
        style={{ maxWidth: '1000px' }}
      >
        <div className='cursor-pointer' onClick={() => setLocation('/')}>
          {/* Logo will go here */}
          <span className='font-medium'>BlogSoftware</span>
        </div>
        <PrimaryButton onClick={() => setLocation('/admin')}>
          Manage Your Blog
        </PrimaryButton>
      </div>
    </header>
  );
};

export default Header;
