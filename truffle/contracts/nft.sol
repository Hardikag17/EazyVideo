// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC4907.sol";

contract eazyVideoNFTContract is ERC4907, ReentrancyGuard {
    using Counters for Counters.Counter;

    address owner;

    mapping(uint256 => address payable) nftOwner;

    Counters.Counter tID;

    Counters.Counter public totalTokensMinted;

    constructor() ERC4907("eazyVideo", "eazy") {
        owner = payable(msg.sender);
    }

    struct NFTItem {
        string serviceName;
        string ImageUri;
        string description;
        uint256 duration;
        uint64 endTime;
        uint256 price;
        address payable owner;
        address payable srviceProvider;
    }

    mapping(uint256 => NFTItem) private idToNftItem;
    mapping(address => NFTItem[]) public userNFTItem;

    function mintNFT(
        string memory _serviceName,
        string memory _imageUri,
        string memory _description,
        uint64 _duration,
        uint64 _endTime,
        uint256 _price,
        address _owner,
        address _serviceProvider
    ) public payable nonReentrant {
        require(_price > 0, "Price must be at least 1 wei");
        tID.increment();
        uint256 tokenID = tID.current();
        _mint(_serviceProvider, tokenID);
        setUser(tokenID, msg.sender, _endTime);

        idToNftItem[tokenID] = NFTItem(
            _serviceName,
            _imageUri,
            _description,
            _duration,
            _endTime,
            _price,
            payable(_owner),
            payable(_serviceProvider)
        );

        userNFTItem[msg.sender].push(idToNftItem[tokenID]);
    }

    function rentNFT(
        uint256 tokenID,
        uint256 _amount,
        uint64 _days
    ) public payable nonReentrant {
        setUser(tokenID, msg.sender, _days);
        payable(idToNftItem[tokenID].owner).transfer(_amount);
        idToNftItem[tokenID].owner = payable(msg.sender);
    }

    function fetchAllUserNFTItems() public view returns (NFTItem[] memory) {
        return userNFTItem[msg.sender];
    }
}
