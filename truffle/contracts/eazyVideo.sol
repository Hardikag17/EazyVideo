// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import {ERC721} from "./nft.sol";

/** @title eazyVideo
 * @notice It is a contract for managing eazyVideo platform
 */

contract EazyVideo {
    // For only service providers

    struct Service {
        string name;
        uint256 description;
        uint256 planDuration;
        string[] tokenIDs;
        uint256 price;
    }

    // For user type
    struct User {
        // Plan nfts of users
        Plan[] availablePlans;
        // For Lend nfts of users that are available for rent for a specific time.
        ForLend[] forLendPlans;
    }

    struct Plan {
        string tokenID;
        string name;
        uint256 description;
        uint256 duration;
        uint256 endDate;
    }

    struct ForLend {
        string tokenID;
        string name;
        uint256 description;
        uint256 duration;
        uint256 endDate;
        uint256 amount;
    }

    Service[] services;
    User[] users;

    // True for Service provider, False for a User
    mapping(address => bool) accountType;
    // user wallet address to user array index
    mapping(address => uint256) userToId;
    //service provider wallet address to index in services array
    mapping(address => uint256) serviceProviderToId;

    /**
     * @notice modifier to check if user is valid
     */
    modifier onlyUser() {
        require(
            userToId[msg.sender] <= users.length,
            "User does not exist in the pool"
        );
        _;
    }

    /**
     * @notice modifier to check if service provider is valid
     */
    modifier onlyServiceProvider() {
        require(
            serviceProviderToId[msg.sender] <= services.length,
            "Service Provider does not exist in the pool"
        );
        _;
    }

    function addToPlatform(bool _accountType) public {
        require(userToId[msg.sender] < users.length, "User already exists");
        require(
            serviceProviderToId[msg.sender] < users.length,
            "User is already a service provider"
        );

        accountType[msg.sender] = _accountType;

        //user
        if (_accountType == false) {
            users.push(User({availablePlans: [""], forLendPlans: [""]}));
            userToId[msg.sender] = users.length - 1;
        }
        // serviceProvider
        if (_accountType == true) {
            services[serviceProviderToId[msg.sender]] = services.push(
                Service()
            );
            serviceProviderToId[msg.sender] = services.length - 1;
        }
    }

    function addServiceToPlatform(
        string memory _name,
        string memory _description,
        uint256 _planDuration,
        uint256 _planPrice
    ) public {
        require(
            accountType(msg.sender),
            "You are not a registered service provider"
        );
        services[serviceProviderToId[msg.sender]] = Service({
            name: _name,
            description: _description,
            planDuration: _planDuration,
            tokenIDs: [],
            price: _planPrice
        });
    }

    /**
     * @notice method to upadate listed service details by service providers
     */
    function updateService() public onlyServiceProvider {}

    /**
     * @notice method to buy service from service providers
     */
    function BuyServiceFromServiceProvider(
        string memory _nftName,
        string memory _serviceName,
        address _serviceProviderWallet,
        address _uri
    ) public onlyUser {
        Service storage service = services[
            serviceProviderToId[_serviceProviderWallet]
        ];

        uint256 _time = block.timestamp + service._planDuration;
        uint256 _price = service.price;
        string memory _description = service._description;

        address(_serviceProviderWallet).transfer(service._price);
        ERC721.mintNFT(_nftName, _price, msg.sender, _uri, _description, _time);

        // service.tokenIDs.push(_tokenID);
        // userToId[msg.sender].tokenID = _tokenID;
    }

    /**
     * @notice method to lend the nfts for rents in thier profile by giving the time lending for
     * User can’t rent a nft for time more than he owns it - This requires a check from a nft metadata
     */
    function LendPlan(
        uint256 _amount,
        uint256 _days,
        string memory _tokenID
    ) public onlyUser returns (bool) {
        User storage user = users[userToId[msg.sender]];
        //Plan[] availablePlans;
        //ForLend[] forLendPlans;
        ForLend storage ForLendPlan;
        for (int256 i = 0; i < user.availablePlans.length - 1; i++) {
            if (user.availablePlans[i].tokenID == _tokenID) {
                ForLendPlan.amount = _amount;
                ForLendPlan.description = user.availablePlans[i].description;
                require(
                    user.availablePlans[i].endDate <= block.timestamp + _days,
                    " Can not lend for this many days"
                );
                ForLendPlan.duration = _days * 1 days;
                ForLendPlan.endDate =
                    (block.timestamp * 1 days) +
                    ForLendPlan.duration;
                ERC721._burn(user.availablePlans[i].tokenID);
                if (user.availablePlans.length < 2) {
                    user.availablePlans.length = 0;
                } else {
                    user.availablePlans[i] = user.availablePlans[
                        user.availablePlans.length - 1
                    ];
                }
            }
        }
        user.forLendPlans.push(ForLendPlan);
    }

    /**
     * @notice This method can be called by only a user wallet address to rent the
     * available nfts by giving the days user is renting it for and giving the amount to
     * the nft owner
     */
    function RentPlan(
        address _seller,
        uint256 _amount,
        uint256 _days, // _days multiplied by per day amount is total amount
        string memory _name,
        string memory _uri
    ) public onlyUser {
        User storage seller = users[userToId[_seller]];
        for (int256 i = 0; i < seller.forLendPlans; i++) {
            if (seller.forLendPlans[i].name == _name) {
                require(
                    seller.forLendPlans[i].tokenID == 0,
                    "Seller already rent this plan to seomeone else"
                );
                uint256 _price = (seller.forLendPlans[i].amount) * _days;
                address(_seller).transfer(_price);

                ERC721.mintNFT(
                    _name,
                    _price,
                    msg.sender,
                    _uri,
                    seller.forLendPlans[i].description,
                    block.timestamp + _days
                );
            }
        }
    }

    function getUserAvailablePlans() public returns (Plan calldata) {
        User storage user = users[userToId[msg.sender]];
        return user.availablePlans;
    }

    function getUserForLendPlans() public returns (Plan calldata) {
        User storage user = users[userToId[msg.sender]];
        return user.forLendPlans;
    }

    function getUserService() public returns (Service calldata) {
        Service storage serviceProvider = services[
            serviceProviderToId[msg.sender]
        ];
        return serviceProvider;
    }
}
