import {PropsWithChildren, ReactEventHandler} from 'react';

export type Comment = {
    id: number,
    comment: string,
    commentedBy: string,
    identity?: string
};

export type Theme = [background: string, primary: string, text: string];

export type ButtonProps = {
    disabled?: boolean;
    onClick?: ReactEventHandler;
} & PropsWithChildren

export type BlogPost = {
    coverImage: Blob | null;
    title: string;
    content: string;
    publisher: string;
    createdDate: string;
    id: number;
    storageHash: string;
    isPublished: boolean;
    publishDate: string;
    previousStorageHashes: string[];
    tags: string;
}

export type UserInfo = {
    avatar: Blob | null;
    about: string;
    headerImage: Blob | null;
}

export type ToastNotification = {
    color: 'green-500' | 'red-500';
    message: string;
}
