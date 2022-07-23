// SPDX-License-Identifier: MIT
pragma solidity >0.5.2 <=0.8.14;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC4907.sol";

contract eazyVideoNFTContract is ERC4907, ReentrancyGuard {
    using Counters for Counters.Counter;

    address owner;

    mapping(uint256 => address payable) nftOwner;

    Counters.Counter tID;

    uint256 public totalTokensMinted;

    constructor() ERC4907("eazyVideo", "eazy") {
        owner = payable(msg.sender);
    }

    mapping(address => mapping(uint256 => bool)) private isOwner;

    struct NFTItem {
        string serviceName;
        string ImageUri;
        string description;
        uint256 duration;
        uint256 endTime;
        string price;
        address payable owner;
        address payable srviceProvider;
    }

    mapping(uint256 => NFTItem) private idToNftItem;

    function mintNFT(
        string memory _serviceName,
        string memory _imageUri,
        string memory _description,
        string memory _endTime,
        string memory _price,
        address _owner,
        address _serviceProvider
    ) public payable nonReentrant {
        tID.increment();
        uint256 tokenID = tID.current();
        _mint(msg.sender, tokenID);

        idToNftItem[tokenID] = NFTItem(
            _serviceName,
            _imageUri,
            _description,
            _endTime,
            _price,
            payable(_owner),
            payable(_serviceProvider)
        );
    }
}
