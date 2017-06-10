pragma solidity ^0.4.8;

import "./Claim.sol";

contract Chitta {
  string public name;
  string public region;
  string public symbol;
  uint8 public decimals;
  mapping (address => uint256) public balanceOf;

  Claim[] public claims;

  function Chitta(string _name, string _region, string _symbol, uint256 _initialTokenAmount) {
    name = _name;
    symbol = _symbol;
    decimals = 2;
    balanceOf[msg.sender] = _initialTokenAmount;
    region = _region;
  }

  function validateChittaCode(string _code) public constant returns (bool) {
    bool available = true;
    bytes32 encoded = stringToBytes32(_code);
    for (uint index = 0; index < claims.length; index++) {
      if (sha3(claims[index].getCode()) == sha3(encoded)) {
        available = false;
      }
    }
    return available;
  }

  function getClaimIndex(string _code) public constant returns (uint) {
    uint codeIndex = 0;
    bytes32 encoded = stringToBytes32(_code);
    for (uint index = 0; index < claims.length; index++) {
      if (sha3(claims[index].getCode()) == sha3(encoded)) {
        codeIndex = index + 1;
      }
    }
    return codeIndex;
  }

  function createNewClaim(string _name, string _code, string _usage, address _ownder) {
    Claim claim = new Claim(_name, _code, _usage, _ownder);
    claims.push(claim);
  }

  function addCoordinate(uint index, string _latitude, string _longitude, bool lastCoordinate) {
    claims[index].addCoordinate(_latitude, _longitude, lastCoordinate);
  }

  function addPriceProperties(uint index, uint _size, uint _rainWaterInLiters, uint _kmFromHighway, bool _isCity) {
    claims[index].addPriceProperties(_size, _rainWaterInLiters, _kmFromHighway, _isCity);
  }

  function addAllReviwer(uint index, address reviewer1, address reviewer2, address reviewer3) {
    claims[index].addUserForReview(reviewer1, false);
    claims[index].addUserForReview(reviewer2, false);
    claims[index].addUserForReview(reviewer3, true);
  }

  function updateReviewerStatus(uint index, address _user, uint status) {
    claims[index].updateReviewerStatus(_user, status);
  }

  function updateReadyForSale() {
    for (uint index = 0; index < claims.length; index++) {
      claims[index].isReadyForSale();
    }
  }

  function stringToBytes32(string memory source) returns (bytes32 result) {
      assembly {
          result := mload(add(source, 32))
      }
  }

  function bytes32ToString (bytes32 data) returns (string) {
    bytes memory bytesString = new bytes(32);
    for (uint j=0; j<32; j++) {
        byte char = byte(bytes32(uint(data) * 2 ** (8 * j)));
        if (char != 0) {
            bytesString[j] = char;
        }
    }
    return string(bytesString);
  }

  function getCoordinates(string _code, uint start) public constant returns(string) {
    bytes32 encoded = stringToBytes32(_code);
    bytes32 _coordinates;
    for (uint index = 0; index < claims.length; index++) {
      if (sha3(claims[index].getCode()) == sha3(encoded)) {
        uint total = claims[index].getCoordinatesCount();
        if (total > start) {
            _coordinates = claims[index].getCoordiateAsString(start);
        }
      }
    }
    return (bytes32ToString(_coordinates));
  }

  function getClaimCount() public constant returns(uint) {
    return claims.length;
  }

  function getUserClaimCount(address userAccount) public constant returns (uint, uint) {
    uint count = 0;
    for (uint index = 0; index < claims.length; index++) {
      if (claims[index].getOwner() == userAccount) {
        count = count + 1;
      }
    }
    return (count, claims.length);
  }

  function getClaim(uint index, address userAccount) public constant returns(string, string, string, uint, uint) {
    bytes32 name;
    bytes32 code;
    bytes32 usage;
    uint stage;
    uint size;
    address owner = claims[index].getOwner();
    if (owner == userAccount) {
      name = claims[index].getName();
      code = claims[index].getCode();
      usage = claims[index].getUsage();
      stage = claims[index].getStage();
      size = claims[index].getSize();
    }
    return (bytes32ToString(name), bytes32ToString(code), bytes32ToString(usage), size, stage);
  }

  function getAssociationClaimDetail(uint index, address userAccount) public constant returns(string, string, address, uint, uint, uint) {
    //bytes32 name = claims[index].getName();
    bytes32 code = claims[index].getCode();
    bytes32 usage = claims[index].getUsage();
    uint stage = claims[index].getStage();
    uint size = claims[index].getSize();
    uint reviewStatus = claims[index].getReviewStatus(userAccount);
    address owner = claims[index].getOwner();
    return (bytes32ToString(code), bytes32ToString(usage), owner, size, stage, reviewStatus);
  }

  function getReviewerStatus(string code) public constant returns (address, uint, address, uint, address, uint) {
    uint index = getClaimIndex(code);
    address reviewer1;
    address reviewer2;
    address reviewer3;
    uint status1;
    uint status2;
    uint status3;
    (reviewer1, status1) = claims[index-1].getReviewer(0);
    (reviewer2, status2) = claims[index-1].getReviewer(1);
    (reviewer3, status3) = claims[index-1].getReviewer(2);
    return (reviewer1, status1, reviewer2, status2, reviewer3, status3);
  }

  function getQueryAnswers(string code) public constant returns (uint, uint, uint) {
    uint index = getClaimIndex(code);
    uint rainwater = claims[index-1].getRainWaterInLiters();
    uint fromhighway = claims[index-1].getFromHighway();
    uint price = claims[index-1].getPrice();

    return (rainwater, fromhighway, price);
  }
}
