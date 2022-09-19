// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 public tokenCount;

    constructor() ERC721("NFT", "NFT") {}

    function mint(string memory _tokenURI) public returns (uint256) {
         tokenCount++;
         _mint(msg.sender, tokenCount);
         _setTokenURI(tokenCount, _tokenURI);

         return tokenCount;
    }
}