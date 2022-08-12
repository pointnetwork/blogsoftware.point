import React, {useEffect, useState} from 'react';
import {BlogFactoryContract, RoutesEnum} from '../@types/enums';
import {PrimaryButton} from '../components/Button';
import {useAppContext} from '../context/AppContext';
import utils from '../context/utils';
import PageLayout from '../layouts/PageLayout';

const InstallationSteps = () => {
    const steps = [
        {
            title: 'Click "Start Installation"',
            text: 'Clicking "Start Installation" will open the transaction window to host the BlogSoftware on your domain space'
        },
        {
            title: 'Confirm the Transaction',
            text: 'This will install the BlogSoftware on your domain space and create a Blog Smart Contract with your wallet address'
        },
        {
            title: 'Create your Profile',
            text: 'Write a few lines describing your blog, upload an image and start blogging!'
        }
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
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [visitorIdentity, setVisitorIdentity] = useState<string>('');

    const {visitorAddress, isBlogCreated} = useAppContext();

    useEffect(() => {
        (async () => {
            setVisitorIdentity(await utils.getIdentityFromAddress(visitorAddress));
        })();
    }, [visitorAddress]);

    const handleStartInstallation = async () => {
        setLoading(true);
        setMessage(
            'Deploying the Blog Smart Contract for you! Please confirm the transaction'
        );
        // Create the blog contract for the user in the factory
        await window.point.contract.send({
            contract: BlogFactoryContract.name,
            method: BlogFactoryContract.createBlog,
            params: [visitorAddress]
        });
        // TODO: Edit the IKV for the user
        setMessage('Setting your IKV to setup hosting on your domain');
        const url = `https://${visitorIdentity}.point${RoutesEnum.profile}`;
        setTimeout(async () => {
            setMessage(
                `Now redirecting you to '${url}'. Please setup your profile there.`
            );
            setTimeout(() => {
                window.location.replace(url);
            }, 5000);
        }, 3000);
    };

    return (
        <PageLayout>
            {message ? (
                <div className='fixed top-7 left-1/2 -translate-x-1/2 p-2 px-4 rounded bg-indigo-100 border border-indigo-500 text-indigo-500 z-50'>
                    {message}
                </div>
            ) : null}
            <header className='py-3 sticky top-0 bg-white shadow z-10'>
                <div className='mx-auto' style={{maxWidth: '1000px'}}>
                    {/* Logo will go here */}
                    <span className='font-medium'>BlogSoftware</span>
                </div>
            </header>
            <main className='mt-8 mx-auto' style={{maxWidth: '800px'}}>
                {isBlogCreated ? (
                    <div className='flex flex-col items-center mt-20 text-lg'>
                        <h1 className='text-5xl font-bold py-6'>
              Your blog is already created.
                        </h1>
                        <p>
              Please visit{' '}
                            <a
                                className='text-indigo-500 hover:text-indigo-700 font-semibold'
                                href={`https://${visitorIdentity}.point/`}
                            >
                https://{visitorIdentity}.point/
                            </a>{' '}
              to view your blog.
                        </p>
                        <p className='mt-2 text-xl font-bold'>OR</p>
                        <p className='mt-2'>
              Visit{' '}
                            <a
                                className='text-indigo-500 hover:text-indigo-700 font-semibold'
                                href={`https://${visitorIdentity}.point/admin`}
                            >
                https://{visitorIdentity}.point/admin
                            </a>{' '}
              to manage your blog.
                        </p>
                    </div>
                ) : (
                    <>
                        <h1 className='text-3xl font-bold pt-6'>
              Launch your own blog in 3 simple steps
                        </h1>
                        <InstallationSteps />
                        <div className='mt-10'>
                            <PrimaryButton
                                disabled={loading}
                                onClick={handleStartInstallation}
                            >
                                {loading ? 'Installing' : 'Start Installation'}
                            </PrimaryButton>
                            <p className='mt-10 text-sm text-gray-700'>
                By clicking "Start Installation", you agree to the{' '}
                                <span className='text-indigo-500 hover:text-indigo-800 underline cursor-pointer'>
                  terms of use
                                </span>
                            </p>
                        </div>
                    </>
                )}
            </main>
        </PageLayout>
    );
};

export default Install;
