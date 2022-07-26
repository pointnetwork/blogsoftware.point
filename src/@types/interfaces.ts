import { Dispatch, ReactEventHandler, SetStateAction } from 'react';

export interface ButtonProps {
  children: string;
  disabled?: boolean;
  onClick?: ReactEventHandler;
}

export interface AppContentInterface {
  blogs: Blog[];
  setBlogs: Dispatch<SetStateAction<Blog[]>>;
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
