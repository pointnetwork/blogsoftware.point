// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Blog is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private numBlogs;

    struct UserInfo {
        address walletAddress;
        string dataStorageHash;
    }
    UserInfo user;

    struct BlogData {
        uint256 id;
        string storageHash;
        bool isPublished;
        string publishDate;
        string[] previousStorageHashes;
    }
    BlogData[] blogs;
    BlogData[] deletedBlogs;

    function getUserInfo() public view returns (UserInfo memory) {
        return user;
    }

    function saveUserInfo(
        address _walletAddress,
        string calldata _dataStorageHash
    ) public payable {
        user = UserInfo({
            walletAddress: _walletAddress,
            dataStorageHash: _dataStorageHash
        });
    }

    function getAllBlogs() public view returns (BlogData[] memory) {
        return blogs;
    }

    function getDeletedBlogs()
        public
        view
        onlyOwner
        returns (BlogData[] memory)
    {
        return deletedBlogs;
    }

    function addBlog(
        string calldata _storageHash,
        bool _isPublished,
        string calldata _publishDate
    ) public payable onlyOwner {
        string[] memory _previousStorageHashes;
        numBlogs.increment();
        BlogData memory blog = BlogData({
            id: numBlogs.current(),
            storageHash: _storageHash,
            isPublished: _isPublished,
            publishDate: _publishDate,
            previousStorageHashes: _previousStorageHashes
        });
        blogs.push(blog);
    }

    function editBlog(
        uint256 id,
        string calldata _storageHash,
        string calldata _publishDate
    ) public payable onlyOwner {
        uint256 index = _getBlogIndexById(id);
        blogs[index].previousStorageHashes.push(blogs[index].storageHash);
        blogs[index].storageHash = _storageHash;
        blogs[index].publishDate = _publishDate;
    }

    function deleteBlog(uint256 _id) public payable onlyOwner {
        uint256 requiredBlogIndex = _getBlogIndexById(_id);
        deletedBlogs.push(blogs[requiredBlogIndex]);
        for (uint256 i = requiredBlogIndex; i < blogs.length - 1; i++) {
            blogs[i] = blogs[i + 1];
        }
        blogs.pop();
    }

    function publish(uint256 _id) public payable onlyOwner {
        uint256 requiredBlogIndex = _getBlogIndexById(_id);
        BlogData storage requiredBlog = blogs[requiredBlogIndex];
        requiredBlog.isPublished = true;
    }

    function unpublish(uint256 _id) public payable onlyOwner {
        uint256 requiredBlogIndex = _getBlogIndexById(_id);
        BlogData storage requiredBlog = blogs[requiredBlogIndex];
        requiredBlog.isPublished = false;
    }

    function _getBlogIndexById(uint256 _id) private view returns (uint256) {
        uint256 index;
        for (uint256 i = 0; i < blogs.length; i++) {
            if (blogs[i].id == _id) {
                index = i;
                break;
            }
        }
        return index;
    }
}
