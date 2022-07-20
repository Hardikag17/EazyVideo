// SPDX-License-Identifier: MIT
pragma solidity >0.5.2 <=0.8.14;

// pragma experimental ABIEncoderV2;
// pragma experimental ABIEncoderV2;
// pragma experimental "v0.5.0";
library SafeMath {
    /**
     * @dev Multiplies two unsigned integers, reverts on overflow.
     */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the
        // benefit is lost if 'b' is also tested.
        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b, "wrong multiplication");

        return c;
    }

    /**
     * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
     */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0
        require(b > 0, "wrong divisin");
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**
     * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
     */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "wrong subtraction");
        uint256 c = a - b;

        return c;
    }

    /**
     * @dev Adds two unsigned integers, reverts on overflow.
     */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a, "wrong addition");

        return c;
    }

    /**
     * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
     * reverts when dividing by zero.
     */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0, "wrong mod value");
        return a % b;
    }
}

library Counters {
    using SafeMath for uint256;

    struct Counter {
        // This variable should never be directly accessed by users of the library: interactions must be restricted to
        // the library's function. As of Solidity v0.5.2, this cannot be enforced, though there is a proposal to add
        // this feature: see https://github.com/ethereum/solidity/issues/4637
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        counter._value += 1;
    }

    function decrement(Counter storage counter) internal {
        counter._value = counter._value.sub(1);
    }
}

library Address {
    /**
     * Returns whether the target address is a contract
     * @dev This function will return false if invoked during the constructor of a contract,
     * as the code is not actually created until after the constructor finishes.
     * @param account address of the account to check
     * @return whether the target address is a contract
     */
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // XXX Currently there is no better way to check if there is a contract in an address
        // than to check the size of the code at that address.
        // See https://ethereum.stackexchange.com/a/14016/36603
        // for more details about how this works.
        // TODO Check this again before the Serenity release, because all addresses will be
        // contracts then.
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }
}

contract TimeLock {
    error NotOwnerError();
    error AlreadyQueuedError(bytes32 txId);
    error TimestampNotInRangeError(uint256 blockTimestamp, uint256 timestamp);
    error NotQueuedError(bytes32 txId);
    error TimestampNotPassedError(uint256 blockTimestmap, uint256 timestamp);
    error TimestampExpiredError(uint256 blockTimestamp, uint256 expiresAt);
    error TxFailedError();

    event Queue(
        bytes32 indexed txId,
        address indexed target,
        uint256 value,
        string func,
        bytes data,
        uint256 timestamp
    );
    event Execute(
        bytes32 indexed txId,
        address indexed target,
        uint256 value,
        string func,
        bytes data,
        uint256 timestamp,
        bytes res
    );
    event Cancel(bytes32 indexed txId);

    uint256 public constant MIN_DELAY = 10; // seconds
    uint256 public constant MAX_DELAY = 1000; // seconds
    uint256 public constant GRACE_PERIOD = 1000; // seconds

    address public owner;
    // tx id => queued
    mapping(bytes32 => bool) public queued;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert NotOwnerError();
        }
        _;
    }

    receive() external payable {}

    function getTxId(
        address _target,
        uint256 _value,
        string calldata _func,
        bytes calldata _data,
        uint256 _timestamp
    ) public pure returns (bytes32) {
        return keccak256(abi.encode(_target, _value, _func, _data, _timestamp));
    }

    /**
     * @param _target Address of contract or account to call
     * @param _value Amount of ETH to send
     * @param _func Function signature, for example "foo(address,uint256)"
     * @param _data ABI encoded data send.
     * @param _timestamp Timestamp after which the transaction can be executed.
     */
    function queue(
        address _target,
        uint256 _value,
        string calldata _func,
        bytes calldata _data,
        uint256 _timestamp
    ) external onlyOwner returns (bytes32 txId) {
        txId = getTxId(_target, _value, _func, _data, _timestamp);
        if (queued[txId]) {
            revert AlreadyQueuedError(txId);
        }
        // ---|------------|---------------|-------
        //  block    block + min     block + max
        if (
            _timestamp < block.timestamp + MIN_DELAY ||
            _timestamp > block.timestamp + MAX_DELAY
        ) {
            revert TimestampNotInRangeError(block.timestamp, _timestamp);
        }

        queued[txId] = true;

        emit Queue(txId, _target, _value, _func, _data, _timestamp);
    }

    function execute(
        address _target,
        uint256 _value,
        string calldata _func,
        address _funArgs,
        bytes calldata _data,
        uint256 _timestamp
    ) external payable onlyOwner returns (bytes memory) {
        bytes32 txId = getTxId(_target, _value, _func, _data, _timestamp);
        if (!queued[txId]) {
            revert NotQueuedError(txId);
        }
        // ----|-------------------|-------
        //  timestamp    timestamp + grace period
        if (block.timestamp < _timestamp) {
            revert TimestampNotPassedError(block.timestamp, _timestamp);
        }
        if (block.timestamp > _timestamp + GRACE_PERIOD) {
            revert TimestampExpiredError(
                block.timestamp,
                _timestamp + GRACE_PERIOD
            );
        }

        queued[txId] = false;

        // // prepare data
        // bytes memory data;
        // if (bytes(_func).length > 0) {
        //     // data = func selector + _data
        //     data = abi.encodePacked(bytes4(keccak256(bytes(_func))), _funArgs, _data);
        // } else {
        //     // call fallback with data
        //     data = _data;
        // }

        // call target
        // (bool ok, bytes memory res) = _target.call{value: _value}(data);
        (bool ok, bytes memory res) = _target.call{value: _value}(
            abi.encodeWithSignature("test(address)", _funArgs)
        );
        if (!ok) {
            revert TxFailedError();
        }

        emit Execute(txId, _target, _value, _func, _data, _timestamp, res);

        return res;
    }

    function cancel(bytes32 _txId) external onlyOwner {
        if (!queued[_txId]) {
            revert NotQueuedError(_txId);
        }

        queued[_txId] = false;

        emit Cancel(_txId);
    }
}

