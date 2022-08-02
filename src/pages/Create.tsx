import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '../components/Header';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import EditIcon from '@mui/icons-material/Edit';
import {
  ErrorButton,
  OutlinedButton,
  PrimaryButton,
} from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { Blog } from '../@types/interfaces';
import { BlogContract, RoutesEnum } from '../@types/enums';
import PageLayout from '../layouts/PageLayout';
import { AddBlogContractParams, EditBlogContractParams } from '../@types/types';

const Create = ({ edit }: { edit?: boolean }) => {
  const navigate = useNavigate();
  const { walletAddress, blogs, getAllBlogs } = useAppContext();

  const [editId, setEditId] = useState<number | undefined>();
  const [loading, setLoading] = useState<boolean>(false);
  const [cover, setCover] = useState<string | ArrayBuffer | null>('');
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (edit && !blogs.loading) {
      const reqBlog = blogs.data.find(
        (blog) => blog.storageHash === window.location.pathname.slice(6)
      );
      setEditId(reqBlog!.id);
      setCover(reqBlog!.coverImage);
      setTitle(reqBlog!.title);
      setContent(reqBlog!.content);
    }
  }, [blogs, edit]);

  const handleFileInput = (e: any) => {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      setCover(e.target.result);
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSave = async (isPublished = true) => {
    setLoading(true);
    const now = dayjs().format('MMM DD, YYYY');

    const form = JSON.stringify({
      coverImage: cover,
      title,
      content,
      publisher: walletAddress,
      createdDate: now,
    } as Blog);
    const file = new File([form], 'blog.json', { type: 'application/json' });

    const formData = new FormData();
    formData.append('file', file);
    // Upload the File to arweave
    const res = await window.point.storage.postFile(formData);
    setLoading(false);
    // Save data to smart contract
    if (edit)
      await window.point.contract.send({
        contract: BlogContract.name,
        method: BlogContract.editBlog,
        params: [editId, res.data, now] as EditBlogContractParams,
      });
    else
      await window.point.contract.send({
        contract: BlogContract.name,
        method: BlogContract.addBlog,
        params: [res.data, isPublished, now] as AddBlogContractParams,
      });
    getAllBlogs();
    navigate(RoutesEnum.admin);
  };

  const handlePublish = () => handleSave();
  const handleSaveDraft = () => handleSave(false);

  return (
    <PageLayout>
      <Header />
      <main
        className='flex mx-auto pt-4 overflow-hidden'
        style={{ maxWidth: '1000px', height: window.screen.height - 276 }}
      >
        <div className='flex-1 pr-8 pl-1 mr-4 flex flex-col overflow-y-scroll'>
          <h3 className='text-lg font-bold mb-2'>Title</h3>
          <input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='p-1 rounded border border-gray-300 w-full'
          />
          <h3 className='text-lg font-bold mt-6 mb-2'>Content</h3>
          <ReactQuill
            className='h-full'
            theme='snow'
            value={content}
            onChange={setContent}
          />
        </div>
        <div className='basis-72'>
          <h3 className='text-lg font-bold mb-2'>Cover Image</h3>
          <div className='relative'>
            {cover ? (
              <div className='absolute -top-8 right-0 bg-white z-10 rounded-full border border-gray-500 w-6 h-6 flex items-center justify-center opacity-50 transition-all cursor-pointer hover:opacity-100'>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileInput}
                  className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
                />
                <EditIcon titleAccess='Edit' sx={{ height: 16, width: 16 }} />
              </div>
            ) : null}
            {cover ? (
              <img
                className='w-full h-full object-cover rounded mr-3 border-2 border-gray-200'
                src={cover.toString()}
                alt='cover for the blog'
              />
            ) : (
              <div className='relative w-full bg-gray-50 rounded h-48 mr-3 border-2 border-gray-200 flex flex-col items-center justify-center'>
                <ImageOutlinedIcon
                  sx={{ height: 56, width: 56 }}
                  color='disabled'
                  className='-mt-2'
                />
                <p className='text-gray-500 mt-1'>Select a Cover Image</p>
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleFileInput}
                  className='absolute w-full h-full top-0 left-0 opacity-0 cursor-pointer'
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <div className='mt-6 bg-white border-t border-gray-200 pt-3'>
        <div className='flex space-x-4 mx-auto' style={{ maxWidth: '1000px' }}>
          <PrimaryButton
            disabled={loading || (!edit && (!cover || !title || !content))}
            onClick={handlePublish}
          >
            {edit ? 'Update' : 'Publish'}
          </PrimaryButton>
          {!edit ? (
            <OutlinedButton
              disabled={!title || loading}
              onClick={handleSaveDraft}
            >
              Save Draft
            </OutlinedButton>
          ) : null}
          <ErrorButton disabled={loading} onClick={() => navigate(-1)}>
            Cancel
          </ErrorButton>
        </div>
      </div>
    </PageLayout>
  );
};

export default Create;
