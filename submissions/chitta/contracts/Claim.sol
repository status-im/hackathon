pragma solidity ^0.4.8;

contract Claim {

  enum Stage {CREATED, LOCATED, PRICECALCULATED, REVIEW, READYFORSALE}

  enum Status {PENDING, APPROVED, DENIED}

  struct Coordinate {
    string latitude;
    string longitude;
  }

  struct Reviewer {
    address user;
    Status status;
  }

  string public name;
  string public code;
  string public usage; // Agriculture, Plot, etc.,
  address public owner;
  Stage public stage;
  Coordinate[] public coordinates; // Selected region latitude and longitude
  Reviewer[] public reviewers; // List of reviewers of the claim

  // Price calucation properties
  uint public size; // Approx in sq feet
  bool public isCity; // Whether place is located in city or village
  uint public rainWaterInLiters; // Estimate the amount of water fallen per m2 since last year
  uint public fromHighway; // KM from Highway

  uint public price; // It will be calculated

  function Claim(string _name, string _code, string _usage, address _ownder) {
    name = _name;
    code = _code;
    usage = _usage;
    owner = _ownder;
    stage = Stage.CREATED;
  }

  function addCoordinate(string _latitude, string _longitude, bool lastCoordinate) {
    coordinates.push(Coordinate({
        latitude : _latitude,
        longitude : _longitude
      }));

    if (lastCoordinate) {
      stage = Stage.LOCATED;
    }
  }

  function addPriceProperties(uint _size, uint _rainWaterInLiters, uint _kmFromHighway, bool _isCity) {
    size = _size;
    rainWaterInLiters = _rainWaterInLiters;
    fromHighway = _kmFromHighway;
    isCity = _isCity;

    uint baseRate = 25;
    if (isCity) {
      baseRate = 50;
    }

    if (fromHighway < 5) {
      baseRate = baseRate * 4;
    } else if (fromHighway < 10) {
      baseRate = baseRate * 3;
    } else if (fromHighway < 25) {
      baseRate = baseRate * 2;
    }

    if (rainWaterInLiters > 1000) {
      baseRate = baseRate * 3;
    } else if (rainWaterInLiters > 500) {
      baseRate = baseRate * 2;
    }

    price = baseRate * size;
    stage = Stage.PRICECALCULATED;
  }

  function addUserForReview(address _user, bool lastUser) {
    reviewers.push(Reviewer({
      user : _user,
      status : Status.PENDING
      }));

    if (lastUser) {
      stage = Stage.REVIEW;
    }
  }

  function updateReviewerStatus(address _user, uint status) {
    for (uint i = 0; i < reviewers.length; i++) {
      if (reviewers[i].user == _user) {
        if (status == 1) {
          reviewers[i].status = Status.APPROVED;
        } else if (status == 2) {
          reviewers[i].status = Status.DENIED;
        }
      }
    }
    isReadyForSale();
  }

  function getReviewStatus(address _user) public constant returns (uint){
    uint reviewStatus = 0;
    for (uint i = 0; i < reviewers.length; i++) {
      if (reviewers[i].user == _user) {
        reviewStatus = 1;
        if (reviewers[i].status == Status.APPROVED) {
          reviewStatus = 2;
        } else  if (reviewers[i].status == Status.DENIED) {
          reviewStatus = 3;
        }
      }
    }
    return reviewStatus;
  }

  function isReadyForSale() {
    if (stage == Stage.REVIEW && reviewers.length > 0) {
      uint approvedCount = 0;
      for (uint i = 0; i < reviewers.length; i++) {
        if (reviewers[i].status == Status.APPROVED) {
          approvedCount = approvedCount + 1;
        }
      }
      if (reviewers.length == approvedCount) {
        stage = Stage.READYFORSALE;
      }
    }
  }

  function stringToBytes32(string memory source) returns (bytes32 result) {
      assembly {
          result := mload(add(source, 32))
      }
  }

  function getName() public constant returns (bytes32) {
    return stringToBytes32(name);
  }

  function getCode() public constant returns (bytes32) {
    return stringToBytes32(code);
  }

  function getUsage() public constant returns (bytes32) {
    return stringToBytes32(usage);
  }

  function getOwner() public constant returns (address) {
    return owner;
  }

  function getStage() public constant returns(uint) {
      uint uintStage = 0;
      if (stage == Stage.CREATED) {
        uintStage = 0;
      } else if (stage == Stage.LOCATED) {
        uintStage = 1;
      } else if (stage == Stage.PRICECALCULATED) {
        uintStage = 2;
      } else if (stage == Stage.REVIEW) {
        uintStage = 3;
      } else if (stage == Stage.READYFORSALE) {
        uintStage = 4;
      }
      return uintStage;
  }

  function getSize() public constant returns (uint){
    return size;
  }

  function getRainWaterInLiters() public constant returns (uint){
    return rainWaterInLiters;
  }

  function getFromHighway() public constant returns (uint){
    return fromHighway;
  }

  function getPrice() public constant returns (uint){
    return price;
  }

  function getIsCity() public constant returns (bool){
    return isCity;
  }

  function getReviewersCount() public constant returns (uint) {
    return reviewers.length;
  }

  function getReviewer(uint index) public constant returns(address, uint) {
    address _user = reviewers[index].user;
    uint _status = 0;
    if (reviewers[index].status == Status.PENDING) {
      _status = 0;
    } else if (reviewers[index].status == Status.APPROVED) {
      _status = 1;
    } else if (reviewers[index].status == Status.DENIED) {
      _status = 2;
    }
    return (_user, _status);
  }

  function getCoordinatesCount() public constant returns (uint) {
    return coordinates.length;
  }

  // This helps to send the multiple strigs as single to avoid too many parameter returns from the contract
  function strConcat(string _a, string _b, string _c, string _d, string _e) internal returns (string){
      bytes memory _ba = bytes(_a);
      bytes memory _bb = bytes(_b);
      bytes memory _bc = bytes(_c);
      bytes memory _bd = bytes(_d);
      bytes memory _be = bytes(_e);
      string memory abcde = new string(_ba.length + _bb.length + _bc.length + _bd.length + _be.length);
      bytes memory babcde = bytes(abcde);
      uint k = 0;
      for (uint i = 0; i < _ba.length; i++) babcde[k++] = _ba[i];
      for (i = 0; i < _bb.length; i++) babcde[k++] = _bb[i];
      for (i = 0; i < _bc.length; i++) babcde[k++] = _bc[i];
      for (i = 0; i < _bd.length; i++) babcde[k++] = _bd[i];
      for (i = 0; i < _be.length; i++) babcde[k++] = _be[i];
      return string(babcde);
  }

  function getCoordiateAsString(uint j) public constant returns (bytes32) {
    string memory _coordinates =  strConcat("", "", coordinates[j].latitude, ",", coordinates[j].longitude);
    return stringToBytes32(_coordinates);
  }
}
