// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/security/PullPayment.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Enhancement is ERC721Enumerable, PullPayment, Ownable {
    using Strings for uint8;

    string public baseURI;
    string public baseExtension = ".json";
    uint256 public price;
    uint256 public maxSupply = 64;
    uint256 public maxMintAmount = 1;
    bool public paused = false;
    bool public useDynamicUri = true;
    string public staticUri;

    mapping(uint256 => uint8) tokenIdToLevel;

    constructor(
        string memory _name, //Enhancement
        string memory _symbol, //EHM
        uint256 _newPrice, //100000000000000
        string memory _initBaseUri, //https://bafybeia5osgiwxx6ywvxh45o3rtxcce4k3l2vd7yk3vi73kcm5zxihplxe.ipfs.dweb.link/metadata/
        string memory _staticUri //https://bafybeia5osgiwxx6ywvxh45o3rtxcce4k3l2vd7yk3vi73kcm5zxihplxe.ipfs.dweb.link/metadata/1.json
    ) ERC721(_name, _symbol) {
        setPrice(_newPrice);
        setBaseUri(_initBaseUri);
        setStaticUri(_staticUri);
    }

    // get base uri
    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // mint NFT
    function mint(uint256 _mintAmount) public payable {
        uint256 supply = totalSupply();
        require(!paused);
        require(_mintAmount > 0);
        require(_mintAmount <= maxMintAmount);
        require(supply + _mintAmount <= maxSupply);

        // The owner could mint without pay
        if (msg.sender != owner()) {
            require(msg.value >= price * _mintAmount);
        }

        for (uint256 i = 1; i <= _mintAmount; i++) {
            _safeMint(msg.sender, supply + i);
            tokenIdToLevel[supply + i] = 1;
        }
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

    // Set the maximun once mint
    function setmaxMintAmount(uint256 _newmaxMintAmount) public onlyOwner {
        maxMintAmount = _newmaxMintAmount;
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

    // Get random number
    function getRandomNumber(uint256 seed)
        internal
        pure
        returns (bool success)
    {
        // todo: need genrate random number more secure
        if (seed % 2 == 1) {
            return true;
        } else {
            return false;
        }
    }

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

    // Upgrade weapon
    function upgrade(uint256 tokenId) public {
        require(checkOwnership(tokenId), "This is not your token!");
        if (getRandomNumber(block.timestamp)) {
            tokenIdToLevel[tokenId]++;
        } else {
            tokenIdToLevel[tokenId] = 0;
        }
    }

    // cheating function haha
    function cheat(uint256 tokenId) public onlyOwner {
        tokenIdToLevel[tokenId]++;
    }
}
