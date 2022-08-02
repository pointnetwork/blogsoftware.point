import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BlogPreviewItem from '../components/BlogPreviewItem';
import Header from '../components/Header';
import IdentityInfo from '../components/IdentityInfo';
import Loader from '../components/Loader';
import { PrimaryButton } from '../components/Button';
import { useAppContext } from '../context/AppContext';
import { Blog, BlogContractData } from '../@types/interfaces';
import { RoutesEnum } from '../@types/enums';
import PageLayout from '../layouts/PageLayout';

enum BlogFilterOptions {
  Published = 'Published',
  Drafts = 'Drafts',
  Trash = 'Trash',
}

const emptyMessages = {
  [BlogFilterOptions.Published]: 'You have not published any blogs yet.',
  [BlogFilterOptions.Drafts]: `You have not created any drafts yet.`,
  [BlogFilterOptions.Trash]: `Trash is empty.`,
};

const FilterOption = ({
  children,
  filter,
  onClick,
}: {
  children: string;
  filter: string;
  onClick: any;
}) => (
  <div
    id={children}
    className={`mr-6 font-medium cursor-pointer border-b-2 border-transparent pb-2 ${
      filter === children
        ? 'text-indigo-500 border-b-indigo-500'
        : 'text-gray-400 hover:text-gray-800'
    }`}
    onClick={onClick}
  >
    {children}
  </div>
);

const Admin = () => {
  const { blogs, getDeletedBlogs } = useAppContext();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<(Blog & BlogContractData)[]>([]);
  const [filter, setFilter] = useState<keyof typeof BlogFilterOptions>(
    BlogFilterOptions.Published
  );

  useEffect(() => {
    (async () => {
      switch (filter) {
        case BlogFilterOptions.Published:
          setData(blogs.data.filter((d) => d.isPublished));
          break;
        case BlogFilterOptions.Drafts:
          setData(blogs.data.filter((d) => !d.isPublished));
          break;
        case BlogFilterOptions.Trash:
          setLoading(true);
          setData(await getDeletedBlogs());
          setLoading(false);
          break;
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, blogs.data]);

  const handleFilterChange = (e: any) => {
    setFilter(e.target.id);
  };

  return (
    <PageLayout>
      <div className='h-screen overflow-hidden'>
        <Header />
        <main
          className='flex mt-4 mx-auto'
          style={{ maxWidth: '1000px', height: window.screen.height - 220 }}
        >
          <div className='flex-1 border-r'>
            <div className='flex items-center justify-between mr-5'>
              <h2 className='text-3xl font-bold'>Your Blogs</h2>
              <PrimaryButton onClick={() => navigate(RoutesEnum.create)}>
                Create New Blog
              </PrimaryButton>
            </div>
            <div className='mt-4 mb-2 flex items-center text-sm border-b border-gray-200'>
              <FilterOption filter={filter} onClick={handleFilterChange}>
                {BlogFilterOptions.Published}
              </FilterOption>
              <FilterOption filter={filter} onClick={handleFilterChange}>
                {BlogFilterOptions.Drafts}
              </FilterOption>
              <FilterOption filter={filter} onClick={handleFilterChange}>
                {BlogFilterOptions.Trash}
              </FilterOption>
            </div>
            <div
              className='overflow-y-scroll pr-6'
              style={{ height: window.screen.height - 300 }}
            >
              {loading || blogs.loading ? (
                <Loader>Loading Blogs...</Loader>
              ) : data.length ? (
                data.map((blog, i) => (
                  <BlogPreviewItem
                    deleted={filter === BlogFilterOptions.Trash}
                    data={blog}
                    admin
                    key={i}
                  />
                ))
              ) : (
                <div className='font-medium pt-2 text-gray-500'>
                  <p className='text-2xl'>{emptyMessages[filter]}</p>
                </div>
              )}
            </div>
          </div>
          <div className='basis-72 flex flex-col overflow-y-scroll px-8 -mr-4'>
            <h2 className='text-3xl font-bold mb-6'>Your Profile</h2>
            <IdentityInfo admin />
          </div>
        </main>
      </div>
    </PageLayout>
  );
};

export default Admin;
