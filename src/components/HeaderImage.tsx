import { useState, useEffect, ChangeEvent } from 'react';
import {useNavigate} from 'react-router-dom';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {useAppContext} from '../context/AppContext';

const HeaderImage = ({edit, setImageHeader}: { edit?: boolean, setImageHeader?: Function }) => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(false);
    const [headerImage, setHeaderImage] = useState<Blob | null>(null);
    const {theme, userInfo} = useAppContext();

    const getInitialData = async () => {
        setLoading(true);
        if (userInfo.data.headerImage) {
            const blob = await window.point.storage.getFile({id: userInfo.data.headerImage});
            setHeaderImage(blob);
            if (setImageHeader) setImageHeader(blob); 
        }
        setLoading(false);
    };

    useEffect(() => {
        getInitialData();
    }, [edit, userInfo]);


    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        setHeaderImage(e.target.files ? e.target.files[0] : null);
        if (setImageHeader) setImageHeader(e.target.files ? e.target.files[0] : null); 
    };

    return (
        <>
            {!headerImage ? (
                <div className='h-65 w-screen p-8 border-2 bg-gray-100 border-gray-300 flex flex-col items-center justify-center relative overflow-hidden'>
                    <ImageOutlinedIcon
                        sx={{height: 42, width: 42}}
                        className='text-gray-500'
                    />
                    {edit ? (
                        <>
                            <h3 className='font-bold text-lg mb-4'>Upload a Cover Photo</h3>
                            <input
                                type='file'
                                accept='image/*'
                                title='Upload a file'
                                className='absolute w-full h-full opacity-0 cursor-pointer'
                                onChange={handleFileInput}
                            />
                        </>
                    ) : null
                    }
                </div>
            ) : (
                    <img
                        src={URL.createObjectURL(headerImage)}
                        className='w-full h-60 border-2 border-gray-200 object-cover'
                        alt='profile'
                    />
           
            )}
            {headerImage && edit ? (
                <p
                    className={`relative text-sm mt-4 transition-all text-${theme[2]} text-opacity-50 hover:text-opacity-100`}
                >
                    <span className='absolute left-1/2 -translate-x-1/2 cursor-pointer underline'>
                    Change Cover
                    </span>
                    <input
                        type='file'
                        title='Upload a file'
                        className='absolute w-20 h-6 opacity-0 left-1/2 -translate-x-1/2 cursor-pointer'
                        onChange={handleFileInput}
                    />
                </p>
            ) : null}
        </>
    );
};

export default HeaderImage;