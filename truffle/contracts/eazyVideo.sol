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
        require(!userToId[msg.sender], "User already exists");
        require(
            !serviceProviderToId[msg.sender],
            "User is already a service provider"
        );

        accountType[msg.sender] = _accountType;

        //user
        if (_accountType == false) {
            users.push(User({availablePlans: [], forLendPlans: []}));
            userToId[msg.sender] = users.length - 1;
        }
        // serviceProvider
        if (__accountType == true) {
            serviceProviderToId[msg.sender] = services.push(
                ServiceProvider({
                    name: _name,
                    description: _description,
                    planDuration: planDuration1,
                    tokenIDs: [],
                    price: planPrice
                })
            );
            serviceProviderToId[msg.sender] = services.length - 1;
        }
    }

    /**
     * @notice method to upadate listed service details by service providers
     */
    function updateService() public onlyServiceProvider {}

    /**
     * @notice method to buy service from service providers
     */
    function BuyServiceFromServiceProvider(
        string _serviceName,
        address _serviceProviderWallet
    ) public onlyUser {
        ServiceProvider storage service = services[
            serviceProviderToId[_serviceProviderWallet]
        ];

        uint256 _time = block.timestamp + service._planDuration;
        uint256 price = service._price;
        string memory _description = service._description;

        address(_serviceProviderWallet).transfer(service._price);
        mintNFT(_nftName, _price, msg.sender, _tokenID, _description, _time);

        service.tokenIDs.push(_tokenID);
        userToId[msg.sender].tokenID = _tokenID;
    }

    /**
     * @notice method to lend the nfts for rents in thier profile by giving the time lending for
     * User can’t rent a nft for time more than he owns it - This requires a check from a nft metadata
     */
    function LendPlan(
        uint256 _amount,
        uint256 _days,
        string _tokenID
    ) public onlyUser returns (bool) {
        User storage user = users[userToId[msg.sender]];
        //Plan[] availablePlans;
        //ForLend[] forLendPlans;
        ForLend ForLendPlan;
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
                    ForlendPlan.duration;
                _burn(user.availablePlans[i].tokenID);
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
        string _name
    ) public onlyUser {
        User storage seller = userToId[_seller];
        for (int256 i = 0; i < seller.forLendPlans; i++) {
            if (seller.forLendPlans[i].name == _name) {
                require(
                    seller.forLendPlans[i].tokenID == 0,
                    "Seller already rent this plan to seomeone else"
                );
                uint256 _price = (seller.forLendPlans[i].amount) * _days;
                address(_seller).transfer(_price);

                mintNFT(
                    _name,
                    _price,
                    msg.sender,
                    _tokenID,
                    seller.forLendPlans[i].description,
                    block.timestamp + _days
                );
            }
        }
    }
}
