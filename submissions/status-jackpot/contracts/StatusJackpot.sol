pragma solidity ^0.4.2;

contract StatusJackpot {
    uint bettingPeriod;
    uint startedBlockNumber;
    uint numStakeHolders;
    uint totalFinney;
    uint hasJackpotEnded;
    address winner;
    mapping(uint => address) stakeHolders;
    mapping(address => uint) bets;
    uint pointer;
    uint blockhash;

    function StatusJackpot() {
        bettingPeriod = 1000;
        startedBlockNumber = 0;
        numStakeHolders = 0;
        totalFinney = 0;
        hasJackpotEnded = 0;
        startedBlockNumber = block.number;
        pointer = 0;
    }

    function getPooledAmount() constant returns (uint _balance) {
        return this.balance;
    }

    function getBetAmount(address _addr) constant returns (uint _totalbet) {
      return bets[_addr];
    }

    function getWinnerAddr() constant returns (address _winnerAddr){
      return winner;
    }

    function getFirstBetter() constant returns (address _fastAddr){
      return stakeHolders[0];
    }

    function getTotalFinney() constant returns (uint _totalFinney){
      return totalFinney;
    }

    function getBlockhash() constant returns (uint _blockhash){
      return blockhash;
    }

    function getJackpotEnded() constant returns (uint _hasJackpotEnded){
      return hasJackpotEnded;
    }

    function getPointer() constant returns (uint _pointer){
      return pointer;
    }

    function getWinning(address _addr) constant returns (string _winning, uint _balance, uint _pointer) {
      if(block.number > (startedBlockNumber + bettingPeriod)){
        if(hasJackpotEnded == 0){
          return ("last", 0, 0);
        }else{
          if(_addr == winner){
            return ("won", totalFinney/1000, pointer);
          }else{
            return ("lost", 0, blockhash);
          }
        }
      }else{
        return ("bet", uint((startedBlockNumber + bettingPeriod) - block.number), 0);
      }
    }

    function () payable {
        if(bets[msg.sender] == 0){
          stakeHolders[numStakeHolders] = msg.sender;
          numStakeHolders = numStakeHolders + 1;
        }

        bets[msg.sender] = bets[msg.sender] + msg.value;
        totalFinney += uint(msg.value / 1000000000000000);

        if(block.number > (startedBlockNumber + bettingPeriod)){
            blockhash = uint(block.blockhash(block.number-1));
            pointer = uint(block.blockhash(block.number-1)) % totalFinney;

            uint hwm = 0;
            for(uint i=0; i<numStakeHolders; i++){
                hwm = hwm + uint(bets[stakeHolders[i]] / 1000000000000000);
                if(hwm > pointer){
                    winner = stakeHolders[i];
                    break;
                 }
            }

            winner.transfer(this.balance);
  
            hasJackpotEnded = 1;
        }
    }

}
