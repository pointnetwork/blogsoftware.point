import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppContentInterface,
  Blog,
  BlogContractData,
} from '../@types/interfaces';
import { BlogContract } from '../@types/enums';

const AppContext = createContext({
  blogs: [],
  setBlogs: () => {},
  getAllBlogs: () => {},
  identity: '',
  walletAddress: '',
} as AppContentInterface);

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext = ({ children }: { chilren: any }) => {
  const [blogs, setBlogs] = useState<(Blog & BlogContractData)[]>([]);
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

        await getAllBlogs();
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const getAllBlogs = async () => {
    const { data }: { data: any[] } = await window.point.contract.call({
      contract: BlogContract.name,
      method: BlogContract.getAllBlogs,
    });
    const blogs = await Promise.all(
      data.map(async (contractData) => {
        const [storageHash, isPublished, publishDate] = contractData;
        const { data } = await axios.get(`/_storage/${storageHash}`);
        return { ...data, storageHash, isPublished, publishDate } as Blog &
          BlogContractData;
      })
    );
    setBlogs(blogs);
  };

  return (
    <AppContext.Provider
      value={{
        walletAddress,
        identity,
        blogs,
        setBlogs,
        getAllBlogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
