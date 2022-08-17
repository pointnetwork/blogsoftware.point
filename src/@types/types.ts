export type EditBlogContractParams = [
  id: number,
  _storageHash: string,
  _publishDate: string
];

export type AddBlogContractParams = [
  _storageHash: string,
  _isPublished: boolean,
  _publishDate: string
];

export type Comment = [id: string, comment: string, commentedBy: string];
