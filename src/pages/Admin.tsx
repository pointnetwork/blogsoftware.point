import {
    ChangeEvent,
    FunctionComponent,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import Loader from '../components/Loader';
import {PrimaryButton} from '../components/Button';
import {RoutesEnum} from '../@types/enums';
import PageLayout from '../layouts/PageLayout';
import SearchBar from '../components/SearchBar';
import {ThemeContext} from '../context/ThemeContext';
import {UserContext} from '../context/UserContext';
import {PostsContext} from '../context/PostsContext';

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
    onClick: (value: string) => void
}) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div
            className={`font-medium cursor-pointer mb-2 capitalize p-1 px-3 rounded-full ${
                filter === children
                    ? `text-white bg-${theme[1]}-500`
                    : 'opacity-50 hover:opacity-90'
            }`}
            onClick={() => {onClick(children);}}
        >
            {children}
        </div>
    );
};

const Admin: FunctionComponent = () => {
    const navigate = useNavigate();
    const {isOwner, userLoading} = useContext(UserContext);
    const {posts, deletedPosts, postsLoading} = useContext(PostsContext);
    const [searchTerm, setSearchTerm] = useState<string>('');

    const {search} = useLocation();
    const query = useMemo(() => new URLSearchParams(search), [search]);
    const filter = query.get('filter') as keyof typeof BlogFilterOptions ?? BlogFilterOptions.published;

    const displayedPosts = useMemo(() => {
        const unfilteredPosts = filter === BlogFilterOptions.trash ? deletedPosts : posts;
        const filteredPosts = unfilteredPosts
            .filter(p => filter === BlogFilterOptions.published
                ? p.isPublished
                : filter === BlogFilterOptions.drafts
                    ? !p.isPublished
                    : true);
        return searchTerm ? filteredPosts.filter(
            (p) =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.tags.toLowerCase().includes(searchTerm.toLowerCase())
        ) : filteredPosts;
    }, [posts, deletedPosts, filter, searchTerm]);

    useEffect(() => {
        if (!userLoading && !isOwner) {
            navigate(RoutesEnum.home, {replace: true});
        }
    }, [isOwner, userLoading]);

    const handleFilterChange = (value: string) => {
        navigate(`${RoutesEnum.admin}?filter=${value}`);
    };

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        setSearchTerm(event.target.value);
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
                            {postsLoading ? (
                                <Loader>Loading Blog Posts...</Loader>
                            ) : displayedPosts.length ? (
                                displayedPosts.map((post) => (
                                    <BlogPreviewItem
                                        deleted={filter === BlogFilterOptions.trash}
                                        data={post}
                                        admin
                                        key={post.id}
                                    />
                                ))
                            ) : (
                                <div className='font-medium pt-2 opacity-70'>
                                    <p className='text-2xl'>
                                        {searchTerm
                                            ? `No blogs found for search term: "${searchTerm}"`
                                            : emptyMessages[filter]}
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
