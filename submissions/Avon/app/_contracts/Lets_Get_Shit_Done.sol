pragma solidity ^0.4.8;

contract LetsGetShitDone
{
   int endTime;
   address beneficiaryAddress;
   address ownerAddress;

   event NotTimeYet(int secondsLeft);
   event Success(uint paidAmount, address owner, int secondsLeft);
   event Fail(uint paidAmount, address beneficiary, int secondsLeft);
   event Deployed(uint currentTime);

    function LetsGetShitDone(  address beneficiaryWhenYouFail, int secondsToGetShitDone)  payable
    {
        beneficiaryAddress = beneficiaryWhenYouFail;
        ownerAddress = msg.sender;
        endTime = int(block.timestamp) + secondsToGetShitDone;
        //this.transfer(msg.value);
    } 

    function Done(bool isDone) {

        if(msg.sender != ownerAddress)
            throw;

        if(endTime  < int(block.timestamp))
        {
            NotTimeYet(int(block.timestamp) - endTime);
            throw; 
        }

        if(isDone)
        {
            Success(this.balance, ownerAddress, int(block.timestamp) - endTime);
            selfdestruct(ownerAddress);
        }
        else
            Fail(this.balance, beneficiaryAddress, int(block.timestamp) - endTime);
            selfdestruct(beneficiaryAddress);
    }
}