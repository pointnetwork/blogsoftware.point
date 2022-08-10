// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import {ethers, upgrades} from 'hardhat';

async function main() {
    const BlogFactory = await ethers.getContractFactory('BlogFactory');
    const blogFactory = await upgrades.deployProxy(BlogFactory, [], {kind: 'uups'});
    await blogFactory.deployed();

    console.log('BlogFactory deployed to:', blogFactory.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
