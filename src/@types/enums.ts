export enum BlogContract {
  name = 'Blog',
  owner = 'owner',
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

export enum RoutesEnum {
  home = '/',
  blog = '/blog',
  admin = '/admin',
  create = '/create',
  edit = '/edit',
  profile = '/profile',
  edit_profile = '/edit_profile',
}
