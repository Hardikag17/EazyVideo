// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import {ERC721} from "./nft.sol";

/** @title eazyVideo
 * @notice It is a contract for managing eazyVideo platform
 */

contract EazyVideo {
    struct Plan {
        uint256 planDuration;
        string[] tokenIDes;
        uint256 price;
    }

    struct ServiceProvider {
        string name;
        uint256 description;
        // Three type of plans by service providers eg: 30, 60, 90 days or 1 day
        Plan[] plandetails;
        uint256 collectdebt;
    }

    //for user type
    struct User {
        string[] nftlist; // user nft’s
        string[] forRentList; // nft of users that are available for rent for a specific time.
        uint256 collectDebt;
    }

    ServiceProvider[] services;
    User[] user;

    // every nft price for user to give set by user or a service provider
    // mapping(uint256=>uint256) nftIdToPrice;
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
            userToId[msg.sender] <= user.length,
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

    function addUserToPlatform(bool _accountType) public {
        require(!userToId[msg.sender], "User does not exist in the pool");
        require(!serviceProviderToId[msg.sender], "User is a service provider");
        accountType[msg.sender] = _accountType;

        //user
        if (_accountType == false) {
            user.push(User({nftlist: [], forRentList: [], collectDebt: 0}));
        }
    }

    /**
     * @notice function can be called by only a service provider wallet address
     * for adding a new service.
     */
    function addNewServiceProvider(
        string calldata _name,
        uint256 _description,
        uint256 planDuration1,
        uint256 planDuration2,
        uint256 planDuration3,
        uint256 plan1Price,
        uint256 plan2Price,
        uint256 plan3Price
    ) public {
        require(
            serviceProviderToId[msg.sender] < services.length,
            "You are already a registered service"
        );
        accountType[msg.sender] = _accountType;
        services.push(
            ServiceProvider({
                name: _name,
                description: _description,
                plandetails: [
                    Plan({
                        planDuration: planDuration1,
                        tokenIDes: [],
                        price: plan1Price
                    }),
                    Plan({
                        planDuration: planDuration2,
                        tokenIDes: [],
                        price: plan2Price
                    }),
                    Plan({
                        planDuration: planDuration3,
                        tokenIDes: [],
                        price: plan3Price
                    })
                ],
                collectdebt: 0
            })
        );
    }

    /**
     * @notice method to upadate listed service details by service providers
     */
    function updateService() public onlyServiceProvider {}

    // _planType = 0, 1, 2
    function takeService(
        string _nftName,
        address _serviceProviderWallet,
        uint256 _planType,
        string tokenID
    ) public onlyUser {
        ServiceProvider storage service = services[_serviceProviderWallet];

        uint256 _time = block.timestamp +
            service.plandetails[_planType].planDuration;
        uint256 price = service.plandetails[_planType].price;
        string memory _description = service.description;

        mintNFT(_nftName, price, msg.sender, tokenID, _description, _time);

        service.plandetails[_planType].tokenIDes.push(tokenID);
        userToId[msg.sender].nftlist = tokenID;
    }

    /**
     * @notice method to lend the nfts for rents in thier profile by giving the time lending for
     * User can’t rent a nft for time more than he owns it - This requires a check from a nft metadata
     */
    function AddToLend(
        uint256 _amount,
        uint256 _days,
        string tokenID
    ) public onlyUser returns (bool) {
        User storage user = userToId[msg.sender];
        for (int256 i = 0; i < user.nftlist.length; i++) {
            if (user.nftlist[i] == tokenID) {
                user.nftlist[i] = user.nftlist[user.nftlist.length - 1];
                user.nftlist.pop();
                user.forRentList.push(tokenID);
                return true;
            }
        }
        return false;
    }

    function check(string memory tokenID, address seller) internal {
        User storage seller = userToId[seller];
        for (int256 i = 0; i < seller.forRentList.length; i++) {
            if (seller.forRentList[i] == tokenID) {
                seller.forRentList[i] = seller.nftlist[
                    seller.nftlist.length - 1
                ];
                seller.forRentList.pop();
                return true;
            }
        }

        return false;
    }

    /**
     * @notice This method can be called by only a user wallet address to rent the
     * available nfts by giving the days user is renting it for and giving the amount to
     * the nft owner
     */

    function TakeOnRent(
        address seller,
        uint256 _amount,
        uint256 _days,
        string tokenID
    ) public onlyUser {
        User storage seller = userToId[seller];
        require(
            check(tokenID, seller),
            " Seller don't own this nft to sell you"
        );

        transferNFT(seller, msg.sender, tokenID);
    }
}
