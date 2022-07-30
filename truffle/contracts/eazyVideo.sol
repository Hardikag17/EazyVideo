// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "./SubsNFT.sol";

/** @title eazyVideo
 * @notice It is a contract for managing eazyVideo platform
 */

contract EazyVideo is eazyVideoNFTContract {
    
    // For only service providers
    struct Service {
        string name;
        string ImageUri;
        string description;
        uint64 planDuration;
        uint256 price;
    }
    
    // 2 - For Service provider, 1 - For a User
    mapping(address => uint256) public accountType;

    
    mapping(address => Service) public services;
    mapping(address => Service[]) public userAvailablePlans;
    mapping(address => Service[]) public userForLendPlans;

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
        addToPlatform(_accountType);
        return "Account Created";
    }

    function addToPlatform(uint256 _accountType) internal {
        accountType[msg.sender] = _accountType;
        
        // serviceProvider
        if (_accountType == 2) {
            services[msg.sender] = Service({
                    name: "",
                    ImageUri: "",
                    description: "",
                    planDuration: 0,
                    price: 0
                });
        }
    }

    function updateService(
        string memory _name,
        string memory _ImageUri,
        string memory _description,
        uint64 _planDuration,
        uint256 _planPrice
    ) public onlyServiceProvider {
        services[msg.sender] = Service({
            name: _name,
            ImageUri: _ImageUri,
            description: _description,
            planDuration: _planDuration,
            price: _planPrice
        });
    }

    /**
     * @notice method to buy service from service providers
     */
    function BuyServiceFromServiceProvider(
        address _serviceProviderWallet
    ) public payable onlyUser {
        Service storage service = services[
            _serviceProviderWallet
        ];

        string memory _name = service.name;
        string memory _ImageUri = service.ImageUri;
        uint64 _time = uint64(block.timestamp) + service.planDuration;
        uint256 _price = service.price;
        string memory _description = service.description;

        payable(_serviceProviderWallet).transfer(_price);

        // Mint a expirable NFT
        mintNFT(
            _name,
            _ImageUri,
            _description,
            service.planDuration,
            _time,
            _price,
            msg.sender,
            _serviceProviderWallet
        );
    }

    /**
     * @notice method to lend the nfts for rents in thier profile by giving the time lending for
     * User can’t rent a nft for time more than he owns it - This requires a check from a nft metadata
     */
    function LendPlan(
        uint256 _price,
        uint256 _days,
        string memory _name
    ) public onlyUser {
        Service[] storage user = userAvailablePlans[msg.sender];
        Service storage ForLendPlan = userForLendPlans[msg.sender].push();
        for (uint256 i = 0; i < user.length - 1; i++) {
            if (strcmp(user[i].name, _name)) {
                ForLendPlan.price = _price;
                ForLendPlan.name = _name;
                ForLendPlan.ImageUri = user[i].ImageUri;
                ForLendPlan.description = user[i].description;
                ForLendPlan.planDuration = uint64(_days);

                if (user.length < 2) {
                    delete user[i];
                } else {
                    user[i] = user[
                        user.length - 1
                    ];
                }
            }
        }
    }

    /**
     * @notice This method can be called by only a user wallet address to rent the
     * available nfts by giving the days user is renting it for and giving the amount to
     * the nft owner
     */
    function RentPlan(
        uint256 tokenID,
        uint256 _amount,
        uint64 _days // _days multiplied by per day amount is total amount
    ) public payable onlyUser {
        // check owner
        //check lend details fulfillment
        // tranfer the amount to the owner
        rentNFT(tokenID, _days, _amount);
    }


    function getServiceByAddress() public view returns (Service memory){
        return services[msg.sender];
    }

}