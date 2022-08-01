import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlogFactoryContract, RoutesEnum } from '../@types/enums';
import { PrimaryButton } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import PageLayout from '../layouts/PageLayout';

const InstallationSteps = () => {
  const steps = [
    {
      title: 'Click "Start Installation"',
      text: 'Clicking "Start Installation" will open the transaction window to host the BlogSoftware on your domain space',
    },
    {
      title: 'Confirm the Transaction',
      text: 'This will install the BlogSoftware on your domain space and create a Blog Smart Contract with your wallet address',
    },
    {
      title: 'Create your Profile',
      text: 'Write a few lines describing your blog, upload an image and start blogging!',
    },
  ];

  return (
    <>
      {steps.map((step, i) => (
        <div className='flex space-x-3 mt-6'>
          <p className='w-8 h-8 flex items-center justify-center rounded-full text-sm text-white bg-indigo-500 mt-1'>
            {i + 1}
          </p>
          <div>
            <p className='text-lg'>{step.title}</p>
            <p className='text-sm text-gray-600 mt-0.5'>{step.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

const Install = () => {
  const navigate = useNavigate();

  const { walletAddress } = useAppContext();

  const handleStartInstallation = async () => {
    await window.point.contract.send({
      contract: BlogFactoryContract.name,
      method: BlogFactoryContract.createBlog,
      params: [walletAddress],
    });
    navigate(RoutesEnum.profile);
  };

  return (
    <PageLayout>
      <header className='py-3 sticky top-0 bg-white shadow z-10'>
        <div className='mx-auto' style={{ maxWidth: '1000px' }}>
          {/* Logo will go here */}
          <span className='font-medium'>BlogSoftware</span>
        </div>
      </header>
      <main className='mt-8 mx-auto' style={{ maxWidth: '800px' }}>
        <h1 className='text-3xl font-bold pt-6'>
          Launch your own blog in 3 simple steps
        </h1>
        <InstallationSteps />
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
    </PageLayout>
  );
};

export default Install;
