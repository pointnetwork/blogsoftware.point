import {Dispatch, ReactEventHandler, SetStateAction} from 'react';
import {Theme} from './types';

export interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: ReactEventHandler;
}

export interface AppContentInterface {
  toast: ToastNotification;
  setToast: Dispatch<SetStateAction<ToastNotification>>;
  loading: boolean;
  isOwner: boolean;
  userInfo: UserInfoState;
  getUserInfo: () => void;
  blogs: BlogsState;
  getAllBlogs: () => void;
  getDeletedBlogs: () => Promise<(Blog & BlogContractData)[]>;
  getDataFromStorage: (storageHash: string) => any;
  ownerAddress: string;
  ownerIdentity: string;
  visitorAddress: string;
  visitorIdentity: string;
  theme: Theme;
  setTheme: Dispatch<SetStateAction<Theme>>;
}

export interface BlogsState {
  loading: boolean;
  data: (Blog & BlogContractData)[];
  error?: string;
}

export interface Blog {
  coverImage: string;
  title: string;
  content: string;
  publisher: string;
  createdDate: string;
}

export interface BlogContractData {
  id: number;
  storageHash: string;
  isPublished: boolean;
  publishDate: string;
  previousStorageHashes: string[];
  tags: string;
}

export interface UserInfo {
  avatar: string;
  headerImage: string;
  about: string;
}

export interface UserInfoContractData {
  walletAddress: string;
  dataStorageHash: string;
}

export interface UserInfoState {
  loading: boolean;
  data: UserInfoContractData & UserInfo;
  error?: string;
}

export interface ToastNotification {
  color: 'green-500' | 'red-500';
  message: string;
}
