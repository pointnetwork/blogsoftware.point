export enum BlogContract {
  name = 'Blog',
  getAllBlogs = 'getAllBlogs',
  getDeletedBlogs = 'getDeletedBlogs',
  addBlog = 'addBlog',
  editBlog = 'editBlog',
  deleteBlog = 'deleteBlog',
  publish = 'publish',
  unpublish = 'unpublish',
  getUserInfo = 'getUserInfo',
  saveUserInfo = 'saveUserInfo',
}

export enum BlogFactoryContract {
  name = 'BlogFactory',
  createBlog = 'createBlog',
  isBlogCreated = 'isBlogCreated',
}

export enum RoutesEnum {
  home = '/',
  blog = '/blog/:id',
  admin = '/admin',
  create = '/create',
  edit = '/edit/:id',
  install = '/install',
  profile = '/profile',
  edit_profile = '/edit_profile',
}
