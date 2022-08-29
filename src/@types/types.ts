export type EditBlogContractParams = [
  id: number,
  _storageHash: string,
  _publishDate: string,
  _tags: string
];

export type AddBlogContractParams = [
  _storageHash: string,
  _isPublished: boolean,
  _publishDate: string,
  _tags: string
];

export type Comment = [
  id: string,
  comment: string,
  commentedBy: string,
  identity?: string
];

export type Theme = [background: string, primary: string, text: string];
