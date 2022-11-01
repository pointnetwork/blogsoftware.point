import {FunctionComponent, useContext, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import {ThemeContext} from '../context/ThemeContext';
import DeleteBlogModal from './DeleteBlogModal';
import {PostsContext} from '../context/PostsContext';
import {BlogPost} from '../@types/types';

const BlogPreviewItem: FunctionComponent<{
    admin?: boolean;
    deleted?: boolean;
    data: BlogPost;
}> = ({
    admin,
    data,
    deleted
}) => {
    const {theme} = useContext(ThemeContext);
    const {postSaving, deletePost, publishPost, unpublishPost} = useContext(PostsContext);
    const navigate = useNavigate();
    const [requestDelete, setRequestDelete] = useState<boolean>(false);

    const handleDelete = async () => {
        await deletePost(data.id);
        setRequestDelete(false);
    };

    return (
        <div
            className={`flex p-3 rounded-lg my-3 border border-${theme[2]} ${
                admin ? 'mb-5' : ''
            } hover:shadow-lg border-opacity-20 relative`}
        >
            {requestDelete && <DeleteBlogModal
                onDelete={handleDelete}
                onCancel={() => {setRequestDelete(false);}}
                deleting={postSaving}
            />}
            {admin && !deleted && (
                <>
                    {data.previousStorageHashes.length > 0 && (
                        <div className={`-top-3 -right-2 absolute z-10 bg-${theme[0]}`}>
                            <div
                                style={{fontSize: 10}}
                                className={`rounded-full bg-${theme[1]}-100 text-${theme[1]}-600 text-sm px-2 border border-${theme[1]}-300`}
                            >
                                {data.previousStorageHashes.length} Revisions
                            </div>
                        </div>
                    )}
                    <div className='bottom-2 right-2 absolute flex space-x-3 z-20'>
                        {data.isPublished ? (
                            <DoDisturbIcon
                                className='text-orange-500 cursor-pointer'
                                titleAccess='Unpublish'
                                onClick={() => {unpublishPost(data.id);}}
                            />
                        ) : (
                            <CheckCircleOutlineIcon
                                className='text-green-600 cursor-pointer'
                                titleAccess='Publish'
                                onClick={() => {publishPost(data.id);}}
                            />
                        )}
                        <EditIcon
                            className={`text-${theme[2]} text-opacity-70 cursor-pointer`}
                            titleAccess='Edit'
                            onClick={() => navigate(`/edit?id=${data.id}`)}
                        />
                        <DeleteIcon
                            className='text-red-500 cursor-pointer'
                            titleAccess='Delete'
                            onClick={() => setRequestDelete(true)}
                        />
                    </div>
                </>
            )}
            <div
                className={`basis-48 h-32 mr-3 rounded overflow-hidden bg-${theme[2]} bg-opacity-10 flex items-center justify-center`}
            >
                {data.coverImage ? (
                    <img
                        src={URL.createObjectURL(data.coverImage)}
                        className='h-full w-full object-cover'
                        alt='cover for blog post'
                    />
                ) : (
                    <p className={`text-sm ${theme[2]}`}>No Image Uploaded</p>
                )}
            </div>
            <div
                className='flex-1 flex flex-col cursor-pointer'
                onClick={() =>
                    navigate(
                        deleted ? `/deleted_blog?id=${data.id}` : `/blog?id=${data.id}`
                    )
                }
            >
                <h2 className='font-bold text-lg'>{data.title}</h2>
                <p
                    className='text-sm mb-2 opacity-60 flex-1'
                    // TODO: Safegaurd against XSS
                    dangerouslySetInnerHTML={{__html: `<p>${data.content.slice(0, 200)}...</p>`}}
                ></p>
                <div className='flex items-center space-x-1 my-2'>
                    {data.tags.split(',').filter(tag => Boolean(tag)).map((tag) => (
                        <p
                            key={tag}
                            className={`p-0.5 px-2 rounded-full bg-${theme[2]} bg-opacity-10`}
                            style={{fontSize: 11}}
                        >
                            {tag}
                        </p>
                    ))}
                </div>
                <p className='text-sm opacity-50'>{data.publishDate}</p>
            </div>
        </div>
    );
};

export default BlogPreviewItem;
