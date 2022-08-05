import axios from 'axios';

const getWalletAddress = async () => {
  const {
    data: { address },
  } = await window.point.wallet.address();
  return address;
};

const getAddressFromIdentity = async (identity: string) => {
  const {
    data: { owner },
  } = await window.point.identity.identityToOwner({
    identity,
  });
  return owner;
};

const getIdentityFromAddress = async (owner: string) => {
  const {
    data: { identity },
  } = await window.point.identity.ownerToIdentity({
    owner,
  });
  return identity;
};

const getDataFromStorage = async (storageHash: string) => {
  const { data } = await axios.get(`/_storage/${storageHash}`);
  return data;
};

const utils = Object.freeze({
  getWalletAddress,
  getAddressFromIdentity,
  getIdentityFromAddress,
  getDataFromStorage,
});
export default utils;
