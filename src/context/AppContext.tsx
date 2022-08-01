import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppContentInterface,
  Blog,
  BlogContractData,
  BlogsState,
  UserInfoState,
} from '../@types/interfaces';
import { BlogContract, BlogFactoryContract, RoutesEnum } from '../@types/enums';
import { useNavigate } from 'react-router-dom';

const AppContext = createContext({
  loading: true,
  isOwner: false,
  blogs: { loading: true, data: [] },
  setBlogs: () => {},
  userInfo: {
    loading: true,
    data: { about: '', walletAddress: '', dataStorageHash: '', avatar: '' },
  },
  getUserInfo: () => {},
  getAllBlogs: () => {},
  getDeletedBlogs: async () => [],
  identity: '',
  walletAddress: '',
} as AppContentInterface);

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext = ({ children }: { children: any }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true);
  const [isOwner, isIsOwner] = useState<boolean>(false);
  const [blogs, setBlogs] = useState<BlogsState>({
    loading: true,
    data: [],
  });
  const [userInfo, setUserInfo] = useState<UserInfoState>({
    loading: true,
    data: {
      walletAddress: '',
      about: '',
      avatar: '',
      dataStorageHash: '',
    },
  });
  const [identity, setIdentity] = useState<string>('');
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const address = await getWalletAddress();
        const identity = await getIdentityFromAddress(address);

        const dataStorageHash = await getUserInfo();

        // Check the domain host
        const host = window.location.hostname.split('.')[0];
        // IF domain host and identity match, then check if there is blog for the address in the factory
        if (identity.toLowerCase() === host.toLowerCase()) {
          isIsOwner(true);
          const isBlogCreated = await isBlogCreatedForUser(address);
          if (!isBlogCreated) {
            navigate(RoutesEnum.install);
          } else {
            if (dataStorageHash) navigate(RoutesEnum.admin);
            else navigate(RoutesEnum.profile);
          }
        }
        setLoading(false);

        getAllBlogs();
      } catch (e) {
        console.error(e);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getWalletAddress = async () => {
    const {
      data: { address },
    } = await window.point.wallet.address();
    setWalletAddress(address);
    return address;
  };

  const getIdentityFromAddress = async (address: string) => {
    const {
      data: { identity },
    } = await window.point.identity.ownerToIdentity({
      owner: address,
    });
    setIdentity(identity);
    return identity;
  };

  const isBlogCreatedForUser = async (address: string) => {
    const { data } = await window.point.contract.call({
      contract: BlogFactoryContract.name,
      method: BlogFactoryContract.isBlogCreated,
      params: [address],
    });
    if (data === '0x0000000000000000000000000000000000000000') return false;
    return true;
  };

  const getUserInfo = async () => {
    setUserInfo((prev) => ({ ...prev, loading: true }));

    const {
      data: [walletAddress, dataStorageHash],
    }: { data: [walletAddress: string, dataStorageHash: string] } =
      await window.point.contract.call({
        contract: BlogContract.name,
        method: BlogContract.getUserInfo,
      });
    if (dataStorageHash) {
      const res = await axios.get(`/_storage/${dataStorageHash}`);
      setUserInfo((prev) => ({
        ...prev,
        loading: false,
        data: { ...res.data, walletAddress, dataStorageHash },
      }));
    }
    return dataStorageHash;
  };

  const getAllBlogs = async () => {
    setBlogs((prev) => ({ ...prev, loading: true }));

    const { data }: { data: any[] } = await window.point.contract.call({
      contract: BlogContract.name,
      method: BlogContract.getAllBlogs,
    });
    const blogs = await Promise.all(
      data.map(async (contractData) => {
        const [id, storageHash, isPublished, publishDate] = contractData;
        const { data } = await axios.get(`/_storage/${storageHash}`);
        return { ...data, id, storageHash, isPublished, publishDate } as Blog &
          BlogContractData;
      })
    );
    setBlogs({ loading: false, data: blogs });
  };

  const getDeletedBlogs = async () => {
    const { data }: { data: any[] } = await window.point.contract.call({
      contract: BlogContract.name,
      method: BlogContract.getDeletedBlogs,
    });
    const blogs = await Promise.all(
      data.map(async (contractData) => {
        const [id, storageHash, isPublished, publishDate] = contractData;
        const { data } = await axios.get(`/_storage/${storageHash}`);
        return { ...data, id, storageHash, isPublished, publishDate } as Blog &
          BlogContractData;
      })
    );
    return blogs;
  };

  return (
    <AppContext.Provider
      value={{
        loading,
        isOwner,
        walletAddress,
        identity,
        blogs,
        setBlogs,
        getUserInfo,
        userInfo,
        getAllBlogs,
        getDeletedBlogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
