export enum BlogContract {
  name = 'Blog',
  getAllBlogs = 'getAllBlogs',
  getDeletedBlogs = 'getDeletedBlogs',
  addBlog = 'addBlog',
  deleteBlog = 'deleteBlog',
  publish = 'publish',
  unpublish = 'unpublish',
}

export enum BlogFactoryContract {
  name = 'BlogFactory',
  createBlog = 'createBlog',
  isBlogCreated = 'isBlogCreated',
}
