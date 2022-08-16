import React from 'react';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import Loader from '../components/Loader';
import {useAppContext} from '../context/AppContext';
import PageLayout from '../layouts/PageLayout';

const Home = () => {
    const {blogs, ownerIdentity} = useAppContext();

    return (
        <PageLayout>
            <div className='h-screen overflow-hidden'>
                <Header />
                <main
                    className='flex mt-4 mx-auto'
                    style={{maxWidth: '1000px', height: window.screen.height - 220}}
                >
                    <div className='flex-1 pr-6 border-r h-full overflow-y-scroll'>
                        {blogs.loading ? (
                            <div className='mt-7'>
                                <Loader>Loading Blogs...</Loader>
                            </div>
                        ) : blogs.data.filter((blog) => blog.isPublished).length ? (
                            blogs.data
                                .filter((blog) => blog.isPublished)
                                .map((blog, i) => <BlogPreviewItem data={blog} key={i} />)
                        ) : (
                            <div>
                                <p className='text-5xl font-bold mt-10'>@{ownerIdentity}</p>
                                <p className='text-3xl font-medium text-gray-500 mt-2'>
                  has not created any blogs yet.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className='basis-72 flex flex-col pl-8 mt-8 overflow-y-scroll pr-4'>
                        <IdentityInfo />
                    </div>
                </main>
            </div>
        </PageLayout>
    );
};

export default Home;
