import { Dispatch, ReactEventHandler, SetStateAction } from 'react';

export interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: ReactEventHandler;
}

export interface AppContentInterface {
  blogs: (Blog & BlogContractData)[];
  setBlogs: Dispatch<SetStateAction<(Blog & BlogContractData)[]>>;
  getAllBlogs: () => void;
  identity: string;
  walletAddress: string;
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
}
