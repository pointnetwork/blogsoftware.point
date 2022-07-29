import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppContentInterface,
  Blog,
  BlogContractData,
  BlogsState,
  UserInfoState,
} from '../@types/interfaces';
import { BlogContract } from '../@types/enums';

const AppContext = createContext({
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

export const ProvideAppContext = ({ children }: { chilren: any }) => {
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
        const {
          data: { address },
        } = await window.point.wallet.address();
        const {
          data: { identity },
        } = await window.point.identity.ownerToIdentity({
          owner: address,
        });

        setWalletAddress(address);
        setIdentity(identity);

        getUserInfo();
        getAllBlogs();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

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
