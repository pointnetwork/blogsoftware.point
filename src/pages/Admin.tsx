import {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import _debounce from 'lodash/debounce';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import Loader from '../components/Loader';
import {PrimaryButton} from '../components/Button';
import {useAppContext} from '../context/AppContext';
import {Blog, BlogContractData} from '../@types/interfaces';
import {RoutesEnum} from '../@types/enums';
import PageLayout from '../layouts/PageLayout';
import SearchBar from '../components/SearchBar';

enum BlogFilterOptions {
  published = 'published',
  drafts = 'drafts',
  trash = 'trash',
}

const emptyMessages = {
    [BlogFilterOptions.published]: 'You have not published any blog posts yet.',
    [BlogFilterOptions.drafts]: `You have not created any drafts yet.`,
    [BlogFilterOptions.trash]: `Trash is empty.`
};

const FilterOption = ({
    children,
    filter,
    onClick
}: {
  children: string;
  filter: string;
  onClick: any;
}) => {
    const {theme} = useAppContext();

    return (
        <div
            id={children}
            className={`font-medium cursor-pointer mb-2 capitalize p-1 px-3 rounded-full ${
                filter === children
                    ? `text-white bg-${theme[1]}-500`
                    : 'opacity-50 hover:opacity-90'
            }`}
            onClick={onClick}
        >
            {children}
        </div>
    );
};

const Admin = () => {
    const navigate = useNavigate();
    const {blogs, getDeletedBlogs, isOwner, loading} = useAppContext();

    const [isLoading, setLoading] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [data, setData] = useState<(Blog & BlogContractData)[]>([]);
    const [filter, setFilter] = useState<keyof typeof BlogFilterOptions>(
    new URL(window.location.href).searchParams.get(
        'filter'
    ) as keyof typeof BlogFilterOptions
    );

    useEffect(() => {
        if (!loading && !isOwner) navigate(RoutesEnum.home, {replace: true});
    }, [isOwner, loading]);

    useEffect(() => {
        (async () => {
            if (!filter) setFilter(BlogFilterOptions.published);
            setLoading(true);
            setData(await handleDataChange(filter));
            setLoading(false);
            setSearchTerm('');
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter, blogs.data]);

    const handleDataChange = async (
        filter: string
    ): Promise<(Blog & BlogContractData)[]> => {
        switch (filter) {
            case BlogFilterOptions.published:
                return blogs.data.filter((d) => d.isPublished);
            case BlogFilterOptions.drafts:
                return blogs.data.filter((d) => !d.isPublished);
            case BlogFilterOptions.trash:
                return await getDeletedBlogs();
            default:
                return [];
        }
    };

    const handleFilterChange = (e: any) => {
        navigate(`${RoutesEnum.admin}?filter=${e.target.id}`);
        setFilter(e.target.id);
    };

    const debounceFn = useCallback(_debounce(handleDebounceFn, 500), [
        blogs,
        filter
    ]);

    async function handleDebounceFn(inputValue: string) {
        const _data = await handleDataChange(filter);
        setData(
            _data.filter(
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
                    <div className='flex-1 relative'>
                        <div className='flex items-center justify-between mr-5'>
                            <h2 className='text-3xl font-bold'>Your Blog Posts</h2>
                            <PrimaryButton onClick={() => navigate(RoutesEnum.create)}>
                Create New Blog Post
                            </PrimaryButton>
                        </div>
                        <div className='mt-4 mb-2 flex items-center text-sm'>
                            <FilterOption filter={filter} onClick={handleFilterChange}>
                                {BlogFilterOptions.published}
                            </FilterOption>
                            <FilterOption filter={filter} onClick={handleFilterChange}>
                                {BlogFilterOptions.drafts}
                            </FilterOption>
                            <FilterOption filter={filter} onClick={handleFilterChange}>
                                {BlogFilterOptions.trash}
                            </FilterOption>
                        </div>
                        <SearchBar value={searchTerm} onChange={handleChange} />
                        <div
                            className='overflow-y-scroll pr-6'
                            style={{height: window.screen.height - 360}}
                        >
                            {isLoading || blogs.loading ? (
                                <Loader>Loading Blog Posts...</Loader>
                            ) : data.length ? (
                                data.map((blog, i) => (
                                    <BlogPreviewItem
                                        deleted={filter === BlogFilterOptions.trash}
                                        data={blog}
                                        admin
                                        key={i}
                                    />
                                ))
                            ) : (
                                <div className='font-medium pt-2 opacity-70'>
                                    <p className='text-2xl'>
                                        {!searchTerm
                                            ? emptyMessages[filter]
                                            : `No blogs found for search term: "${searchTerm}"`}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='basis-72 flex flex-col overflow-y-scroll px-8 -mr-8'>
                        <h2 className='text-3xl font-bold mb-6'>Your Profile</h2>
                        <IdentityInfo admin />
                    </div>
                </main>
            </div>
        </PageLayout>
    );
};

export default Admin;
