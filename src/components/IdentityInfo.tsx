import {useEffect, useState} from 'react';
import {useAppContext} from '../context/AppContext';
import Loader from './Loader';
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from 'react-router-dom';
import {BlogContract, RoutesEnum} from '../@types/enums';

const IdentityInfo = ({admin}: { admin?: boolean }) => {
    const navigate = useNavigate();
    const {ownerIdentity, userInfo, isOwner, theme} = useAppContext();

    const [avatar, setAvatar] = useState<Blob | null>(null);
    const [isFollowing, setIsFollowing] = useState<boolean>(false);
    const [numFollowers, setNumFollowers] = useState<number | string>('');

    const getInitialData = async () => {
        const {data} = await window.point.contract.call({
            contract: BlogContract.name,
            method: BlogContract.isFollowing
        });
        setIsFollowing(data);
        if (userInfo.data.avatar) {
            const blob = await window.point.storage.getFile({id: userInfo.data.avatar});
            setAvatar(blob);
        }
        getNumFollowers();
    };

    useEffect(() => {
        getInitialData();
    }, []);

    const getNumFollowers = async () => {
        const {data} = await window.point.contract.call({
            contract: BlogContract.name,
            method: BlogContract.getNumFollowers
        });
        setNumFollowers(data);
    };

    const follow = async () => {
        await window.point.contract.send({
            contract: BlogContract.name,
            method: BlogContract.follow
        });
        setIsFollowing(true);
        getNumFollowers();
    };

    const unfollow = async () => {
        await window.point.contract.send({
            contract: BlogContract.name,
            method: BlogContract.unfollow
        });
        setIsFollowing(false);
        getNumFollowers();
    };

    return !userInfo.loading ? (
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
            {!isOwner ? (
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
            ) : null}
            <div className='relative'>
                <div className='h-56 w-56 bg-gray-200 rounded-full self-center mb-4'>
                    {avatar && (
                        <img
                            src={URL.createObjectURL(avatar)}
                            alt='avatar'
                            className='w-full h-full rounded-full object-cover'
                        />
                    )}
                </div>
            </div>
            <h2 className='text-xl font-bold mt-2'>{ownerIdentity}</h2>
            <p className='text-sm'>{numFollowers} followers</p>
            <div className='relative mt-2 mb-4'>
                <p className='text-sm opacity-80'>{userInfo.data.about}</p>
            </div>
        </>
    ) : (
        <Loader>Loading User Info...</Loader>
    );
};

export default IdentityInfo;
