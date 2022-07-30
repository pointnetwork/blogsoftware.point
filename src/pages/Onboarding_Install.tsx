import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogFactoryContract, RoutesEnum } from '../@types/enums';
import { PrimaryButton } from '../components/Button';
import { useAppContext } from '../context/AppContext';

const OnboardingInstall = () => {
  const navigate = useNavigate();

  const { walletAddress } = useAppContext();

  const handleStartInstallation = async () => {
    await window.point.contract.send({
      contract: BlogFactoryContract.name,
      method: BlogFactoryContract.createBlog,
      params: [walletAddress],
    });
    navigate(RoutesEnum.onboarding_profile);
  };

  return (
    <>
      <header className='py-3 sticky top-0 bg-white shadow z-10'>
        <div className='mx-auto' style={{ maxWidth: '1000px' }}>
          {/* Logo will go here */}
          <span className='font-medium'>BlogSoftware</span>
        </div>
      </header>
      <main className='mt-10 mx-auto' style={{ maxWidth: '800px' }}>
        <h1 className='text-3xl font-bold pt-6'>
          Launch your own blog in 3 simple steps
        </h1>
        <div className='flex space-x-3 mt-4'>
          <p className='w-8 h-8 flex items-center justify-center rounded-full text-white bg-indigo-500 mt-1'>
            1
          </p>
          <div>
            <p className='text-lg'>Click "Start Installation"</p>
            <p className='text-sm text-gray-600 mt-0.5'>
              Clicking "Install" will open the transaction window to host the
              BlogSoftware on your domain space
            </p>
          </div>
        </div>
        <div className='flex space-x-3 mt-4'>
          <p className='w-8 h-8 flex items-center justify-center rounded-full text-white bg-indigo-500 mt-1'>
            2
          </p>
          <div>
            <p className='text-lg'>Confirm the Transaction</p>
            <p className='text-sm text-gray-600 mt-0.5'>
              This will install the BlogSoftware on your domain space and create
              a Blog Smart Contract with your wallet address
            </p>
          </div>
        </div>
        <div className='flex space-x-3 mt-4'>
          <p className='w-8 h-8 flex items-center justify-center rounded-full text-white bg-indigo-500 mt-1'>
            3
          </p>
          <div>
            <p className='text-lg'>Create your Profile</p>
            <p className='text-sm text-gray-600 mt-0.5'>
              Write a few lines describing your blog, upload an image and start
              blogging!
            </p>
          </div>
        </div>
        <div className='mt-10'>
          <PrimaryButton onClick={handleStartInstallation}>
            Start Installation
          </PrimaryButton>
          <p className='mt-10 text-sm text-gray-700'>
            By clicking "Start Installation", you agree to the{' '}
            <span className='text-indigo-500 hover:text-indigo-800 underline cursor-pointer'>
              terms of use
            </span>
          </p>
        </div>
      </main>
    </>
  );
};

export default OnboardingInstall;
