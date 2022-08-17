import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import PageLayout from '../layouts/PageLayout';
import { PrimaryButton } from '../components/Button';
import utils from '../context/utils';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import RecommendIcon from '@mui/icons-material/Recommend';
import { Comment } from '../@types/types';
import { BlogContract } from '../@types/enums';
import { Blog, BlogContractData } from '../@types/interfaces';

const BlogPage = () => {
  const { blogs, getDataFromStorage, visitorAddress } = useAppContext();

  const [id, setId] = useState<string>('');
  const [original, setOriginal] = useState<
    (Blog & BlogContractData) | undefined
  >();
  const [selectedHash, setSelectedHash] = useState<string>('');
  const [displayData, setDisplayData] = useState<
    (Blog & BlogContractData) | undefined
  >();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [numLikes, setNumLikes] = useState<number>(0);
  const [commentText, setCommentText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      setId(window.location.search.slice(4));
      if (!blogs.loading) {
        const requiredBlog = blogs.data.find((blog) => blog.storageHash === id);
        setOriginal(requiredBlog);
        setDisplayData(requiredBlog);
        setSelectedHash(id!);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, blogs]);

  const getLikesForBlogPost = async () => {
    const { data }: { data: string[] } = await window.point.contract.call({
      contract: BlogContract.name,
      method: BlogContract.getLikesForBlogPost,
      params: [original?.id],
    });
    if (data.map((i) => i.toLowerCase()).includes(visitorAddress.toLowerCase()))
      setIsLiked(true);
    else setIsLiked(false);
    setNumLikes(data.length);
  };

  const getCommentsForBlogPost = async () => {
    const { data }: { data: Comment[] } = await window.point.contract.call({
      contract: BlogContract.name,
      method: BlogContract.getCommentsForBlogPost,
      params: [original?.id],
    });
    const _comments = await Promise.all(
      data.map(async ([id, commentedBy, comment]) => {
        const identity = await utils.getIdentityFromAddress(commentedBy);
        return [id, identity, comment] as Comment;
      })
    );
    setComments(_comments);
  };

  useEffect(() => {
    if (original) {
      getLikesForBlogPost();
      getCommentsForBlogPost();
    }
  }, [original]);

  const handleIterationSelect = async (hash: string) => {
    const requiredBlog = await getDataFromStorage(hash);
    setDisplayData(requiredBlog);
    setSelectedHash(hash);
  };

  const handleSelectLatest = () => {
    setDisplayData(original);
    setSelectedHash(id!);
  };

  const handleLike = async () => {
    await window.point.contract.send({
      contract: BlogContract.name,
      method: BlogContract.likeBlogPost,
      params: [original?.id],
    });
    getLikesForBlogPost();
  };

  const handleUnlike = async () => {
    await window.point.contract.send({
      contract: BlogContract.name,
      method: BlogContract.unlikeBlogPost,
      params: [original?.id],
    });
    getLikesForBlogPost();
  };

  const handleAddComment = async () => {
    await window.point.contract.send({
      contract: BlogContract.name,
      method: BlogContract.addCommentToBlogPost,
      params: [original?.id, commentText],
    });
    setCommentText('');
    getCommentsForBlogPost();
  };

  return (
    <PageLayout>
      <Header />
      <main className='pb-4 pt-8 mx-auto' style={{ maxWidth: '720px' }}>
        <div
          className='flex items-center opacity-40 cursor-pointer hover:opacity-90 transition-all -ml-4'
          onClick={() => navigate(-1)}
        >
          <ArrowBackIosNewIcon />
          <span>Back</span>
        </div>

        <div className='flex items-center my-4 justify-end'>
          <p className='text-gray-500 mr-4'>Iterations:</p>
          <p
            className={`py-1 px-3 text-sm ${
              selectedHash === id
                ? 'text-white bg-indigo-500'
                : 'bg-gray-100 hover:bg-gray-200'
            } cursor-pointer rounded mr-2`}
            onClick={handleSelectLatest}
          >
            {original?.previousStorageHashes.length! + 1}
          </p>
          {original?.previousStorageHashes.map((hash, i) => (
            <p
              className={`py-1 px-3 text-sm ${
                selectedHash === hash
                  ? 'text-white bg-indigo-500'
                  : 'bg-gray-100 hover:bg-gray-200'
              } cursor-pointer rounded mr-2`}
              key={hash}
              onClick={() => handleIterationSelect(hash)}
            >
              {original?.previousStorageHashes.length - i}
            </p>
          ))}
        </div>
        <h1 className='text-3xl font-bold mt-4'>{displayData?.title}</h1>
        <p className='mt-1 text-sm text-gray-600 mb-6'>
          {displayData?.publishDate}
        </p>
        {displayData?.coverImage ? (
          <div className='bg-gray-200 mb-6'>
            <img
              src={displayData?.coverImage?.toString()}
              alt='cover of the blog'
              className='w-full h-full rounded'
            />
          </div>
        ) : null}
        <div
          // TODO: Safegaurd against XSS
          dangerouslySetInnerHTML={{ __html: `${displayData?.content}` }}
        ></div>

        <div
          className={`fixed rounded-full bottom-2 border left-1/2 -translate-x-1/2 p-2 pr-4 shadow-xl z-30 flex items-center cursor-pointer transition-all ${
            isLiked
              ? 'bg-indigo-500 text-white hover:bg-indigo-700'
              : 'bg-white text-gray-500 hover:text-gray-900'
          }`}
          onClick={isLiked ? handleUnlike : handleLike}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <RecommendIcon />
          <p className='ml-1'>{numLikes} Likes</p>
        </div>

        <div className='mt-8 mb-12 relative'>
          <div className='sticky bg-white top-14 py-3'>
            <h6 className='text-lg font-bold'>Leave a comment</h6>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className='w-full p-1 rounded border border-gray-400 my-2'
            ></textarea>
            <PrimaryButton onClick={handleAddComment}>
              Add Comment
            </PrimaryButton>
          </div>
          {comments.length ? (
            comments.map(([id, commentedBy, comment]) => (
              <div className='pb-3 my-3 border-b border-gray-300' key={id}>
                <p className='font-bold'>{commentedBy}</p>
                <p className='text-sm'>{comment}</p>
              </div>
            ))
          ) : (
            <p className='mt-1'>
              No comments yet. Be the first one to comment.
            </p>
          )}
        </div>
      </main>
    </PageLayout>
  );
};

export default BlogPage;
