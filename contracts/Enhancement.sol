// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBase.sol";

contract Enhancement is ERC721Enumerable, VRFConsumerBase, PullPayment, Ownable {
    using Strings for uint8;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public price; // mint price
    uint256 public upgradeFee; 
    uint256 public tokenSum = 64; // both existing nfts and the burned ones
    uint8 public topLevel;
    bool public paused = false;
    bool public useDynamicUri = true;
    string public staticUri;
    // for getRandomNumber
    bytes32 public keyHash;
    uint256 public fee;
    uint256 randomResult;

    mapping(uint256 => uint8) public tokenIdToLevel;

    constructor(
        string memory _name, //Enhancement
        string memory _symbol, //EHM
        uint256 _newPrice, //100000000000000
        uint256 _newUpgradeFee, // 0
        uint8 _newTopLevel, // 10
        string memory _initBaseUri, //https://bafybeia5osgiwxx6ywvxh45o3rtxcce4k3l2vd7yk3vi73kcm5zxihplxe.ipfs.dweb.link/metadata/
        string memory _staticUri //https://bafybeia5osgiwxx6ywvxh45o3rtxcce4k3l2vd7yk3vi73kcm5zxihplxe.ipfs.dweb.link/metadata/1.json
    ) ERC721(
        _name, _symbol
    ) VRFConsumerBase(
        0xb3dCcb4Cf7a26f6cf6B120Cf5A73875B7BBc655B, 
        0x01BE23585060835E02B77ef475b0Cc51aA1e0709  
    ) {
        setPrice(_newPrice);
        setUpgradeFee(_newUpgradeFee);
        setTopLevel(_newTopLevel);
        setBaseUri(_initBaseUri);
        setStaticUri(_staticUri);
        keyHash = 0x2ed0feb3e7fd2022120aa84fab1945545a9f2ffc9076fd6156fa96eaff4c1311;
        fee = 0.01 * 10 ** 18; 
    }

    // get base uri
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // mint NFT
    function mint() public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(supply + 1 <= tokenSum);

        // The owner could mint without pay
        if (msg.sender != owner()) {
            require(msg.value >= price);
        }

        _safeMint(msg.sender, supply + 1);
        // level start from 1
        tokenIdToLevel[supply + 1] = 1;
    }

    // Get metedata with tokenId
    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        if (useDynamicUri == false) {
            return staticUri;
        } else {
            string memory currentBaseURI = _baseURI();
            return
                bytes(currentBaseURI).length > 0
                    ? string(
                        abi.encodePacked(
                            currentBaseURI,
                            tokenIdToLevel[tokenId].toString(),
                            baseExtension
                        )
                    )
                    : "";
        }
    }

    // To change ether to use dynamic Uri or not
    function changeUseDynamicUri(bool _useDynamicUri) public onlyOwner {
        useDynamicUri = _useDynamicUri;
    }

    // Set the price of NFT
    function setPrice(uint256 _newPrice) public onlyOwner {
        price = _newPrice;
    }

    // Set the fee of upgrading NFT
    function setUpgradeFee(uint256 _newUpgradeFee) public onlyOwner {
        upgradeFee = _newUpgradeFee;
    }

    // Set the fee of upgrading NFT
    function setTopLevel(uint8 _newTopLevel) public onlyOwner {
        topLevel = _newTopLevel;
    }

    // Set the dynamic base Uri
    function setBaseUri(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    // Set the static Uri
    function setStaticUri(string memory _staticUri) public onlyOwner {
        staticUri = _staticUri;
    }

    // Set the extention of metedata
    function setBaseExtension(string memory _newBaseExtension)
        public
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    // Set to pause the trnsaction
    function pause(bool _state) public onlyOwner {
        paused = _state;
    }

    /// @dev Overridden in order to make it an onlyOwner function
    function withdrawPayments(address payable payee)
        public
        virtual
        override
        onlyOwner
    {
        super.withdrawPayments(payee);
    }

    // check the ownership of specific tokenId
    function checkOwnership(uint256 tokenId) internal view returns (bool own) {
        uint256 ownerTokenCount = balanceOf(msg.sender);
        require(ownerTokenCount > 0, "You don't have any token!");

        for (uint256 i; i < ownerTokenCount; i++) {
            if (tokenOfOwnerByIndex(msg.sender, i) == tokenId) {
                return true;
            }
        }
        return false;
    }

    // Get random number from ChainLink node
    function getRandomNumber() internal returns (bytes32 requestId) {
        require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK - fill contract with faucet");
        return requestRandomness(keyHash, fee);
    }

    // Verify random number through VRF coordinator
    function fulfillRandomness(bytes32, uint256 randomness) internal override {
        randomResult = randomness;
    }

    // Upgrade weapon
    function upgrade(uint256 tokenId) public payable {
        require(checkOwnership(tokenId), "This is not your token!");
        require(msg.value == upgradeFee, "Transaction value did not equal the upgrade fee.");
        require(tokenIdToLevel[tokenId] != 0, "This NFT has been burned.");
        require(tokenIdToLevel[tokenId] < topLevel, "This NFT has already been the highest level!");
        getRandomNumber();
        if (randomResult % 10 >= tokenIdToLevel[tokenId]) {
            tokenIdToLevel[tokenId]++;
        } else {
            tokenIdToLevel[tokenId] = 0;
            tokenSum += 1;
        }
    }

    // cheating function haha
    // should be taken when deploy to production
    function cheat(uint256 tokenId) public onlyOwner {
        tokenIdToLevel[tokenId]++;
    }
}
