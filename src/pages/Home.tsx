import {ChangeEvent, FunctionComponent, useContext, useState} from 'react';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import Loader from '../components/Loader';
import PageLayout from '../layouts/PageLayout';
import SearchBar from '../components/SearchBar';
import {PostsContext} from '../context/PostsContext';
import {UserContext} from '../context/UserContext';
import ErrorPlaceholder from '../components/ErrorPlaceholder';

const Home: FunctionComponent = () => {
    const {posts, postsLoading, postsError} = useContext(PostsContext);
    const {ownerIdentity} = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState<string>('');

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(event.target.value);
    }
    
    const displayData = posts
        .filter((post) => post.isPublished)
        .filter(
            (post) =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.tags.toLowerCase().includes(searchTerm.toLowerCase())
        );

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
                        {postsLoading ? (
                            <div className='mt-7'>
                                <Loader>Loading Blogs...</Loader>
                            </div>
                        ) : postsError ? (
                            <ErrorPlaceholder/>
                        ) : displayData.length ? (
                            displayData.map((post) => (
                                <BlogPreviewItem data={post} key={post.id} />
                            ))
                        ) : searchTerm ? (
                            <div className='font-medium pt-2 opacity-70'>
                                <p className='text-2xl'>
                                    {`No blogs found for search term: "${searchTerm}"`}
                                </p>
                            </div>
                        ) : (
                            <div>
                                <p className='text-5xl font-bold mt-10'>@{ownerIdentity}</p>
                                <p className='text-3xl font-medium opacity-50 mt-2'>
                                    has not created any blog posts yet.
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
