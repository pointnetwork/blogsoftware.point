import React, {createContext, useContext, useState, useEffect} from 'react';
import {AppContentInterface, UserInfoState} from '../@types/interfaces';
import {BlogContract, BlogFactoryContract, RoutesEnum} from '../@types/enums';
import {useNavigate} from 'react-router-dom';
import utils from './utils';
import useBlogs from './useBlogs';

const AppContext = createContext({
    loading: true,
    isOwner: false,
    isBlogCreated: true,
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
    identity: '',
    visitorAddress: '',
    ownerAddress: ''
} as AppContentInterface);

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext = ({children}: { children: any }) => {
    const navigate = useNavigate();

    const Blogs = useBlogs();

    const [loading, setLoading] = useState<boolean>(true);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isBlogCreated, setIsBlogCreated] = useState<boolean>(true);
    const [userInfo, setUserInfo] = useState<UserInfoState>({
        loading: true,
        data: {
            walletAddress: '',
            about: '',
            avatar: '',
            dataStorageHash: ''
        }
    });
    const [identity, setIdentity] = useState<string>('');
    const [visitorAddress, setVisitorAddress] = useState<string>('');
    const [ownerAddress, setOwnerAddress] = useState<string>('');

    useEffect(() => {
    /**
     * 1. Slice the identity from the current domain. Also set the identity from there
     * 2. Get the address of the visiting user and the blog owner
     * 3. Check if the visiting user has a blog contract deployed or not
     * 4. If no, then proceed and check if visiting user is the blog owner then set isAdmin to true
     * 5. Proceed to get the user info and blogs.
     */
        (async () => {
            setLoading(true);

            const identity = window.location.hostname.split('.')[0];
            setIdentity(identity);
            console.log('identity', identity);

            const visitorAddress = await utils.getWalletAddress();
            setVisitorAddress(visitorAddress);
            console.log('visitorAddress', visitorAddress);
            const ownerAddress = await utils.getAddressFromIdentity(identity);
            setOwnerAddress(ownerAddress);
            console.log('ownerAddress', ownerAddress);

            if (visitorAddress.toLowerCase() === ownerAddress.toLowerCase()) {
                setIsOwner(true);
                console.log('isOwner');
            }

            let isCreated = true;
            if (window.location.hostname === 'blogsoftware.point') {
                isCreated = await isBlogCreatedForUser(visitorAddress);
                setIsBlogCreated(isCreated);
            }
            console.log('isCreated', isCreated);

            if (isCreated) {
                const hash = await getUserInfo();
                if (!hash) navigate(RoutesEnum.profile, {replace: true});
                else Blogs.getAllBlogs();
            }

            setLoading(false);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isBlogCreatedForUser = async (address: string) => {
        const {data} = await window.point.contract.call({
            contract: BlogFactoryContract.name,
            method: BlogFactoryContract.isBlogCreated,
            params: [address]
        });
        if (data === '0x0000000000000000000000000000000000000000') return false;
        return true;
    };

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
                isBlogCreated,
                visitorAddress,
                ownerAddress,
                identity,
                getUserInfo,
                userInfo,
                getDataFromStorage: utils.getDataFromStorage
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
