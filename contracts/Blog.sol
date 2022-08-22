// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract Blog is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using Counters for Counters.Counter;
    Counters.Counter private numBlogPosts;
    Counters.Counter internal commentIds;

    struct UserInfo {
        address walletAddress;
        string dataStorageHash;
    }

    struct Comment {
        uint256 id;
        address commentedBy;
        string comment;
    }

    struct BlogPost {
        uint256 id;
        string storageHash;
        bool isPublished;
        string publishDate;
        string[] previousStorageHashes;
    }

    UserInfo user;
    BlogPost[] blogPosts;
    BlogPost[] deletedBlogPosts;

    mapping(uint256 => Comment[]) commentsByBlogPostId;
    mapping(uint256 => address[]) likesByBlogPostId;

    address[] followers;
    address[] emailSubscribers;

    function initialize() public initializer onlyProxy {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    // User Info methods
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

    // Blog Post methods
    function getAllBlogs() public view returns (BlogPost[] memory) {
        return blogPosts;
    }

    function getDeletedBlogs()
        public
        view
        onlyOwner
        returns (BlogPost[] memory)
    {
        return deletedBlogPosts;
    }

    function addBlog(
        string calldata _storageHash,
        bool _isPublished,
        string calldata _publishDate
    ) public payable onlyOwner {
        string[] memory _previousStorageHashes;
        numBlogPosts.increment();
        BlogPost memory blog = BlogPost({
            id: numBlogPosts.current(),
            storageHash: _storageHash,
            isPublished: _isPublished,
            publishDate: _publishDate,
            previousStorageHashes: _previousStorageHashes
        });
        blogPosts.push(blog);
    }

    function editBlog(
        uint256 id,
        string calldata _storageHash,
        string calldata _publishDate
    ) public payable onlyOwner {
        uint256 index = _getBlogIndexById(id);
        blogPosts[index].previousStorageHashes.push(
            blogPosts[index].storageHash
        );
        blogPosts[index].storageHash = _storageHash;
        blogPosts[index].publishDate = _publishDate;
    }

    function deleteBlog(uint256 _id) public payable onlyOwner {
        uint256 requiredBlogIndex = _getBlogIndexById(_id);
        deletedBlogPosts.push(blogPosts[requiredBlogIndex]);
        for (uint256 i = requiredBlogIndex; i < blogPosts.length - 1; i++) {
            blogPosts[i] = blogPosts[i + 1];
        }
        blogPosts.pop();
    }

    function publish(uint256 _id) public payable onlyOwner {
        uint256 requiredBlogIndex = _getBlogIndexById(_id);
        BlogPost storage requiredBlog = blogPosts[requiredBlogIndex];
        requiredBlog.isPublished = true;
    }

    function unpublish(uint256 _id) public payable onlyOwner {
        uint256 requiredBlogIndex = _getBlogIndexById(_id);
        BlogPost storage requiredBlog = blogPosts[requiredBlogIndex];
        requiredBlog.isPublished = false;
    }

    // Comment methods
    function getCommentsForBlogPost(uint256 _id)
        public
        view
        returns (Comment[] memory)
    {
        return commentsByBlogPostId[_id];
    }

    function addCommentToBlogPost(uint256 _id, string calldata _comment)
        public
        payable
    {
        Comment memory comment = Comment({
            id: commentIds.current(),
            commentedBy: msg.sender,
            comment: _comment
        });
        commentsByBlogPostId[_id].push(comment);
        commentIds.increment();
    }

    function editCommentForBlogPost(
        uint256 _blogId,
        uint256 _commentId,
        string calldata _comment
    ) public payable {
        for (uint256 i = 0; i < commentsByBlogPostId[_blogId].length; i++) {
            if (commentsByBlogPostId[_blogId][i].id == _commentId) {
                if (
                    commentsByBlogPostId[_blogId][i].commentedBy != msg.sender
                ) {
                    revert("You cannot edit somebody else's comment");
                }
                commentsByBlogPostId[_blogId][i].comment = _comment;
                break;
            }
        }
    }

    function deleteCommentForBlogPost(uint256 _blogId, uint256 _commentId)
        public
        payable
    {
        uint256 index;
        for (uint256 i = 0; i < commentsByBlogPostId[_blogId].length; i++) {
            if (commentsByBlogPostId[_blogId][i].id == _commentId) {
                if (
                    commentsByBlogPostId[_blogId][i].commentedBy != msg.sender
                ) {
                    revert("You cannot delete somebody else's comment");
                }
                index = i;
                break;
            }
        }
        for (
            uint256 i = index;
            i < commentsByBlogPostId[_blogId].length - 1;
            i++
        ) {
            commentsByBlogPostId[_blogId][i] = commentsByBlogPostId[_blogId][
                i + 1
            ];
        }
        commentsByBlogPostId[_blogId].pop();
    }

    // Likes methods
    function getLikesForBlogPost(uint256 _id)
        public
        view
        returns (address[] memory)
    {
        return likesByBlogPostId[_id];
    }

    function likeBlogPost(uint256 _id) public payable {
        for (uint256 i = 0; i < likesByBlogPostId[_id].length; i++) {
            if (likesByBlogPostId[_id][i] == msg.sender) {
                revert("You have already liked the blog");
            }
        }
        likesByBlogPostId[_id].push(msg.sender);
    }

    function unlikeBlogPost(uint256 _id) public payable {
        uint256 index;
        for (uint256 i = 0; i < likesByBlogPostId[_id].length; i++) {
            if (likesByBlogPostId[_id][i] == msg.sender) {
                index = i;
                break;
            }
        }
        for (uint256 i = index; i < likesByBlogPostId[_id].length - 1; i++) {
            likesByBlogPostId[_id][i] = likesByBlogPostId[_id][i + 1];
        }
        likesByBlogPostId[_id].pop();
    }

    // Followers methods
    function getNumFollowers() public view returns (uint256) {
        return followers.length;
    }

    function isFollowing() public view returns (bool) {
        for (uint256 i = 0; i < followers.length; i++) {
            if (followers[i] == msg.sender) return true;
        }
        return false;
    }

    function follow() public payable {
        for (uint256 i = 0; i < followers.length; i++) {
            if (followers[i] == msg.sender)
                revert("Already following the blog");
        }
        followers.push(msg.sender);
    }

    function unfollow() public payable {
        int256 index = -1;
        for (uint256 i = 0; i < followers.length; i++) {
            if (followers[i] == msg.sender) {
                index = int256(i);
                break;
            }
        }
        if (index == -1) revert("You are not following already");
        for (uint256 i = uint256(index); i < followers.length - 1; i++) {
            followers[i] = followers[i + 1];
        }
        followers.pop();
    }

    // Email Subscribers methods
    function isSubscribedToEmails() public view returns (bool) {
        for (uint256 i = 0; i < emailSubscribers.length; i++) {
            if (emailSubscribers[i] == msg.sender) return true;
        }
        return false;
    }

    function subscribeToEmails() public payable {
        for (uint256 i = 0; i < emailSubscribers.length; i++) {
            if (emailSubscribers[i] == msg.sender)
                revert("Already subscribed to email notifications");
        }
        emailSubscribers.push(msg.sender);
    }

    function unsubscribeToEmails() public payable {
        int256 index = -1;
        for (uint256 i = 0; i < emailSubscribers.length; i++) {
            if (emailSubscribers[i] == msg.sender) {
                index = int256(i);
                break;
            }
        }
        if (index == -1) revert("You are not subscribed to emails");
        for (uint256 i = uint256(index); i < emailSubscribers.length - 1; i++) {
            emailSubscribers[i] = emailSubscribers[i + 1];
        }
        emailSubscribers.pop();
    }

    // Helpers
    function _getBlogIndexById(uint256 _id) private view returns (uint256) {
        uint256 index;
        for (uint256 i = 0; i < blogPosts.length; i++) {
            if (blogPosts[i].id == _id) {
                index = i;
                break;
            }
        }
        return index;
    }
}