contract ERC721 {
    using SafeMath for uint256;

    using Address for address;

    address public timeLock;

    using Counters for Counters.Counter;

    address owner;

    mapping(uint256 => address payable) nftOwner;

    uint256 tID;

    uint256 public totalTokensMinted;

    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );

    mapping(address => mapping(uint256 => bool)) private isOwner;

    struct NFTDetails {
        string createrName;
        string ownerName;
        address payable tokenOwner;
        uint256 tokenID;
        uint256 nftMintTime;
        uint256 value;
        string nftName;
        string uri;
        string description;
    }

    struct NFTOwnerDetails {
        address tokenOwner;
        uint256 tokenID;
        string ownerName;
        uint256 totalTokensMinted;
    }

    NFTDetails nftDetails;

    NFTOwnerDetails nftOwnerDetails;

    // Mapping from token ID to owner
    mapping(uint256 => address) private _tokenOwner;

    // Mapping from token ID to approved address
    mapping(uint256 => address) private _tokenApprovals;

    // Mapping from owner to number of owned token
    mapping(address => Counters.Counter) private _ownedTokensCount;

    // Mapping from owner to operator approvals
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    mapping(uint256 => NFTDetails) public NFTInfo;

    mapping(uint256 => NFTOwnerDetails) private NFTOwnerInfo;

    mapping(address => mapping(uint256 => NFTDetails))
        private nftListByNFTOwner;

    mapping(address => uint256) private getTokenID;

    event Details(address, uint256, uint256, string);

    event NFTMinted(address tokenOwner, uint256 tokenID, uint256 tokenMintTime);

    mapping(uint256 => bool) paymentTransferred;

    event PaymentTransferred(
        address buyer,
        address seller,
        bool paymentTransferred
    );

    event NFTTransferred(
        address buyer,
        address seller,
        uint256 tokenID,
        bool NFTTransferred
    );

    NFTDetails[] nftList;

    constructor(address _timeLock) {
        timeLock = _timeLock;
    }

    event TransactionExecuted(address trxSender);

    function test(address timelock) external view returns (address) {
        require(msg.sender == timelock, "address is different");
        return msg.sender;
    }

    function getTimestamp() external view returns (uint256) {
        return block.timestamp + 100;
    }

    function getNFTList() public view returns (NFTDetails[] memory) {
        return nftList;
    }

    function balanceOf(address _account) public view returns (uint256) {
        require(_account != address(0), "NULL Address");

        return _ownedTokensCount[_account].current();
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address nftHolder = _tokenOwner[tokenId];

        require(nftHolder != address(0), "address is null!");

        return nftHolder;
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) private {
        _transferFrom(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) private {
        transferFrom(from, to, tokenId);
    }

    function _exists(uint256 _tokenId) internal view returns (bool) {
        address nftHolder = _tokenOwner[_tokenId];

        return nftHolder != address(0);
    }

    function _mint(address to, uint256 _tokenId) internal {
        require(to != address(0), "address is zero");

        require(!_exists(_tokenId), "address doesn't exists");

        _tokenOwner[_tokenId] = to;

        _ownedTokensCount[to].increment();

        emit Transfer(address(0), to, _tokenId);
    }

    function _burn(address _account, uint256 _tokenId) internal {
        require(ownerOf(_tokenId) == _account, "address mismatch");

        _clearApproval(_tokenId);

        _ownedTokensCount[_account].decrement();

        _tokenOwner[_tokenId] = address(0);

        emit Transfer(_account, address(0), _tokenId);
    }

    function _burn(uint256 _tokenId) internal {
        _burn(ownerOf(_tokenId), _tokenId);
    }

    function _transferFrom(
        address from,
        address to,
        uint256 _tokenId
    ) internal {
        require(ownerOf(_tokenId) == from, "owner is not authenticated");

        require(to != address(0), "address is zero -one");

        _clearApproval(_tokenId);

        _ownedTokensCount[from].decrement();

        _ownedTokensCount[to].increment();

        _tokenOwner[_tokenId] = to;

        emit Transfer(from, to, _tokenId);
    }

    function _clearApproval(uint256 tokenId) private {
        if (_tokenApprovals[tokenId] != address(0)) {
            _tokenApprovals[tokenId] = address(0);
        }
    }

    function mintNFT(
        string memory _nftName,
        uint256 price,
        string memory ownerName,
        string memory uri,
        string memory description
        uint256 time
    ) public {
        uint256 _tokenID = tID + 1;

        tID = _tokenID;

        _mint(msg.sender, _tokenID);

        uint256 mintTime = block.timestamp + time;

        nftDetails = NFTDetails(
            ownerName,
            ownerName,
            payable(msg.sender),
            _tokenID,
            mintTime,
            price,
            _nftName,
            uri,
            description
        );

        nftList.push(nftDetails);

        NFTInfo[_tokenID] = nftDetails;

        NFTOwnerInfo[_tokenID] = nftOwnerDetails;

        totalTokensMinted = nftList.length;

        nftOwnerDetails = NFTOwnerDetails(
            msg.sender,
            _tokenID,
            ownerName,
            totalTokensMinted
        );

        nftListByNFTOwner[msg.sender][_tokenID] = nftDetails;

        getTokenID[msg.sender] = _tokenID;

        isOwner[msg.sender][_tokenID] = true;

        emit NFTMinted(msg.sender, _tokenID, mintTime);
    }

    function transferPayment(
        address payable _from,
        address payable _to,
        uint256 tokenID
    ) internal {
        require(
            msg.value != 0 && _from != address(0),
            "Must send ethers to the seller. You are sending 0 amount as payment to seller."
        );

        require(_from != address(0) && _to != address(0), "address is Empty.");

        uint256 amount = msg.value;

        _from = payable(msg.sender);

        _to.transfer(amount);

        paymentTransferred[tokenID] = true;

        emit PaymentTransferred(_from, _to, true);
    }

    function transferNFT(
        address payable seller,
        address payable buyer,
        string calldata buyerName,
        uint256 tokenID
    ) external payable {
        transferPayment(buyer, seller, tokenID);

        require(
            paymentTransferred[tokenID] == true,
            "Payment has not yet been transferred to the NFT Owner. Please Send Payment in time."
        );

        require(
            ownerOf(tokenID) != buyer,
            "Buyer can not be the owner of NFT at this stage."
        );

        safeTransferFrom(seller, buyer, tokenID);

        uint256 price = nftListByNFTOwner[seller][tokenID].value;

        string memory name = nftListByNFTOwner[seller][tokenID].ownerName;

        string memory uri = nftListByNFTOwner[seller][tokenID].uri;

        string memory nftName = nftListByNFTOwner[seller][tokenID].nftName;

        string memory description = nftListByNFTOwner[seller][tokenID]
            .description;

        nftOwner[tokenID] = buyer;

        paymentTransferred[tokenID] = false;

        nftDetails = NFTDetails(
            name,
            buyerName,
            buyer,
            tokenID,
            0,
            price,
            nftName,
            uri,
            description
        );

        nftListByNFTOwner[buyer][tokenID] = nftDetails;

        NFTInfo[tokenID] = nftDetails;

        isOwner[buyer][tokenID] = true;

        isOwner[seller][tokenID] = false;

        emit NFTTransferred(buyer, seller, tokenID, true);
    }

    function getNFTOwner(uint256 tokenID)
        external
        view
        returns (
            address,
            uint256,
            uint256
        )
    {
        return (
            NFTInfo[tokenID].tokenOwner,
            NFTInfo[tokenID].tokenID,
            NFTInfo[tokenID].nftMintTime
        );
    }

    function confirmOwner(uint256 tokenID, address tokenOwner)
        public
        view
        returns (bool)
    {
        return isOwner[tokenOwner][tokenID];
    }
}
