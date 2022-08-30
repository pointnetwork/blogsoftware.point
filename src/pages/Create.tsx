import dayjs from 'dayjs';
import {
    ChangeEvent,
    FunctionComponent,
    KeyboardEvent,
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
import {useAppContext} from '../context/AppContext';
import {Blog} from '../@types/interfaces';
import {BlogContract, RoutesEnum} from '../@types/enums';
import PageLayout from '../layouts/PageLayout';
import {AddBlogContractParams, EditBlogContractParams} from '../@types/types';

const Create: FunctionComponent<{ edit?: boolean }> = ({edit}) => {
    const {search} = useLocation();
    const query = useMemo(() => new URLSearchParams(search), [search]);
    const navigate = useNavigate();

    const {
        ownerAddress,
        blogs,
        getAllBlogs,
        isOwner,
        loading,
        theme,
        setToast
    } = useAppContext();

    const [editId, setEditId] = useState<number | undefined>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [cover, setCover] = useState<Blob | null>(null);
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>('');

    useEffect(() => {
        if (!loading && !isOwner) {
            navigate(RoutesEnum.home, {replace: true});
        }
    }, [isOwner, loading]);

    const loadBlog = async () => {
        if (edit && !blogs.loading) {
            const id = query.get('id');
            if (id) {
                const reqBlog = blogs.data.find((blog) => blog.storageHash === id);
                if (reqBlog) {
                    setEditId(reqBlog.id);
                    setTitle(reqBlog.title);
                    setContent(reqBlog.content);
                    if (reqBlog.coverImage) {
                        const blob = await window.point.storage.getFile({id: reqBlog.coverImage});
                        setCover(blob);
                    }
                }
            }
        }
    };

    useEffect(() => {
        loadBlog();
    }, [blogs, edit]);

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagInput.length) {
            setTags((prev) => [...prev, tagInput.toLowerCase()]);
            setTagInput('');
        }
    // if (e.key === 'Backspace' && !tagInput.length) {
    //   setTags((prev) => {
    //     prev.pop();
    //     return [...prev];
    //   });
    // }
    };

    const handleTagInput = (e: ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value.toLowerCase());
    };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        setCover(e.target.files ? e.target.files[0] : null);
    };

    const handleSave = async (isPublished: boolean) => {
        try {
            setLoading(true);
            const now = dayjs().format('MMM DD, YYYY');

            let coverImage = '';
            if (cover) {
                const coverImageFormData = new FormData();
                coverImageFormData.append('files', cover);
                const {data} = await window.point.storage.postFile(
                    coverImageFormData
                );
                coverImage = data;
            }

            const form = JSON.stringify({
                coverImage,
                title,
                content,
                publisher: ownerAddress,
                createdDate: now
            } as Blog);
            const file = new File([form], 'blog.json', {type: 'application/json'});

            const formData = new FormData();
            formData.append('files', file);
            // Upload the File to arweave
            const res = await window.point.storage.postFile(formData);
            setLoading(false);
            // Save data to smart contract
            if (edit) {
                await window.point.contract.send({
                    contract: BlogContract.name,
                    method: BlogContract.editBlog,
                    params: [
                        editId,
                        res.data,
                        now,
                        tags.join(',')
                    ] as EditBlogContractParams
                });
                setToast({
                    color: 'green-500',
                    message: 'Blog post updated successfully'
                });
            } else {
                await window.point.contract.send({
                    contract: BlogContract.name,
                    method: BlogContract.addBlog,
                    params: [
                        res.data,
                        isPublished,
                        now,
                        tags.join(',')
                    ] as AddBlogContractParams
                });
                setToast({
                    color: 'green-500',
                    message: 'Blog post added successfully'
                });
            }
            getAllBlogs();
            navigate('/');
        } catch (error) {
            setLoading(false);
            setToast({
                color: 'red-500',
                message: 'Failed to save the blog post. Please try again'
            });
        }
    };

    const handlePublish = () => handleSave(true);
    const handleSaveDraft = () => handleSave(false);

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
                        disabled={isLoading || (!edit && (!title || !content))}
                        onClick={handlePublish}
                    >
                        {edit ? 'Update' : 'Publish'}
                    </PrimaryButton>
                    {!edit ? (
                        <OutlinedButton
                            disabled={!title || isLoading}
                            onClick={handleSaveDraft}
                        >
              Save Draft
                        </OutlinedButton>
                    ) : null}
                    <ErrorButton disabled={isLoading} onClick={() => navigate(-1)}>
            Cancel
                    </ErrorButton>
                </div>
            </div>
        </PageLayout>
    );
};

export default Create;
