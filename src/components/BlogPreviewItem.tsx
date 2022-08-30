import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import {ErrorButton, OutlinedButton} from './Button';
import {Blog, BlogContractData} from '../@types/interfaces';
import {BlogContract} from '../@types/enums';
import {useAppContext} from '../context/AppContext';

const BlogPreviewItem = ({
    admin,
    data,
    deleted
}: {
  admin?: boolean;
  deleted?: boolean;
  data: Blog & BlogContractData;
}) => {
    const {getAllBlogs, theme, setToast} = useAppContext();
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [requestDelete, setRequestDelete] = useState<boolean>(false);
    const [coverImage, setCoverImage] = useState<Blob | null>(null);
    const getCoverImage = async () => {
        if (data.coverImage) {
            const blob = await window.point.storage.getFile({id: data.coverImage});
            setCoverImage(blob);
        }
    };
    useEffect(() => {
        getCoverImage();
    }, [data]);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.deleteBlog,
                params: [data.id]
            });
            await getAllBlogs();
            setToast({color: 'green-500', message: 'Blog post moved to trash'});
            setRequestDelete(false);
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to delete the blog post. Please try again'
            });
        }
        setLoading(false);
    };

    const handlePublish = async () => {
        setLoading(true);
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.publish,
                params: [data.id]
            });
            setToast({
                color: 'green-500',
                message: 'Blog post published & moved to published successfully'
            });
            await getAllBlogs();
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to publish the blog post. Please try again'
            });
        }
        setLoading(false);
    };

    const handleUnPublish = async () => {
        setLoading(true);
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.unpublish,
                params: [data.id]
            });
            setToast({
                color: 'green-500',
                message: 'Blog post unpublished & moved to drafts successfully'
            });
            await getAllBlogs();
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to unpublish the blog post. Please try again'
            });
        }
        setLoading(false);
    };

    return (
        <div
            className={`flex p-3 rounded-lg my-3 border border-${theme[2]} ${
                admin ? 'mb-5' : ''
            } hover:shadow-lg border-opacity-20 relative`}
        >
            {/* DELETE MODAL: START */}
            {requestDelete ? (
                <div className='fixed z-50 top-0 left-0 h-screen w-screen'>
                    <div className='relative h-full w-full'>
                        <div className='absolute h-full w-full bg-black opacity-60'></div>
                        <div
                            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-${theme[0]} p-5 rounded`}
                        >
                            <h3 className='text-lg font-medium'>
                Are your sure you want to move this blog to Trash?
                            </h3>
                            <div className='flex justify-end space-x-4 mt-4'>
                                <OutlinedButton onClick={() => setRequestDelete(false)}>
                  Cancel
                                </OutlinedButton>
                                <ErrorButton disabled={loading} onClick={handleDelete}>
                  Move to Trash
                                </ErrorButton>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {/* DELETE MODAL: END */}
            {admin && !deleted ? (
                <>
                    {data.previousStorageHashes?.length ? (
                        <div className={`-top-3 -right-2 absolute z-10 bg-${theme[0]}`}>
                            <div
                                style={{fontSize: 10}}
                                className={`rounded-full bg-${theme[1]}-100 text-${theme[1]}-600 text-sm px-2 border border-${theme[1]}-300`}
                            >
                                {data.previousStorageHashes.length} Revisions
                            </div>
                        </div>
                    ) : null}
                    <div className='bottom-2 right-2 absolute flex space-x-3 z-20'>
                        {data.isPublished ? (
                            <DoDisturbIcon
                                className='text-orange-500 cursor-pointer'
                                titleAccess='Unpublish'
                                onClick={handleUnPublish}
                            />
                        ) : (
                            <CheckCircleOutlineIcon
                                className='text-green-600 cursor-pointer'
                                titleAccess='Publish'
                                onClick={handlePublish}
                            />
                        )}
                        <EditIcon
                            className={`text-${theme[2]} text-opacity-70 cursor-pointer`}
                            titleAccess='Edit'
                            onClick={() => navigate(`/edit?id=${data.storageHash}`)}
                        />
                        <DeleteIcon
                            className='text-red-500 cursor-pointer'
                            titleAccess='Delete'
                            onClick={() => setRequestDelete(true)}
                        />
                    </div>
                </>
            ) : null}
            <div
                className={`basis-48 h-32 mr-3 rounded overflow-hidden bg-${theme[2]} bg-opacity-10 flex items-center justify-center`}
            >
                {coverImage ? (
                    <img
                        src={URL.createObjectURL(coverImage)}
                        className='h-full w-full object-cover'
                        alt='cover for blog'
                    />
                ) : (
                    <p className={`text-sm ${theme[2]}`}>No Image Uploaded</p>
                )}
            </div>
            <div
                className='flex-1 flex flex-col cursor-pointer'
                onClick={() =>
                    navigate(
                        `/blog?id=${data.storageHash}${deleted ? '?deleted=true' : ''}`
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
                    {data.tags.split(',').map((tag) => (
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
