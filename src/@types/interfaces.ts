import { Dispatch, ReactEventHandler, SetStateAction } from 'react';

export interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: ReactEventHandler;
}

export interface AppContentInterface {
  loading: boolean;
  isOwner: boolean;
  userInfo: UserInfoState;
  getUserInfo: () => void;
  blogs: BlogsState;
  setBlogs: Dispatch<SetStateAction<BlogsState>>;
  getAllBlogs: () => void;
  getDeletedBlogs: () => Promise<(Blog & BlogContractData)[]>;
  identity: string;
  walletAddress: string;
}

export interface BlogsState {
  loading: boolean;
  data: (Blog & BlogContractData)[];
  error?: string;
}

export interface Blog {
  coverImage: string | ArrayBuffer | null;
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
}

export interface UserInfo {
  avatar: string;
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
