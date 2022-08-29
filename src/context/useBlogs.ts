import {useState} from 'react';
import {BlogContract} from '../@types/enums';
import {Blog, BlogContractData, BlogsState} from '../@types/interfaces';
import utils from './utils';

const useBlogs = () => {
    const [blogs, setBlogs] = useState<BlogsState>({
        loading: true,
        data: []
    });

    const getAllBlogs = async () => {
        setBlogs((prev) => ({...prev, loading: true}));

        const {data}: { data: any[] } = await window.point.contract.call({
            contract: BlogContract.name,
            method: BlogContract.getAllBlogs
        });
        const blogs = await Promise.all(
            data.map(async (contractData) => {
                const [
                    id,
                    storageHash,
                    isPublished,
                    publishDate,
                    previousStorageHashes,
                    tags
                ] = contractData;
                const data = await utils.getDataFromStorage(storageHash);
                return {
                    ...data,
                    id,
                    storageHash,
                    isPublished,
                    publishDate,
                    tags,
                    previousStorageHashes: previousStorageHashes.reverse()
                } as Blog & BlogContractData;
            })
        );
        setBlogs({loading: false, data: blogs});
    };

    const getDeletedBlogs = async () => {
        const {data}: { data: any[] } = await window.point.contract.call({
            contract: BlogContract.name,
            method: BlogContract.getDeletedBlogs
        });
        const blogs = await Promise.all(
            data.map(async (contractData) => {
                const [id, storageHash, isPublished, publishDate] = contractData;
                const data = await utils.getDataFromStorage(storageHash);
                return {...data, id, storageHash, isPublished, publishDate} as Blog &
          BlogContractData;
            })
        );
        return blogs;
    };

    return {blogs, getAllBlogs, getDeletedBlogs};
};

export default useBlogs;
