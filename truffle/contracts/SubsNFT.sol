// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "./ERC4907.sol";

contract eazyVideoNFTContract is ERC4907 {
    address payable owner;

    mapping(uint256 => address payable) nftOwner;

    uint256 public tID;

    uint256 public totalTokensMinted;

    address private ERC4907ContractAddress;

    constructor() {
        owner = payable(msg.sender);
    }

    // For only service providers
    struct Service {
        uint256 serviceid;
        string name;
        string ImageUri;
        string description;
        uint64 planDuration;
        uint256 price;
        address payable serviceProvider;
    }

    // For every NFT Subscription Plan
    struct NFTItem {
        uint256 serviceid;
        string serviceName;
        string ImageUri;
        string description;
        uint256 duration;
        uint64 endTime;
        uint256 price;
        address payable owner;
        address payable serviceProvider;
    }

    // For Lending the NFT Subscription Plan
    struct Lend {
        uint256 tokenId;
        uint256 price;
        uint256 duration;
        address renter;
    }

    // 2 - For Service provider, 1 - For a User
    mapping(address => uint256) public accountType;

    mapping(uint256 => NFTItem) public idToNftItem;

    mapping(uint256 => Service) public services;
    mapping(address => uint256[]) public serviceProviderToIds;
    mapping(address => uint256[]) public userAvailablePlans;
    mapping(address => Lend[]) public userForLendPlans;

    Lend[] public forLendServices;
    uint256 public totalServices;
    uint256 public totalLendServices;

    /**
     * @notice modifier to check if user is valid
     */
    modifier onlyUser() {
        require(accountType[msg.sender] == 1, "Not a user");
        _;
    }

    /**
     * @notice modifier to check if service provider is valid
     */
    modifier onlyServiceProvider() {
        require(accountType[msg.sender] == 2, "Not a service Provider");
        _;
    }

    function memcmp(bytes memory a, bytes memory b)
        internal
        pure
        returns (bool)
    {
        return (a.length == b.length) && (keccak256(a) == keccak256(b));
    }

    function strcmp(string memory a, string memory b)
        internal
        pure
        returns (bool)
    {
        return memcmp(bytes(a), bytes(b));
    }

    function login(uint256 _accountType) public returns (string memory) {
        // SERVICE PROVIDER
        if (accountType[msg.sender] == 2) {
            return "SERVICE PROVIDER";
        }
        // USER
        else if (accountType[msg.sender] == 1) {
            return "USER";
        }

        accountType[msg.sender] = _accountType;
        return "Account Created";
    }

    function AddServiceToPlatform(
        string memory _name,
        string memory _ImageUri,
        string memory _description,
        uint64 _planDuration,
        uint256 _planPrice
    ) public onlyServiceProvider {
        services[totalServices] = Service({
            serviceid: totalServices,
            name: _name,
            ImageUri: _ImageUri,
            description: _description,
            planDuration: _planDuration,
            price: _planPrice,
            serviceProvider: payable(msg.sender)
        });

        serviceProviderToIds[msg.sender].push(totalServices);

        totalServices = totalServices + 1;
    }

    function BuyServiceFromServiceProvider(uint256 _serviceid)
        public
        payable
        onlyUser
    {
        Service storage service = services[_serviceid];

        uint64 _time = uint64(block.timestamp + service.planDuration);
        uint256 _price = service.price;

        require(_price == msg.value, "Please send the equivalent amount");
        service.serviceProvider.transfer(msg.value);

        // Mint a expirable NFT by setting approval for the contract address first
        mintNFT(
            _serviceid,
            service.name,
            service.ImageUri,
            service.description,
            service.planDuration,
            _time,
            _price,
            msg.sender,
            service.serviceProvider
        );

        userAvailablePlans[msg.sender].push(_serviceid);
    }

    function LendUserNFTPlan(
        uint256 _tokenId,
        uint256 _days,
        uint256 _amount
    ) public onlyUser {
        require(
            idToNftItem[_tokenId].owner == msg.sender,
            "You are not the owner of this token"
        );

        Lend storage newLendPlan = forLendServices.push();
        newLendPlan.tokenId = _tokenId;
        newLendPlan.price = _amount;
        newLendPlan.duration = block.timestamp + (_days * 24 * 60 * 60);
        newLendPlan.renter = address(0);

        userForLendPlans[msg.sender].push(newLendPlan);
        totalLendServices = totalLendServices + 1;

        // remove token from user availble plans

        uint256 removeIndex = 0;
        for (uint256 i = 0; i < userAvailablePlans[msg.sender].length; i++) {
            if (_tokenId == userAvailablePlans[msg.sender][i]) removeIndex = i;
        }

        for (
            uint256 i = removeIndex;
            i < userAvailablePlans[msg.sender].length - 1;
            i++
        ) {
            userAvailablePlans[msg.sender][i] = userAvailablePlans[msg.sender][
                i + 1
            ];
        }
        delete userAvailablePlans[msg.sender][
            userAvailablePlans[msg.sender].length - 1
        ];
    }

    function RentPlan(
        uint256 _tokenId,
        uint64 _days,
        uint256 _amount
    ) public {
        require(
            idToNftItem[_tokenId].owner != msg.sender,
            "You are already the owner of this token"
        );
        uint256 index;
        for (uint256 i = 0; i < totalLendServices; i++) {
            if (forLendServices[i].tokenId == _tokenId) index = i;
        }

        forLendServices[index].renter = msg.sender;

        // Now remove from user available services

        for (uint256 i = 0; i < totalLendServices; i++) {
            if (forLendServices[i].tokenId == _tokenId) index = i;
        }
        for (uint256 i = index; i < totalLendServices - 1; i++) {
            forLendServices[i] = forLendServices[i + 1];
        }
        delete forLendServices[totalLendServices - 1];

        rentNFT(_tokenId, _days, _amount);
    }

    function mintNFT(
        uint256 _serviceid,
        string memory _serviceName,
        string memory _imageUri,
        string memory _description,
        uint64 _duration,
        uint64 _endTime,
        uint256 _price,
        address _owner,
        address _serviceProvider
    ) public {
        require(_price > 0, "Price must be at least 1 wei");
        uint256 tokenID = tID;
        tID = tID + 1;
        totalTokensMinted = totalTokensMinted + 1;

        // Service provider approveforAll allow msg.sender

        _mint(msg.sender, tokenID);
        setApprovalForAll(address(this), true);
        setUser(tokenID, msg.sender, _endTime);

        idToNftItem[tokenID] = NFTItem({
            serviceid: _serviceid,
            serviceName: _serviceName,
            ImageUri: _imageUri,
            description: _description,
            duration: _duration,
            endTime: _endTime,
            price: _price,
            owner: payable(_owner),
            serviceProvider: payable(_serviceProvider)
        });

        userAvailablePlans[msg.sender].push(tokenID);
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

    // get functions for web3

    function getTotalServices() public view returns (uint256) {
        return totalServices;
    }

    function getNFTDetailsFromId(uint256 _tokenID)
        public
        view
        returns (NFTItem memory)
    {
        return idToNftItem[_tokenID];
    }

    function fetchAllUserAvailableNFTPlans()
        public
        view
        returns (uint256[] memory)
    {
        return userAvailablePlans[msg.sender];
    }

    function fetchAllUserLendNFTPlans() public view returns (Lend[] memory) {
        return userForLendPlans[msg.sender];
    }
}
