import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Loader from './Loader';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { BlogContract, RoutesEnum } from '../@types/enums';

const IdentityInfo = ({ admin }: { admin?: boolean }) => {
  const navigate = useNavigate();
  const { ownerIdentity, userInfo } = useAppContext();

  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [numFollowers, setNumFollowers] = useState<number | string>('');

  useEffect(() => {
    (async () => {
      const { data } = await window.point.contract.call({
        contract: BlogContract.name,
        method: BlogContract.isFollowing,
      });
      setIsFollowing(data);
      getNumFollowers();
    })();
  }, []);

  const getNumFollowers = async () => {
    const { data } = await window.point.contract.call({
      contract: BlogContract.name,
      method: BlogContract.getNumFollowers,
    });
    setNumFollowers(data);
  };

  const follow = async () => {
    await window.point.contract.send({
      contract: BlogContract.name,
      method: BlogContract.follow,
    });
    setIsFollowing(true);
    getNumFollowers();
  };

  const unfollow = async () => {
    await window.point.contract.send({
      contract: BlogContract.name,
      method: BlogContract.unfollow,
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
      <div className='flex justify-end'>
        <button
          className={`rounded-full px-3 py-1 font-medium ${
            isFollowing
              ? 'text-indigo-500 hover:text-indigo-700'
              : 'text-white bg-indigo-500 hover:bg-indigo-700'
          } border border-indigo-500 hover:border-indigo-700 transition-all`}
          style={{ fontSize: 12 }}
          onClick={isFollowing ? unfollow : follow}
        >
          {isFollowing ? 'Unfollow' : 'Follow'}
        </button>
      </div>
      <div className='relative'>
        <div className='h-56 w-56 bg-gray-200 rounded-full self-center mb-4'>
          <img
            src={userInfo.data.avatar.toString()}
            alt='avatar'
            className='w-full h-full rounded-full object-cover'
          />
        </div>
      </div>
      <h2 className='text-xl font-bold mt-2'>{ownerIdentity}</h2>
      <p className='text-sm'>{numFollowers} followers</p>
      <div className='relative mt-2 mb-4'>
        <p className='text-sm text-gray-600'>{userInfo.data.about}</p>
      </div>
    </>
  ) : (
    <Loader>Loading User Info...</Loader>
  );
};

export default IdentityInfo;
