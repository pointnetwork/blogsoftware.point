import { BlogPostStructOutput } from './../typechain-types/contracts/Blog';
import { expect } from 'chai';
import { ethers, upgrades } from 'hardhat';
import { Blog } from '../typechain-types';

/**
 * SIMPLE TEST SUITE
 *
 * 1. User Info
 *    Initally returns empty values for user info, blogs and deleted blogs
 *    Saves the user info and correctly returns it
 *
 * 2. Blog Posts (CRUD)
 *    Create two blog posts
 *    Expect both blog posts to be present
 *    Edit first blog post two times
 *    Expect two iterations for first blog post
 *    Publish/Unpublish the first blog post
 *    Delete first blog post
 *
 * 3. Likes (tested on second blog post and as visitor)
 *    Expect 0 likes on blog post initially
 *    Like blog post
 *    Expect 1 like on blog post
 *    Expect to throw on trying to like again
 *    Unlike blog post
 *    Expect 0 likes on blog post
 *
 * 4. Comments (tested on second blog post and as visitor)
 *    Expect 0 comments initially
 *    Add a comment to blog post
 *    Expect that comment to be in comments
 *    Edit that comment and expect success
 *    Delete the blog
 *    Again expect 0 comments
 */

enum StorageHashes {
  user_info = 'user-info-storage-hash',
  blog1 = 'blog-1-storage-hash',
  blog2 = 'blog-2-storage-hash',
}

describe('Blog contract', () => {
  let blog: Blog;
  let owner: string;
  let blogPost1: BlogPostStructOutput;
  let blogPost2: BlogPostStructOutput;

  before(async () => {
    const addresses = await ethers.getSigners();
    owner = await addresses[0].getAddress();

    const BlogFactory = await ethers.getContractFactory('Blog');
    blog = (await upgrades.deployProxy(BlogFactory, [], {})) as Blog;
    await blog.deployed();
  });

  describe('E2E Test', () => {
    describe('User info', () => {
      it('returns empty values for owner initially', async () => {
        const user = await blog.getUserInfo();
        expect(user.walletAddress).not.equal(owner);
      });

      it('saves the owner info and returns saved owner', async () => {
        await blog.saveUserInfo(owner, StorageHashes.user_info);
        const user = await blog.getUserInfo();
        expect(user.dataStorageHash).equal(StorageHashes.user_info);
        expect(user.walletAddress).equal(owner);
      });
    });

    describe('Blog Posts (CRUD)', () => {
      it('there are no blog posts for owner initially', async () => {
        expect((await blog.getAllBlogs()).length).equal(0);
      });

      it('there are no deleted blog posts for owner initially', async () => {
        expect((await blog.getDeletedBlogs()).length).equal(0);
      });

      it('saves two blog posts', () => {
        expect(
          blog.addBlog(StorageHashes.blog1, true, new Date().toUTCString())
        ).fulfilled;
        expect(
          blog.addBlog(StorageHashes.blog2, true, new Date().toUTCString())
        ).fulfilled;
      });

      it('fetches the saved blog posts', async () => {
        const blogPosts = await blog.getAllBlogs();
        blogPost1 = blogPosts[0];
        blogPost2 = blogPosts[1];
        expect(blogPost1[1]).equal(StorageHashes.blog1);
        expect(blogPost2[1]).equal(StorageHashes.blog2);
      });

      it('publishes the first blog post', async () => {
        expect(blog.publish(blogPost1[0])).fulfilled;
        const blogPosts = await blog.getAllBlogs();
        blogPost1 = blogPosts[0];
        expect(blogPost1[2]).true;
      });

      it('unpublishes the first blog post', async () => {
        expect(blog.unpublish(blogPost1[0])).fulfilled;
        const blogPosts = await blog.getAllBlogs();
        blogPost1 = blogPosts[0];
        expect(blogPost1[2]).false;
      });

      it('deletes the first blog post', async () => {
        expect(blog.deleteBlog(blogPost1[0])).fulfilled;
        const blogPosts = await blog.getAllBlogs();
        expect(blogPosts.map((post) => post[0]).includes(blogPost1[0])).false;
        blogPost1 = null;
      });
    });

    describe('Likes (tested on second blog post)', () => {
      it('expects 0 likes on blog post initially', async () => {
        expect((await blog.getLikesForBlogPost(blogPost2[0])).length).equal(0);
      });

      it('successfully likes the blog post', () => {
        expect(blog.likeBlogPost(blogPost2[0])).fulfilled;
      });

      it('expects 1 likes on blog post', async () => {
        const likes = await blog.getLikesForBlogPost(blogPost2[0]);
        expect(likes.length).equal(1);
        expect(likes.includes(owner)).true;
      });

      it('rejects when trying to add more than one like by same user', () => {
        expect(blog.likeBlogPost(blogPost2[0])).rejected;
      });

      it('successfully unlikes the blog post', () => {
        expect(blog.unlikeBlogPost(blogPost2[0])).fulfilled;
      });

      it('expects 0 likes on blog post', async () => {
        expect((await blog.getLikesForBlogPost(blogPost2[0])).length).equal(0);
      });
    });

    describe('Comments (tested on second blog post)', () => {
      it('expects 0 comments initially', async () => {
        expect((await blog.getCommentsForBlogPost(blogPost2[0])).length).equal(
          0
        );
      });

      it('successfully adds a comment to blog post', async () => {
        expect(blog.addCommentToBlogPost(blogPost2[0], 'This is a comment'))
          .fulfilled;
      });

      it('expects 1 comment on blog post', async () => {
        const blogPosts = await blog.getCommentsForBlogPost(blogPost2[0]);
        expect(blogPosts.length).equal(1);
      });
    });
  });
});
