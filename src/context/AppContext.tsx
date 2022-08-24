import {createContext, useContext, useState, useEffect} from 'react';
import {AppContentInterface, UserInfoState} from '../@types/interfaces';
import {BlogContract, RoutesEnum} from '../@types/enums';
import {useNavigate} from 'react-router-dom';
import utils from './utils';
import useBlogs from './useBlogs';
import {Theme} from '../@types/types';

const AppContext = createContext({
    loading: true,
    isOwner: false,
    blogs: {loading: true, data: []},
    setBlogs: () => {},
    userInfo: {
        loading: true,
        data: {about: '', walletAddress: '', dataStorageHash: '', avatar: ''}
    },
    getUserInfo: () => {},
    getAllBlogs: () => {},
    getDeletedBlogs: async () => [],
    getDataFromStorage: async () => {},
    ownerIdentity: '',
    visitorAddress: '',
    ownerAddress: '',
    visitorIdentity: ''
} as AppContentInterface);

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext = ({children}: { children: any }) => {
    const navigate = useNavigate();

    const Blogs = useBlogs();

    const [loading, setLoading] = useState<boolean>(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<UserInfoState>({
        loading: true,
        data: {
            walletAddress: '',
            about: '',
            avatar: '',
            dataStorageHash: ''
        }
    });
    const [visitorAddress, setVisitorAddress] = useState<string>('');
    const [visitorIdentity, setVisitorIdentity] = useState<string>('');
    const [ownerAddress, setOwnerAddress] = useState<string>('');
    const [ownerIdentity, setOwnerIdentity] = useState<string>('');
    const [theme, setTheme] = useState<Theme>(['white', 'indigo', 'black']);

    useEffect(() => {
        (async () => {
            setLoading(true);

            const {data}: { data: Theme } = await window.point.contract.call({
                contract: BlogContract.name,
                method: BlogContract.getTheme
            });
            setTheme(data);

            const {data: owner} = await window.point.contract.call({
                contract: BlogContract.name,
                method: BlogContract.owner,
                params: []
            });
            setOwnerAddress(owner);

            const ownerId = await utils.getIdentityFromAddress(owner);
            setOwnerIdentity(ownerId);

            const visitor = await utils.getWalletAddress();
            setVisitorAddress(visitor);

            const visitorId = await utils.getIdentityFromAddress(visitor);
            setVisitorIdentity(visitorId);

            const visitorIsOwner = visitor.toLowerCase() === owner.toLowerCase();
            setIsOwner(visitorIsOwner);

            const hash = await getUserInfo();
            if (!hash && visitorIsOwner) {
                navigate(RoutesEnum.profile, {replace: true});
            } else {
                Blogs.getAllBlogs();
            }

            setLoading(false);
        })();
    }, []);

    const getUserInfo = async () => {
        setUserInfo((prev) => ({...prev, loading: true}));

        const {data: [walletAddress, dataStorageHash]}: { data: [walletAddress: string, dataStorageHash: string] } =
      await window.point.contract.call({
          contract: BlogContract.name,
          method: BlogContract.getUserInfo
      });
        if (dataStorageHash) {
            const data = await utils.getDataFromStorage(dataStorageHash);
            setUserInfo((prev) => ({
                ...prev,
                loading: false,
                data: {...data, walletAddress, dataStorageHash}
            }));
        }
        return dataStorageHash;
    };

    return (
        <AppContext.Provider
            value={{
                loading,
                isOwner,
                ...Blogs,
                visitorAddress,
                ownerAddress,
                ownerIdentity,
                getUserInfo,
                userInfo,
                visitorIdentity,
                getDataFromStorage: utils.getDataFromStorage,
                theme,
                setTheme
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
