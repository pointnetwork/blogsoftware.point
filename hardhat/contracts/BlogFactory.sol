// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./Blog.sol";

// TODO: Transfer the ownership of the deployed Blog contract
contract BlogFactory is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    mapping(address => Blog) private deployedBlogs;

    function initialize() public initializer onlyProxy {
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function createBlog() public {
        address _blogOwner = msg.sender;
        require(
            address(deployedBlogs[_blogOwner]) == address(0),
            "Blog Contract already deployed for user"
        );
        Blog blog = new Blog();
        blog.transferOwnership(_blogOwner);
        deployedBlogs[_blogOwner] = blog;
    }

    function isBlogCreated(address _blogOwner) public view returns (Blog) {
        return deployedBlogs[_blogOwner];
    }
}
