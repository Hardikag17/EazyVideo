// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./nft.sol";

/** @title eazyVideo
 * @notice It is a contract for managing eazyVideo platform
 */

contract EazyVideo {
    // For only service providers

    struct Service {
        string ImageUri;
        string name;
        uint256 description;
        uint256 planDuration;
        uint256 price;
    }

    // For user type
    struct User {
        // Plan nfts of users
        Service[] availablePlans;
        // For Lend nfts of users that are available for rent for a specific time.
        Service[] forLendPlans;
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
        require(accountType[msg.sender] == false, "Not a user");
        _;
    }

    /**
     * @notice modifier to check if service provider is valid
     */
    modifier onlyServiceProvider() {
        require(accountType[msg.sender] == true, "Not a service Provider");
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

    function login(bool _accountType) public returns (string memory) {
        // SERVICE PROVIDER
        if (accountType[msg.sender] == true) {
            return "SERVICE PROVIDER";
        }
        // USER
        else if (accountType[msg.sender] == false) {
            return "USER";
        } else {
            addToPlatform(_accountType);
        }
    }

    function addToPlatform(bool _accountType) internal {
        accountType[msg.sender] = _accountType;
        //user
        if (_accountType == false) {
            users.push(
                User({
                    availablePlans: new uint256[](0),
                    forLendPlans: new uint256[](0)
                })
            );
            userToId[msg.sender] = users.length;
        }
        // serviceProvider
        if (_accountType == true) {
            services[serviceProviderToId[msg.sender]] = services.push(
                Service({
                    name: "",
                    ImageUri: "",
                    description: "",
                    planDuration: "",
                    price: 0
                })
            );
            serviceProviderToId[msg.sender] = services.length;
        }
    }

    function updateService(
        string memory _name,
        string memory _ImageUri,
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
        string memory _serviceName,
        address _serviceProviderWallet
    ) public onlyUser {
        Service storage service = services[
            serviceProviderToId[_serviceProviderWallet]
        ];

        string memory _name = service.name;
        string memory _ImageUri = service.ImageUri;
        uint256 _time = block.timestamp + service._planDuration;
        uint256 _price = service.price;
        string memory _description = service._description;

        address(_serviceProviderWallet).transfer(service._price);

        // Mint a expirable NFT
        eazyVideoNFTContract.mintNFT(
            _name,
            _ImageUri,
            _description,
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
    ) public onlyUser returns (bool) {
        User storage user = users[userToId[msg.sender]];
        Service storage ForLendPlan;
        for (int256 i = 0; i < user.availablePlans.length - 1; i++) {
            if (strcmp(user.availablePlans[i].name, _name)) {
                ForLendPlan.price = _price;
                ForLendPlan.price = _name;
                ForLendPlan.ImageUri = user.availablePlans[i].ImageUri;
                ForLendPlan.description = user.availablePlans[i].description;
                require(
                    user.availablePlans[i].endDate <= block.timestamp + _days,
                    " Can not lend for this many days"
                );
                ForLendPlan.duration = _days * 1 days;
                ForLendPlan.endDate =
                    (block.timestamp * 1 days) +
                    ForLendPlan.duration;
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
        address tokenID,
        uint256 _amount,
        uint256 _days // _days multiplied by per day amount is total amount
    ) public onlyUser {
        //User storage seller = users[userToId[_seller]];
    }

    // function getUserAvailablePlans() public returns (Plan calldata) {
    //     User storage user = users[userToId[msg.sender]];
    //     return user.availablePlans;
    // }

    // function getUserForLendPlans() public returns (Plan calldata) {
    //     User storage user = users[userToId[msg.sender]];
    //     return user.forLendPlans;
    // }

    // function getUserService() public returns (Service calldata) {
    //     Service storage serviceProvider = services[
    //         serviceProviderToId[msg.sender]
    //     ];
    //     return serviceProvider;
    // }
}
