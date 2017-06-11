pragma solidity ^0.4.7;
contract VersusContract {

  uint[] public feedIds;
  uint public pairCounter;
  uint public likeFee;
  
  struct Pair {
    uint pairId;
    bytes32 title;    
    bytes32 imageSrcA;
    bytes32 imageSrcB;
    uint imageRatingA;
    uint imageRatingB;
    address submitter;
    uint pollMaxNumber;
    uint pollCounter;
  }
  
  mapping(uint => Pair) feedMapping;
  mapping(address => uint) userVersusCountMapping;
  mapping(address => uint[]) authorMapping;
  
  function VersusContract() {
    pairCounter = 0;
    likeFee = 10000000000000000; // 0.01
  }
  
  function addVersus(
		     bytes32 title,		     
		     bytes32 imageSrcA,
		     bytes32 imageSrcB,
		     uint pollMaxNumber
		     ) payable returns(uint[]) {

    feedMapping[pairCounter] = Pair({pairId: pairCounter,
	  imageSrcA: imageSrcA,
	  imageSrcB: imageSrcB,
	  imageRatingA: 0,
	  imageRatingB: 0,
	  title: title,
	  submitter: msg.sender,
	  pollMaxNumber: pollMaxNumber,
	  pollCounter: 0
    });
    
    feedIds.push(pairCounter);
    authorMapping[msg.sender].push(pairCounter);    
    pairCounter = pairCounter + 1;	

    return feedIds;
  }

  // assumes versusIds sorted from min to max
  function submitPolls(uint[] versusIds, bool[] chosenA) returns (bool){
    userVersusCountMapping[msg.sender] = versusIds[versusIds.length-1]+1;
    
    uint paySum = 0;
    
    for(uint i = 0; i < versusIds.length; i++) {
      Pair pair = feedMapping[versusIds[i]];
      
      if (pair.pollCounter < pair.pollMaxNumber) {
	
	if (chosenA[i]) {
	  pair.imageRatingA += 1;
	} else {
	  pair.imageRatingB += 1;	
	}
	pair.pollCounter +=1;	
	paySum += likeFee;
	
      }
    }
    
    
    // pay to poll submitter
   
    if (msg.sender.send(paySum)){
      return true;
    }  else {
      return false;
    }
  }
  
  // return users counter and last id
  function getVersuses() constant returns (uint, uint) {
    return (userVersusCountMapping[msg.sender], pairCounter);
  }

  function getUserVersuses() constant returns (uint[]) {
    return (authorMapping[msg.sender]);
  }
  
  function getVersus(uint pairId) constant returns (uint, bytes32, bytes32, bytes32, uint, uint, uint, address) {
    Pair pair = feedMapping[pairId];
    return (pair.pairId,
	    pair.title,	    
	    pair.imageSrcA,
	    pair.imageSrcB,
	    pair.imageRatingA,
	    pair.imageRatingB,
	    pair.pollMaxNumber,
	    pair.submitter
	    );
  }

}
