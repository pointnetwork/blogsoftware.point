// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

// This is an example contract. Please remove and create your own!
contract Blog is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    using Counters for Counters.Counter;

    struct BlogData {
        string storageHash;
        bool isPublished;
        string publishDate;
    }

    BlogData[] blogs;

    function initialize() public initializer onlyProxy {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function getAllBlogs() public view returns (BlogData[] memory) {
        return blogs;
    }

    function addBlog(
        string calldata _storageHash,
        bool _isPublished,
        string calldata _publishDate
    ) public payable onlyOwner {
        BlogData memory blog = BlogData({
            storageHash: _storageHash,
            isPublished: _isPublished,
            publishDate: _publishDate
        });
        blogs.push(blog);
    }
}
