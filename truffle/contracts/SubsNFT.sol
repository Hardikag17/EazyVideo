// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC4907.sol";

contract eazyVideoNFTContract is ERC4907, ReentrancyGuard {
    using Counters for Counters.Counter;

    address payable owner;

    mapping(uint256 => address payable) nftOwner;

    Counters.Counter tID;

    Counters.Counter public totalTokensMinted;

    address private ERC4907ContractAddress;

    constructor() ERC4907() {
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
        address payable serviceProvider;
    }

    mapping(uint256 => NFTItem) public idToNftItem;
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
    ) public nonReentrant {
        require(_price > 0, "Price must be at least 1 wei");
        tID.increment();
        uint256 tokenID = tID.current();

        // Service provider approveforAll allow msg.sender 

        _mint(owner, tokenID);
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
        uint64 _days,
        uint256 _amount
    ) public payable {
        setUser(tokenID, msg.sender, _days);
        payable(idToNftItem[tokenID].owner).transfer(_amount);
        idToNftItem[tokenID].owner = payable(msg.sender);
    }

    function fetchAllUserNFTItems() public view returns (NFTItem[] memory) {
        return userNFTItem[msg.sender];
    }
}
