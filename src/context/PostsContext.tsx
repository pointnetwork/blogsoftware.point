import {
    createContext,
    FunctionComponent,
    PropsWithChildren,
    useContext,
    useEffect,
    useState
} from 'react';
import {UserContext} from './UserContext';
import {BlogContract} from '../@types/enums';
import utils from './utils';
import dayjs from 'dayjs';
import {ToastContext} from './ToastContext';
import {useNavigate} from 'react-router-dom';
import {BlogPost} from '../@types/types';

type PostsContext = {
    postsLoading: boolean;
    postSaving: boolean;
    postsError: boolean;
    posts: BlogPost[];
    deletedPosts: BlogPost[];
    createOrEditPost: (params: Pick<BlogPost, 'title' | 'content' | 'coverImage' | 'tags'> & {
        publish: boolean; editId: number | null
    }) => void;
    deletePost: (id: number) => Promise<void>;
    publishPost: (id: number) => Promise<void>;
    unpublishPost: (id: number) => Promise<void>;
}

export const PostsContext = createContext<PostsContext>({} as unknown as PostsContext);

export const ProvidePostsContext: FunctionComponent<PropsWithChildren> = ({children}) => {
    const navigate = useNavigate();
    const {userLoading, isOwner, ownerAddress} = useContext(UserContext);
    const {setToast} = useContext(ToastContext);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postSaving, setPostSaving] = useState(false);
    const [postsError, setPostsError] = useState(false);
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [deletedPosts, setDeletedPosts] = useState<BlogPost[]>([]);

    const getPosts = async (deleted: boolean): Promise<BlogPost[]> => {
        const {data} = await window.point.contract.call({
            contract: BlogContract.name,
            method: deleted ? BlogContract.getDeletedBlogs : BlogContract.getAllBlogs
        });
        return Promise.all(data.map(async ([
            id,
            storageHash,
            isPublished,
            publishDate,
            previousStorageHashes,
            tags
        ]: [string, string, boolean, string, string[], string[]]) => {
            const storageData = await utils.getDataFromStorage(storageHash);
            return {
                ...storageData,
                coverImage: storageData.coverImage
                    ? await window.point.storage.getFile({id: storageData.coverImage})
                    : null,
                id: Number(id),
                storageHash,
                isPublished,
                publishDate,
                tags,
                previousStorageHashes
            };
        }));
    };

    const getData = async () => {
        if (userLoading) return;
        setPostsLoading(true);
        setPostsError(false);
        try {
            const results = await Promise.all([
                getPosts(false),
                ...(isOwner ? [getPosts(true)] : [])
            ]);
            setPosts(results[0].reverse());
            if (isOwner) {
                setDeletedPosts(results[1].reverse());
            }
        } catch (e) {
            console.error(e);
            setPostsError(true);
        }
        setPostsLoading(false);
    };
    useEffect(() => {
        getData();
    }, [userLoading, isOwner]);

    const createOrEditPost = async ({
        title,
        content,
        coverImage,
        tags,
        publish,
        editId
    }: Pick<BlogPost, 'title' | 'content' | 'coverImage' | 'tags'> & {
        publish: boolean; editId: number | null
    }) => {
        setPostSaving(true);
        try {
            const now = dayjs().format('MMM DD, YYYY');

            let coverImageHash = '';
            if (coverImage) {
                const coverImageFormData = new FormData();
                coverImageFormData.append('files', coverImage);
                const {data} = await window.point.storage.postFile(
                    coverImageFormData
                );
                coverImageHash = data;
            }

            const form = JSON.stringify({
                coverImage: coverImageHash,
                title,
                content,
                publisher: ownerAddress,
                createdDate: now
            });
            const file = new File([form], 'blog.json', {type: 'application/json'});

            const formData = new FormData();
            formData.append('files', file);
            const res = await window.point.storage.postFile(formData);
            // Save data to smart contract
            if (editId) {
                await window.point.contract.send({
                    contract: BlogContract.name,
                    method: BlogContract.editBlog,
                    params: [
                        editId,
                        res.data,
                        now,
                        tags
                    ]
                });
                setToast({
                    color: 'green-500',
                    message: 'Blog post updated successfully'
                });
                setPosts(prevState => prevState.map(post => post.id === editId ? (
                    {
                        ...post,
                        title,
                        content,
                        coverImage,
                        tags,
                        storageHash: res.data,
                        previousStorageHashes: [...post.previousStorageHashes, post.storageHash],
                        createdDate: now
                    }
                ) : post));
            } else {
                await window.point.contract.send({
                    contract: BlogContract.name,
                    method: BlogContract.addBlog,
                    params: [
                        res.data,
                        publish,
                        now,
                        tags
                    ]
                });
                setToast({
                    color: 'green-500',
                    message: 'Blog post added successfully'
                });
                setPosts(prevState => [
                    {
                        id: (prevState[0]?.id ?? 0) + 1,
                        title,
                        content,
                        coverImage,
                        tags,
                        isPublished: publish,
                        publisher: ownerAddress,
                        storageHash: res.data,
                        previousStorageHashes: [],
                        publishDate: now,
                        createdDate: now
                    },
                    ...prevState
                ]);
            }
            navigate('/');
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to save the blog post. Please try again'
            });
        }
        setPostSaving(false);
    };

    const deletePost = async (id: number) => {
        setPostSaving(true);
        try {
            const deletedPost = posts.find(post => post.id === id);
            if (!deletedPost) {
                throw new Error('Trying to delete non-existing post');
            }
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.deleteBlog,
                params: [id]
            });
            setToast({color: 'green-500', message: 'Blog post moved to trash'});
            setPosts(prevState => prevState.filter(post => post.id !== id));
            setDeletedPosts(prevState => [deletedPost, ...prevState]);
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to delete the blog post. Please try again'
            });
        }
        setPostSaving(false);
    };

    const publishPost = async (id: number) => {
        setPostSaving(true);
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.publish,
                params: [id]
            });
            setToast({
                color: 'green-500',
                message: 'Blog post published & moved to published successfully'
            });
            setPosts(prevState => prevState.map(post => post.id === id
                ? {...post, isPublished: true}
                : post));
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to publish the blog post. Please try again'
            });
        }
        setPostSaving(false);
    };

    const unpublishPost = async (id: number) => {
        setPostSaving(true);
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.unpublish,
                params: [id]
            });
            setToast({
                color: 'green-500',
                message: 'Blog post unpublished & moved to drafts successfully'
            });
            setPosts(prevState => prevState.map(post => post.id === id
                ? {...post, isPublished: false}
                : post));
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to unpublish the blog post. Please try again'
            });
        }
        setPostSaving(false);
    };

    return <PostsContext.Provider value={{
        postsLoading,
        postSaving,
        postsError,
        posts,
        deletedPosts,
        createOrEditPost,
        deletePost,
        publishPost,
        unpublishPost
    }}>
        {children}
    </PostsContext.Provider>;
};
