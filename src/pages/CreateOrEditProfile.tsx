import React, {ChangeEvent, FunctionComponent, useContext, useEffect, useState} from 'react';
import {OutlinedButton, PrimaryButton} from '../components/Button';
import {useNavigate} from 'react-router-dom';
import PageLayout from '../layouts/PageLayout';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import {UserContext} from '../context/UserContext';
import {ThemeContext} from '../context/ThemeContext';

const CreateOrEditProfile: FunctionComponent<{ edit?: boolean }> = ({edit}) => {
    const {userInfo, userSaving, saveUserInfo, userLoading, userError} = useContext(UserContext);
    const {theme} = useContext(ThemeContext);

    const [avatar, setAvatar] = useState<Blob | null>(userInfo.avatar);
    const [about, setAbout] = useState<string>(userInfo.about);
    useEffect(() => {
        if (userInfo.about) {
            setAbout(userInfo.about);
        }
        if (userInfo.avatar) {
            setAvatar(userInfo.avatar);
        }
    }, [userInfo]);

    const navigate = useNavigate();

    const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
        setAvatar(e.target.files ? e.target.files[0] : null);
    };

    if (userLoading) return <PageLayout loading/>;
    if (userError) return <PageLayout error/>;

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
                            <p
                                className={`relative text-sm mt-4 transition-all text-${theme[2]} text-opacity-50 hover:text-opacity-100`}
                            >
                                <span className='absolute left-1/2 -translate-x-1/2 cursor-pointer underline'>
                                    Change
                                </span>
                                <input
                                    type='file'
                                    title='Upload a file'
                                    className='absolute w-20 h-6 opacity-0 left-1/2 -translate-x-1/2 cursor-pointer'
                                    onChange={handleFileInput}
                                />
                            </p>
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
                                disabled={!avatar || !about || userSaving}
                                onClick={() => {saveUserInfo({avatar, about});}}
                            >
                                {userSaving ? 'Please Wait' : edit ? 'Update Profile' : 'Finish'}
                            </PrimaryButton>
                            {edit && (
                                <OutlinedButton onClick={() => navigate(-1)}>
                                    Cancel
                                </OutlinedButton>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
};

export default CreateOrEditProfile;
