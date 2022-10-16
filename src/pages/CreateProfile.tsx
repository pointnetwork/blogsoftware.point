import React, {ChangeEvent, useEffect, useState} from 'react';
import {ErrorButton, OutlinedButton, PrimaryButton} from '../components/Button';
import {useNavigate} from 'react-router-dom';
import {useAppContext} from '../context/AppContext';
import PageLayout from '../layouts/PageLayout';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {BlogContract, RoutesEnum} from '../@types/enums';
import {UserInfo} from '../@types/interfaces';

const CreateProfile = ({edit}: { edit?: boolean }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [avatar, setAvatar] = useState<Blob | null>(null);
    const [about, setAbout] = useState<string>('');
    const [showModal, setShowModal] = useState<boolean>(false);

    const hiddenFileInput = React.useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const {ownerAddress, userInfo, getUserInfo, getAllBlogs, theme, setToast} =
    useAppContext();

    const getInitialData = async () => {
        if (edit) {
            setLoading(true);
            setAbout(userInfo.data.about);
            if (userInfo.data.avatar) {
                const blob = await window.point.storage.getFile({id: userInfo.data.avatar});
                setAvatar(blob);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        getInitialData();
    }, [edit, userInfo]);

    const handleFileButtonClick = ()  => {
        hiddenFileInput?.current?.click();
      };

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        setAvatar(e.target.files ? e.target.files[0] : null);
    };

    const handleFinish = async () => {
        setLoading(true);
        try {
            let avatarImage = '';
            if (avatar) {
                const avatarFormData = new FormData();
                avatarFormData.append('files', avatar);
                const {data} = await window.point.storage.postFile(avatarFormData);
                avatarImage = data;
            }
            const form = JSON.stringify({
                avatar: avatarImage,
                about
            } as UserInfo);
            const file = new File([form], 'user.json', {type: 'application/json'});

            const formData = new FormData();
            formData.append('files', file);
            // Upload the File to arweave
            const res = await window.point.storage.postFile(formData);
            setLoading(false);

            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.saveUserInfo,
                params: [ownerAddress, res.data]
            });
            setToast({color: 'green-500', message: 'Profile saved successfully'});
            getUserInfo();
            getAllBlogs();
            navigate(RoutesEnum.admin);
        } catch (error) {
            setLoading(false);
            setToast({
                color: 'red-500',
                message: 'Failed to save the profile. Please try again'
            });
        }
    };

    return (
        <PageLayout>
            <header className={`py-3 sticky top-0 bg-${theme[0]} shadow z-10`}>
                <div className='mx-auto' style={{maxWidth: '1000px'}}>
                    {/* Logo will go here */}
                    <span className='font-medium'>BlogSoftware</span>
                </div>
            </header>
            <main className='mt-8 mx-auto' style={{maxWidth: '1000px'}}>
                <h1 className='text-3xl font-bold mb-6'>
                    {edit ? 'Update' : 'Complete'} Your Profile
                </h1>
                <div className='flex mb-8'>
                    <div className='mr-24'>
                        <h3 className='font-bold text-lg mb-4'>Upload a Profile Image</h3>
                        {!avatar ? (
                            <div className='h-56 w-56 p-8 rounded-full border-2 bg-gray-100 border-gray-300 flex flex-col items-center justify-center relative overflow-hidden'>
                                <ImageOutlinedIcon
                                    sx={{height: 42, width: 42}}
                                    className='text-gray-500'
                                />
                                <p className='text-gray-500 mt-1'>Click to Upload</p>
                                <input
                                    type='file'
                                    accept='image/*'
                                    title='Upload a file'
                                    className='absolute w-full h-full opacity-0 cursor-pointer'
                                    onChange={handleFileInput}
                                />
                            </div>
                        ) : (
                            <img
                                src={URL.createObjectURL(avatar)}
                                className='w-56 h-56 rounded-full border-2 border-gray-200 object-cover'
                                alt='profile'
                            />
                        )}
                        {avatar && (
                            <div className='flex items-center justify-center space-x-3'>
                                <p
                                    className={`text-sm mt-4 transition-all text-${theme[2]} text-opacity-50 hover:text-opacity-100`}
                                >
                                    <span 
                                        onClick={handleFileButtonClick}
                                        className='left-1/2 -translate-x-1/2 cursor-pointer underline'>
                    Change
                                    </span>
                                    <input
                                        type='file'
                                        title='Upload a file'
                                        ref={hiddenFileInput}
                                        className='w-20 h-6 opacity-0 left-1/2 -translate-x-1/2 cursor-pointer hidden'
                                        onChange={handleFileInput}
                                    />
                                </p>
                                <p
                                    className={`text-sm mt-4 transition-all text-${theme[2]} text-opacity-50 hover:text-opacity-100`}
                                >
                                    <span 
                                        className='cursor-pointer underline'
                                        onClick={() => setShowModal(true)}>
                    Remove
                                    </span>
                                </p>
                            </div>                     
                        )}
                    </div>
                    <div className='flex-1'>
                        <h3 className='font-bold text-lg mb-2'>A Little About You</h3>
                        <textarea
                            className={`w-full h-40 p-2 border-2 border-${theme[2]} border-opacity-10 resize-none rounded bg-transparent`}
                            value={about}
                            onChange={(e) =>
                                e.target.value.length <= 1000 && setAbout(e.target.value)
                            }
                            maxLength={1000}
                        ></textarea>
                        <div
                            className={`flex justify-end mb-3 text-sm text-${theme[2]} text-opacity-40 m-1`}
                        >
                            {about.length}/1000
                        </div>
                        <div className='flex space-x-3'>
                            <PrimaryButton
                                disabled={loading}
                                onClick={handleFinish}
                            >
                                {loading ? 'Please Wait' : edit ? 'Update Profile' : 'Finish'}
                            </PrimaryButton>
                            {edit ? (
                                <OutlinedButton onClick={() => navigate(-1)}>
                  Cancel
                                </OutlinedButton>
                            ) : null}
                        </div>
                    </div>
                </div>
                {showModal && (
                    <div className='fixed z-50 top-0 left-0 h-screen w-screen'>
                        <div className='relative h-full w-full'>
                            <div className='absolute h-full w-full bg-black opacity-60'></div>
                            <div
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-${theme[0]} p-5 rounded`}
                            >
                                <h3 className='text-lg font-medium'>
                    Are you sure you want to remove your profile image?
                                </h3>
                                <div className='flex justify-end space-x-4 mt-4'>
                                    <OutlinedButton onClick={() => setShowModal(false)}>
                    Cancel
                                    </OutlinedButton>
                                    <ErrorButton disabled={loading} onClick={() => {setAvatar(null); setShowModal(false)}}>
                    Remove
                                    </ErrorButton>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </PageLayout>
    );
};

export default CreateProfile;
