import {
    ChangeEvent,
    FunctionComponent,
    KeyboardEvent,
    useContext,
    useEffect,
    useMemo,
    useState
} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '../components/Header';
import CloseIcon from '@mui/icons-material/Close';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditIcon from '@mui/icons-material/Edit';
import {
    ErrorButton,
    OutlinedButton,
    PrimaryButton
} from '../components/Button';
import {RoutesEnum} from '../@types/enums';
import PageLayout from '../layouts/PageLayout';
import {UserContext} from '../context/UserContext';
import {ThemeContext} from '../context/ThemeContext';
import {PostsContext} from '../context/PostsContext';

const CreateOrEditPost: FunctionComponent<{ edit?: boolean }> = ({edit}) => {
    const {search} = useLocation();
    const query = useMemo(() => new URLSearchParams(search), [search]);
    const id = Number(query.get('id'));
    const navigate = useNavigate();

    const {isOwner, userLoading} = useContext(UserContext);
    const {theme} = useContext(ThemeContext);
    const {posts, postSaving, createOrEditPost} = useContext(PostsContext);
    const post = useMemo(() => edit ? posts.find(p => p.id === id) : null, [posts, id, edit]);

    const [cover, setCover] = useState<Blob | null>(post?.coverImage ?? null);
    const [title, setTitle] = useState<string>(post?.title ?? '');
    const [content, setContent] = useState<string>(post?.content ?? '');
    const [tags, setTags] = useState<string[]>(post?.tags.split(',').filter(tag => Boolean(tag)) ?? []);
    const [tagInput, setTagInput] = useState<string>('');

    useEffect(() => {
        if (!userLoading && !isOwner) {
            navigate(RoutesEnum.home, {replace: true});
        }
    }, [isOwner, userLoading]);

    useEffect(() => {
        // Customize buttons from editor toolbar
        document.documentElement.style.setProperty('--quill-button-color', theme[2]);
    }, []);

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.length) {
            setTags((prev) => [...prev, tagInput.toLowerCase()]);
            setTagInput('');
        }
    };

    const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value.toLowerCase());
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        setCover(e.target.files ? e.target.files[0] : null);
    };

    const handleSave = (publish: boolean) => {
        createOrEditPost({
            title,
            tags: tags.join(','),
            content,
            coverImage: cover,
            editId: edit ? id : null,
            publish
        });
    };

    return (
        <PageLayout>
            <Header />
            <main
                className='flex mx-auto pt-4 overflow-hidden'
                style={{maxWidth: '1000px', height: window.screen.height - 276}}
            >
                <div className='flex-1 pr-8 pl-1 mr-4 flex flex-col overflow-y-scroll'>
                    <h3 className='text-lg font-bold mb-2'>Title</h3>
                    <input
                        type='text'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className='p-1 rounded border border-gray-300 w-full bg-transparent'
                    />
                    <h3 className='text-lg font-bold mt-6 pb-2'>Content</h3>
                    <ReactQuill
                        className='h-full'
                        theme='snow'
                        value={content}
                        onChange={setContent}
                    />
                </div>
                <div className='basis-72 overflow-y-scroll px-2'>
                    <h3 className='text-lg font-bold mb-1'>Cover Image</h3>
                    <div className='relative'>
                        {cover ? (
                            <>
                                <div className='absolute -top-8 right-0 bg-white z-10 rounded-full border border-gray-500 w-6 h-6 flex items-center justify-center opacity-50 transition-all cursor-pointer hover:opacity-100'>
                                    <input
                                        type='file'
                                        accept='image/*'
                                        onChange={handleFileInput}
                                        className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
                                    />
                                    <EditIcon titleAccess='Edit' sx={{height: 16, width: 16}} />
                                </div>
                                <img
                                    className='w-full h-full object-cover rounded mr-3 border-2 border-gray-200'
                                    src={URL.createObjectURL(cover)}
                                    alt='cover for the blog'
                                />
                            </>
                        ) : (
                            <div
                                className={`relative w-full bg-${theme[2]} bg-opacity-10 rounded h-48 mr-3 border-2 border-${theme[2]} border-opacity-20 flex flex-col items-center justify-center`}
                            >
                                <ImageOutlinedIcon
                                    sx={{height: 56, width: 56}}
                                    className={`text-${theme[2]} text-opacity-40 -mt-2`}
                                />
                                <p className={`text-${theme[2]} text-opacity-40 mt-1`}>
                                    Select a Cover Image
                                </p>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={handleFileInput}
                                    className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
                                />
                            </div>
                        )}
                    </div>
                    <h3 className='text-lg font-bold mt-2 mb-1'>Add Tags</h3>
                    <div className='border bg-transparent flex items-center flex-wrap p-1'>
                        {tags.map((tag) => (
                            <div
                                className={`flex items-center p-1 pr-0 rounded-sm bg-${theme[2]} bg-opacity-10 border border-${theme[2]} hover:bg-opacity-30 m-1`}
                                style={{fontSize: 12}}
                                key={tag}
                            >
                                <p className='mr-1 capitalize'>{tag}</p>
                                <CloseIcon
                                    fontSize='small'
                                    className='cursor-pointer'
                                    onClick={() =>
                                        setTags((prev) => [...prev.filter((t) => t !== tag)])
                                    }
                                />
                            </div>
                        ))}
                        <input
                            value={tagInput}
                            type='text'
                            placeholder='Type here...'
                            className='w-full bg-transparent outline-none m-1 mt-2'
                            onKeyDown={handleTagKeyDown}
                            onChange={handleTagInput}
                        />
                    </div>
                </div>
            </main>
            <div className='mt-6 bg-transparent border-t border-gray-200 pt-3'>
                <div className='flex space-x-4 mx-auto' style={{maxWidth: '1000px'}}>
                    <PrimaryButton
                        disabled={postSaving || (!edit && (!title || !content))}
                        onClick={() => {handleSave(true);}}
                    >
                        {edit ? 'Update' : 'Publish'}
                    </PrimaryButton>
                    {!edit && (
                        <OutlinedButton
                            disabled={!title || postSaving}
                            onClick={() => {handleSave(false);}}
                        >
                            Save Draft
                        </OutlinedButton>
                    )}
                    <ErrorButton disabled={postSaving} onClick={() => navigate(-1)}>
                        Cancel
                    </ErrorButton>
                </div>
            </div>
        </PageLayout>
    );
};

export default CreateOrEditPost;
