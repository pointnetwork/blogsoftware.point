import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContentInterface, Blog } from '../@types/interfaces';

const AppContext = createContext({
  blogs: [],
  setBlogs: () => {},
  identity: '',
  walletAddress: '',
} as AppContentInterface);

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext = ({ children }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
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
      } catch (e) {}
    })();
  }, []);

  return (
    <AppContext.Provider
      value={{
        walletAddress,
        identity,
        blogs,
        setBlogs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
