import {useCallback, useEffect, useState} from 'react';
import _debounce from 'lodash/debounce';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import Loader from '../components/Loader';
import PageLayout from '../layouts/PageLayout';
import {useAppContext} from '../context/AppContext';
import {Blog, BlogContractData} from '../@types/interfaces';
import SearchBar from '../components/SearchBar';

const Home = () => {
    const {blogs, ownerIdentity} = useAppContext();

    const [displayData, setDisplayData] = useState<(Blog & BlogContractData)[]>(
        []
    );
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        setDisplayData(blogs.data.filter((blog) => blog.isPublished));
    }, [blogs]);

    const debounceFn = useCallback(_debounce(handleDebounceFn, 500), [blogs]);

    function handleDebounceFn(inputValue: string) {
        setDisplayData(
            blogs.data
                .filter((blog) => blog.isPublished)
                .filter(
                    (blog) =>
                        blog.title.toLowerCase().includes(inputValue.toLowerCase()) ||
            blog.tags.toLowerCase().includes(inputValue.toLowerCase())
                )
        );
    }

    function handleChange(event: any) {
        setSearchTerm(event.target.value);
        debounceFn(event.target.value);
    }

    return (
        <PageLayout>
            <div className='h-screen overflow-hidden'>
                <Header />
                <main
                    className='flex mt-4 mx-auto'
                    style={{maxWidth: '1000px', height: window.screen.height - 220}}
                >
                    <div className='flex-1 pr-6 h-full overflow-y-scroll relative'>
                        <SearchBar value={searchTerm} onChange={handleChange} />
                        {blogs.loading ? (
                            <div className='mt-7'>
                                <Loader>Loading Blogs...</Loader>
                            </div>
                        ) : displayData.length ? (
                            displayData.map((blog, i) => (
                                <BlogPreviewItem data={blog} key={i} />
                            ))
                        ) : !searchTerm ? (
                            <div>
                                <p className='text-5xl font-bold mt-10'>@{ownerIdentity}</p>
                                <p className='text-3xl font-medium opacity-50 mt-2'>
                  has not created any blog posts yet.
                                </p>
                            </div>
                        ) : (
                            <div className='font-medium pt-2 opacity-70'>
                                <p className='text-2xl'>
                                    {`No blogs found for search term: "${searchTerm}"`}
                                </p>
                            </div>
                        )}
                    </div>
                    <div className='basis-72 flex flex-col pl-12 mt-8 overflow-y-scroll pr-4'>
                        <IdentityInfo />
                    </div>
                </main>
            </div>
        </PageLayout>
    );
};

export default Home;
