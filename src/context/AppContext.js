import React, { createContext, useContext, useState, useEffect } from 'react';

const defaultContext = {
  blogs: [],
  setBlogs: () => {},
  identity: undefined,
  walletAddress: undefined,
  walletError: undefined,
};

const AppContext = createContext(defaultContext);

export const useAppContext = () => useContext(AppContext);

export const ProvideAppContext = ({ children }) => {
  const [blogs, setBlogs] = useState([]);
  const [identity, setIdentity] = useState();
  const [walletAddress, setWalletAddress] = useState();
  const [walletError, setWallerError] = useState();

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
      } catch (e) {
        setWallerError(e);
      }
    })();
  }, []);

  const context = {
    walletAddress,
    walletError,
    identity,
    blogs,
    setBlogs,
  };

  return <AppContext.Provider value={context}>{children}</AppContext.Provider>;
};
