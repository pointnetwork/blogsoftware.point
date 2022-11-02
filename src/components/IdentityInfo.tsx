import {FunctionComponent, useContext, useEffect, useState} from 'react';
import Loader from './Loader';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import {BlogContract, RoutesEnum} from '../@types/enums';
import {ToastContext} from '../context/ToastContext';
import {ThemeContext} from '../context/ThemeContext';
import {UserContext} from '../context/UserContext';

const IdentityInfo: FunctionComponent<{ admin?: boolean }> = ({admin}) => {
    const navigate = useNavigate();
    const {setToast} = useContext(ToastContext);
    const {theme} = useContext(ThemeContext);
    const {ownerIdentity, userInfo, isOwner, userLoading} = useContext(UserContext);

    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [numFollowers, setNumFollowers] = useState<number | string>('');

    const getInitialData = async () => {
        try {
            const {data} = await window.point.contract.call({
                contract: BlogContract.name,
                method: BlogContract.isFollowing
            });
            setIsFollowing(data);
            getNumFollowers();
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to fetch user information. Please reload the page'
            });
        }
    };

    useEffect(() => {
        getInitialData();
    }, []);

    const getNumFollowers = async () => {
        try {
            const {data} = await window.point.contract.call({
                contract: BlogContract.name,
                method: BlogContract.getNumFollowers
            });
            setNumFollowers(data);
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to load the followers. Please reload the page'
            });
        }
    };

    const follow = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.follow
            });
            setIsFollowing(true);
            getNumFollowers();
            setToast({
                color: 'red-500',
                message: 'You are now following' + ownerIdentity
            });
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to follow the blog. Please try again'
            });
        }
    };

    const unfollow = async () => {
        try {
            await window.point.contract.send({
                contract: BlogContract.name,
                method: BlogContract.unfollow
            });
            setIsFollowing(false);
            getNumFollowers();
            setToast({
                color: 'red-500',
                message: 'You unfollowed' + ownerIdentity
            });
        } catch (error) {
            setToast({
                color: 'red-500',
                message: 'Failed to unfollow the blog. Please try again'
            });
        }
    };

    return userLoading ? (
        <Loader>Loading User Info...</Loader>
    ) : (
        <>
            {admin ? (
                <div
                    className='flex items-center text-sm opacity-50 hover:opacity-95 underline -mt-4 mb-3 cursor-pointer'
                    onClick={() => navigate(RoutesEnum.edit_profile)}
                >
                    <p className='mx-1'>Edit Profile</p>
                    <EditIcon fontSize='small' />
                </div>
            ) : null}
            {!isOwner && (
                <div className='flex justify-end'>
                    <button
                        className={`rounded-full px-3 py-1 font-medium ${
                            isFollowing
                                ? `text-${theme[1]}-500 hover:text-${theme[1]}-700`
                                : `text-white bg-${theme[1]}-500 hover:bg-${theme[1]}-700`
                        } border border-${theme[1]}-500 hover:border-${
                            theme[1]
                        }-700 transition-all`}
                        style={{fontSize: 12}}
                        onClick={isFollowing ? unfollow : follow}
                    >
                        {isFollowing ? 'Unfollow' : 'Follow'}
                    </button>
                </div>
            )}
            <div className='relative'>
                <div className='h-56 w-56 bg-gray-200 rounded-full self-center mb-4'>
                    {userInfo.avatar && (
                        <img
                            src={URL.createObjectURL(userInfo.avatar)}
                            alt='avatar'
                            className='w-full h-full rounded-full object-cover'
                        />
                    )}
                </div>
            </div>
            <h2 className='text-xl font-bold mt-2'>{ownerIdentity}</h2>
            <p className='text-sm'>{numFollowers} followers</p>
            <div className='relative mt-2 mb-4'>
                <p className='text-sm opacity-80'>{userInfo.about}</p>
            </div>
        </>
    );
};

export default IdentityInfo;
