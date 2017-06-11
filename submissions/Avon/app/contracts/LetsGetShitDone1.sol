pragma solidity ^0.4.8;

contract LetsGetShitDone1
{
    enum commitmentState
    {
         ongoing,
         succeeded,
         failed
    }
    
    struct commitmentData
    {
        string goal;
        address beneficiary;
        uint endTimestamp;
        uint256 amount;
        commitmentState state;
    }

    uint256 unknownFunds;
    address owner;

    mapping (address => commitmentData[]) commitments;

    event CommitmentCreatedSuccesfully(uint commitmentId, int secondsLeft);
    event NoTimeYet(uint commitmentId, int secondsLeft); //To remove
    event DoneAndFundsReturned(uint commitmentId, uint256 paidAmount, address owner, int secondsLeft);
    event NotDoneAndFundsPaid(uint commitmentId, uint256 paidAmount, address beneficiary, int secondsLeft);
    event GotFreeMoney(uint256 newAmount, uint256 unknowTotal);

    function LetsGetShitDone1()  payable
    {
        owner = msg.sender;
        unknownFunds = 0;
    } 

    function Commit(string goal, address beneficiary, uint endTimestamp)  payable
    {
        if(msg.value == 0)
            throw;

        commitmentData memory commitment;
        commitment.goal = goal;
        commitment.beneficiary = beneficiary;
        commitment.endTimestamp = endTimestamp;
        commitment.amount = msg.value;
        commitment.state = commitmentState.ongoing;

        commitments[msg.sender].push(commitment);

        CommitmentCreatedSuccesfully(commitments[msg.sender].length-1, int(endTimestamp) - int(block.timestamp));
    } 

    function Resolve(uint commitmentId, bool succeeded)
    {
        if(commitments[msg.sender].length < commitmentId) 
            throw;

        if(commitments[msg.sender][commitmentId].state != commitmentState.ongoing) 
            throw;
            
        if(block.timestamp < commitments[msg.sender][commitmentId].endTimestamp )  
            throw;
        

        if(succeeded)
        {
            if(!msg.sender.send(commitments[msg.sender][commitmentId].amount))
                throw;

            commitments[msg.sender][commitmentId].state = commitmentState.succeeded;
            DoneAndFundsReturned(commitmentId,commitments[msg.sender][commitmentId].amount, msg.sender, int(commitments[msg.sender][commitmentId].endTimestamp) - int(block.timestamp));
        }
        else
        {
            if(!commitments[msg.sender][commitmentId].beneficiary.send(commitments[msg.sender][commitmentId].amount))
                throw;

            commitments[msg.sender][commitmentId].state = commitmentState.failed;
            NotDoneAndFundsPaid(commitmentId,commitments[msg.sender][commitmentId].amount, msg.sender, int(commitments[msg.sender][commitmentId].endTimestamp) - int(block.timestamp));
        }
    }
    
    function GetNumberOfCommitments() constant returns (uint)
    {
        return commitments[msg.sender].length;
    }
    
    function GetCommitmentData(uint commitmentId) constant returns (uint, string, address,uint, uint256, commitmentState)
    {
        return (
            commitmentId,
            commitments[msg.sender][commitmentId].goal,
            commitments[msg.sender][commitmentId].beneficiary,
            commitments[msg.sender][commitmentId].endTimestamp,
            commitments[msg.sender][commitmentId].amount,
            commitments[msg.sender][commitmentId].state
            );
    }

    function WithdrawUnknownFunds()
    {
        if(msg.sender != owner)
            throw;

        if(!msg.sender.send(unknownFunds))
            throw;
    }

    function() payable { 
        unknownFunds += msg.value;
        GotFreeMoney(msg.value, unknownFunds);
    }
}