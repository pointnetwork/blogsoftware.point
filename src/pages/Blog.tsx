import {FunctionComponent, useContext, useEffect, useMemo, useState} from 'react';
import Header from '../components/Header';
import {useLocation, useNavigate} from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import {OutlinedButton, PrimaryButton} from '../components/Button';
import utils from '../context/utils';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RecommendIcon from '@mui/icons-material/Recommend';
import {BlogPost, Comment} from '../@types/types';
import {BlogContract, RoutesEnum} from '../@types/enums';
import {PostsContext} from '../context/PostsContext';
import {ToastContext} from '../context/ToastContext';
import {UserContext} from '../context/UserContext';
import {ThemeContext} from '../context/ThemeContext';
import HeaderImage from '../components/HeaderImage';

const BlogPage: FunctionComponent<{deleted?: boolean}> = ({deleted}) => {
    const navigate = useNavigate();
    const {search} = useLocation();
    const query = useMemo(() => new URLSearchParams(search), [search]);
    const id = Number(query.get('id'));

    const {theme} = useContext(ThemeContext);
    const {visitorAddress, isOwner, visitorIdentity, userInfo} = useContext(UserContext);
    const {setToast} = useContext(ToastContext);
    const {posts, deletedPosts, postsError, postsLoading} = useContext(PostsContext);
    const post = useMemo(
        () => deleted ? deletedPosts.find(p => p.id === id) : posts.find(p => p.id === id),
        [posts, deletedPosts]
    );

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [displayedRevision, setDisplayedRevision] = useState(0);
    const [revisions, setRevisions] = useState<
        Pick<BlogPost, 'createdDate' | 'title' | 'coverImage' | 'content'>[]
    >([]);
    const displayedData = displayedRevision === 0 ? post! : revisions[displayedRevision - 1]!;

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [numLikes, setNumLikes] = useState<number>(0);

    const [editCommentId, setEditCommentId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState<string>('');
    const [comments, setComments] = useState<Comment[]>([]);

    const getRevisions = async () => {
        if (!post) return;
        const _revisions = await Promise.all(post.previousStorageHashes.map(async hash => {
            const storageData = await utils.getDataFromStorage(hash);
            return {
                coverImage: storageData.coverImage
                    ? await window.point.storage.getFile({id: storageData.coverImage})
                    : null,
                title: storageData.title,
                content: storageData.content,
                createdDate: storageData.createdDate
            };
        }));
        setRevisions(_revisions);
    };

    const getLikesForBlogPost = async () => {
        const {data}: { data: string[] } = await window.point.contract.call({
            contract: BlogContract.name,
            method: BlogContract.getLikesForBlogPost,
            params: [id]
        });
        setIsLiked(data.map((i) => i.toLowerCase()).includes(visitorAddress.toLowerCase()));
        setNumLikes(data.length);
    };

    const getCommentsForBlogPost = async () => {
        try {
            const {data}: { data: [string, string, string] } = await window.point.contract.call({
                contract: BlogContract.name,
                method: BlogContract.getCommentsForBlogPost,
                params: [id]
            });
            const _comments = await Promise.all(
                data.map(async ([_id, commentedBy, comment]) => {
                    const identity = await utils.getIdentityFromAddress(commentedBy);
                    return {id: Number(_id), commentedBy, comment, identity};
                })
            );
            setComments(_comments.reverse());
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to load comments for the blog post'
            });
        }
    };

    const getData = async () => {
        setLoading(true);
        try {
            await Promise.all([
                getLikesForBlogPost(),
                getCommentsForBlogPost(),
                ...(isOwner ? [getRevisions()] : [])
            ]);
        } catch (e) {
            console.error(e);
            setError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (post) {
            getData();
        }
    }, [post]);

    useEffect(() => {
        if (editCommentId) {
            setCommentText(comments.find((c) => c.id === editCommentId)!.comment);
        } else {
            setCommentText('');
        }
    }, [editCommentId]);

    const handleLike = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.likeBlogPost,
                params: [id]
            });
            setToast({color: 'green-500', message: 'Post liked successfully'});
            setIsLiked(true);
            setNumLikes(prevState => prevState + 1);
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to like the blog post. Please try again'
            });
        }
    };

    const handleUnlike = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.unlikeBlogPost,
                params: [id]
            });
            setToast({color: 'green-500', message: 'Post unliked successfully'});
            setIsLiked(false);
            setNumLikes(prevState => prevState - 1);
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to unlike the blog post. Please try again'
            });
        }
    };

    const handleAddComment = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.addCommentToBlogPost,
                params: [id, commentText]
            });
            setToast({color: 'green-500', message: 'Comment added successfully'});
            setCommentText('');
            setComments(prevState => [{
                id: (prevState[0]?.id ?? 0) + 1,
                comment: commentText,
                commentedBy: visitorAddress,
                identity: visitorIdentity
            }, ...prevState]);
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to add the comment. Please try again'
            });
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.deleteCommentForBlogPost,
                params: [id, commentId]
            });
            setToast({color: 'green-500', message: 'Comment deleted successfully'});
            setCommentText('');
            setComments(prevState => prevState.filter(c => c.id !== commentId));
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to delete the comment. Please try again'
            });
        }
    };

    const handleEditComment = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.editCommentForBlogPost,
                params: [id, editCommentId, commentText]
            });
            setToast({color: 'green-500', message: 'Comment updated successfully'});
            setEditCommentId(null);
            setComments(prevState => prevState.map(comment => comment.id === editCommentId
                ? {...comment, comment: commentText}
                : comment)
            );
        } catch (e) {
            console.error(e);
            setToast({
                color: 'red-500',
                message: 'Failed to update the comment. Please try again'
            });
        }
    };

    if (loading || postsLoading) return <PageLayout loading/>;
    if (error || postsError) return <PageLayout error/>;

    if (!post) {
        return (
            <div className='flex flex-col items-center mt-10'>
                <h1 className='text-3xl font-bold mb-4'>
                    This blog post does not exist.
                </h1>
                <PrimaryButton onClick={() => navigate(RoutesEnum.home)}>
                    Home
                </PrimaryButton>
            </div>
        );
    }

    return (
        <PageLayout>
            <Header><HeaderImage headerImage={userInfo.headerImage}/></Header>
            <main className='pb-4 pt-8 mx-auto' style={{maxWidth: '720px'}}>
                <div
                    className='flex items-center opacity-40 cursor-pointer hover:opacity-90 transition-all -ml-4'
                    onClick={() => navigate(-1)}
                >
                    <ArrowBackIosNewIcon />
                    <span>Back</span>
                </div>

                {isOwner && post.previousStorageHashes && (
                    <div className='flex items-center my-4 justify-end'>
                        <p className={`text-${theme[2]} text-opacity-50 mr-4`}>
                            Iterations:
                        </p>
                        <p
                            className={`py-1 px-3 text-sm ${
                                displayedRevision === 0
                                    ? `text-white bg-${theme[1]}-500`
                                    : 'opacity-50 hover:opacity-100'
                            } cursor-pointer rounded mr-2`}
                            onClick={() => {setDisplayedRevision(0);}}
                        >
                            {post.previousStorageHashes.length + 1}
                        </p>
                        {post.previousStorageHashes.map((hash, i) => (
                            <p
                                className={`py-1 px-3 text-sm ${
                                    displayedRevision === i + 1
                                        ? `text-white bg-${theme[1]}-500`
                                        : 'opacity-50 hover:opacity-100'
                                } cursor-pointer rounded mr-2`}
                                key={hash}
                                onClick={() => setDisplayedRevision(i + 1)}
                            >
                                {post.previousStorageHashes.length - i}
                            </p>
                        ))}
                    </div>
                )}

                <h1 className='text-3xl font-bold mt-4'>{post.title}</h1>
                <p className='mt-1 text-sm opacity-70 mb-6'>
                    {post.publishDate}
                </p>
                {displayedData.coverImage ? (
                    <div className='bg-gray-200 mb-6'>
                        <img
                            src={URL.createObjectURL(displayedData.coverImage)}
                            alt='cover of the blog'
                            className='w-full h-full rounded'
                        />
                    </div>
                ) : null}
                <div
                    // TODO: Safegaurd against XSS
                    dangerouslySetInnerHTML={{__html: `${displayedData.content}`}}
                ></div>

                {!deleted && (
                    <div
                        className={`fixed rounded-full bottom-2 border left-1/2 -translate-x-1/2 p-2 pr-4 shadow-xl z-30 flex items-center cursor-pointer transition-all ${
                            isLiked
                                ? `bg-${theme[1]}-500 text-white hover:bg-${theme[1]}-700`
                                : 'bg-gray-100 hover:bg-white text-black'
                        }`}
                        onClick={isLiked ? handleUnlike : handleLike}
                        title={isLiked ? 'Unlike' : 'Like'}
                    >
                        <RecommendIcon />
                        <p className='ml-1'>
                            {numLikes} Like{String(numLikes).slice(-1) === '1' ? '' : 's'}
                        </p>
                    </div>
                )}

                <div className='my-4 flex items-center space-x-1'>
                    {post.tags.split(',').filter(tag => Boolean(tag)).length > 0 ? (
                        <>
                            <h6 className='text-lg font-bold mr-1'>Tags:</h6>
                            {post.tags.split(',').filter(tag => Boolean(tag)).map((tag) => (
                                <p
                                    key={tag}
                                    className={`p-1 px-2.5 rounded-full bg-${theme[2]} bg-opacity-10 text-sm`}
                                >
                                    {tag}
                                </p>
                            ))}
                        </>
                    ) : <h6 className='text-lg font-bold mr-1'>No Tags</h6> }

                </div>

                <div className='mt-8 mb-12 relative'>
                    <div className={`sticky bg-${theme[0]} top-14 py-3`}>
                        <h6 className='text-lg font-bold'>
                            {deleted ? 'Comments' : 'Leave a comment'}
                        </h6>
                        {!deleted && (
                            <>
                                <textarea
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    className='w-full p-1 rounded border border-gray-400 my-2 bg-transparent'
                                />
                                {editCommentId ? (
                                    <div className='flex items-center space-x-2'>
                                        <PrimaryButton onClick={handleEditComment}>
                                            Update Comment
                                        </PrimaryButton>
                                        <OutlinedButton onClick={() => setEditCommentId(null)}>
                                            Cancel
                                        </OutlinedButton>
                                    </div>
                                ) : (
                                    <PrimaryButton onClick={handleAddComment}>
                                        Add Comment
                                    </PrimaryButton>
                                )}
                            </>
                        )}
                    </div>
                    {comments.length ? (
                        comments.map(({id: commentId, commentedBy, comment, identity}) => (
                            <div
                                className={`py-3 mb-3 border-b border-${
                                    theme[2]
                                } border-opacity-30 ${
                                    editCommentId === commentId ? `bg-${theme[2]} bg-opacity-10` : ''
                                }`}
                                key={commentId}
                            >
                                <div className='flex justify-between'>
                                    <p className='font-bold'>{identity}</p>
                                    {commentedBy.toLowerCase() === visitorAddress.toLowerCase() && (
                                        <div className='flex items-center space-x-2'>
                                            <EditOutlinedIcon
                                                onClick={() => setEditCommentId(commentId)}
                                                className={`text-${theme[2]} opacity-50 hover:opacity-90 cursor-pointer transition-all`}
                                                sx={{width: 18, height: 18}}
                                            />
                                            <DeleteOutlineOutlinedIcon
                                                onClick={() => handleDeleteComment(commentId)}
                                                className='text-red-400 hover:text-red-500 cursor-pointer transition-all'
                                                sx={{width: 18, height: 18}}
                                            />
                                        </div>
                                    )}
                                </div>
                                <p className='text-sm'>{comment}</p>
                            </div>
                        ))
                    ) : (
                        <p className='mt-1'>No comments yet.</p>
                    )}
                </div>
            </main>
        </PageLayout>
    );
};

export default BlogPage;
