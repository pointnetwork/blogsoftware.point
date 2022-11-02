import {FunctionComponent, useContext} from 'react';
import {ErrorButton, OutlinedButton} from './Button';
import {ThemeContext} from '../context/ThemeContext';

const DeleteBlogModal: FunctionComponent<{
    onDelete: () => void;
    onCancel: () => void;
    deleting: boolean
}> = ({onCancel, onDelete, deleting}) => {
    const {theme} = useContext(ThemeContext);

    return (
        <div className='fixed z-50 top-0 left-0 h-screen w-screen'>
            <div className='relative h-full w-full'>
                <div className='absolute h-full w-full bg-black opacity-60'></div>
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-${theme[0]} p-5 rounded`}
                >
                    <h3 className='text-lg font-medium'>
                        Are your sure you want to move this blog post to Trash?
                    </h3>
                    <div className='flex justify-end space-x-4 mt-4'>
                        <OutlinedButton onClick={onCancel}>
                            Cancel
                        </OutlinedButton>
                        <ErrorButton disabled={deleting} onClick={onDelete}>
                            Move to Trash
                        </ErrorButton>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeleteBlogModal;
