pragma solidity ^0.4.0;
// All the amount calculations shall be in WEI as internally Etherum keep them in WEI format only.

/*======================================Time line of events in the lottery pool======================================================*/
/*===================================================================================================================================*/
/*=====Pool=========================Cut-off========================Ticket===================================Draw==============Next===*/
/*===Creation========================Date========================Upload Date================================Date==============Pool===*/
/*===================================================================================================================================*/


contract WeLottify {
    
    uint public poolId;
    uint256 public totalCompletedPools;
    
    struct Pool{
        address leaderAddress;
        string poolName;
        string IPFSLinkOfTickets;
        uint256 secretToken;//needed in case of the pool is unlisted
        uint256 poolPlayerLimit;
        uint256 totalMoneyPooled;
        uint NoOfPlayersJoined;
        uint256 feesToBeTakenByLeader;
        bool ended;
        uint256 ticketCost;
        bool isUnlisted;
        bool isTicketUploaded;
        bool canFetchManually;
    }
    
    struct extendedPool{
        string tagName;
        uint256 LotteryPoolStartDate;
        uint256 LotteryPoolDrawDate;
        uint256 LotteryPoolCutOffDate;
        uint256 TicketImageUploadDate;
        
        
    }
    
    struct PoolPlayer{
        uint256 joinedPoolId; // this is the poolId of the player that he joined
        bool isJoined;
        bool haveWithdrawn;
    }
    
    struct ProfileInfo{
        address playerAddress;
        string name;
        string location;
    }
    
    modifier condition(bool _condition) {
        require(_condition);
        _;
    }
    modifier onlyBefore(uint _time) { 
        require(now < _time); 
        _; 
        
    }
    modifier onlyAfter(uint _time) { 
        require(now > _time); 
        _; 
        
    }

    mapping(uint256=>Pool) public pools;
    
    mapping(uint256=>extendedPool) public extendedpools;
    mapping(address=>PoolPlayer[]) public poolPlayers;
    mapping(address=>ProfileInfo) public profileDetails;
    
    
    event PoolCreated(address indexed leaderAddress, uint256 indexed poolPlayerLimit, uint256 indexed poolGlobalID, bool isUnlisted, uint256 secretToken, uint drawDate, string tagName);
    event UploadImage(address indexed leaderAddress, uint256 indexed poolPlayerLimit, uint256 indexed poolGlobalID);
    event PlayerJoined(address indexed participantAddress, uint256 indexed poolGlobalId, uint256 time, string msg);
    event ImageUploadedOnIPFS(address indexed leaderAddress, string IPFSLink, uint now, uint poolID);
    event PoolEnded(uint indexed poolID, uint now);
    
    
     /**@dev Anyone can create a pool by passing some minimal no of parameters
     * @param _poolName Name of the pool e.g. Lucky Thirty, Mega forty etc
     * @param _poolPlayerLimit Upper limit on the no of player
     * @param _isUnlisted if this pool is private so unlisted from the search
     * @param _secretToken if the pool is private, then leader has to provide a secret token to the participants to join his private pool
     * @param _feesToBetakenByLeader upfront fees set by the leader to carry out the operation honestly and efficiently
     * @param _ticketCost this cost shall be actual ticket cost + small addition fee to compensate for the leader fees
     * @param _drawDate this is the draw date set by the leader for his pool
    */
    function createPool(string _poolName, string _tagName, uint256 _poolPlayerLimit, bool _isUnlisted,uint256 _secretToken,  uint256 _feesToBetakenByLeader, uint256 _ticketCost,uint256 _drawDate){
        pools[poolId].leaderAddress = msg.sender;
        pools[poolId].poolName = _poolName;
        extendedpools[poolId].tagName = _tagName;
        pools[poolId].poolPlayerLimit = _poolPlayerLimit;
        pools[poolId].isUnlisted = _isUnlisted;
        pools[poolId].feesToBeTakenByLeader = _feesToBetakenByLeader;
        pools[poolId].ticketCost = _ticketCost;
        pools[poolId].totalMoneyPooled = 0;
        pools[poolId].NoOfPlayersJoined = 0;
        extendedpools[poolId].LotteryPoolStartDate = now;
        extendedpools[poolId].LotteryPoolDrawDate = _drawDate;
        extendedpools[poolId].LotteryPoolCutOffDate =  extendedpools[poolId].LotteryPoolDrawDate - 2 days;
        extendedpools[poolId].TicketImageUploadDate = extendedpools[poolId].LotteryPoolCutOffDate + 1 days;
        pools[poolId].ended = false;
        if(pools[poolId].isUnlisted) {
            pools[poolId].secretToken = _secretToken;
        }
        else{
            pools[poolId].secretToken = 0;
        }
        poolId++;
        PoolCreated(msg.sender, pools[poolId-1].poolPlayerLimit,poolId-1, pools[poolId-1].isUnlisted,pools[poolId-1].secretToken, _drawDate,_tagName);
         
    }
    
    /**@dev Anyone can join a pool created by anyone by paying the ticket fee + small additional fee
     * @param _poolId UniqueID of the pool of integer type. it shall start from 1 and keep on incrementing
     * @param _leaderAddress Address of the leader of this pool
     * @param _isJoiningUnlistedPool if this pool is private then true, otherwise false
     * @param _secretToken if the pool is private, then leader has to provide a secret token to the participants to join his private pool
     * @return string giving information what have happened when someone tried to join a pool . Multiple scenario can happen.e.g. he may be the first person to join the pool. 
     * & may be the last. if last then we have to tackle those cases
     * modifiers some modifiers to keep a check that only valid data gets entered in the blockchain
    */
    function JoinPool(uint256 _poolId, address _leaderAddress ,bool _isJoiningUnlistedPool, uint256 _secretToken)
    // condition(msg.value >= 40000000)
    // onlyAfter(extendedpools[_poolId].LotteryPoolStartDate)
    // onlyBefore(extendedpools[_poolId].LotteryPoolCutOffDate)
    payable
    {
        if (pools[_poolId].ended == false){
            if(pools[_poolId].NoOfPlayersJoined == pools[_poolId].poolPlayerLimit ) { //check that did we reached the limit or not
                PlayerJoined(msg.sender, _poolId, now, "Pool Player Limit reached");
            }
            else { //we are yet to reach the limit
                
                
               if(_isJoiningUnlistedPool ){
                    if(pools[_poolId].isUnlisted){
                        if( pools[_poolId].secretToken == _secretToken){
                            // individual player information should get updated
                            poolPlayers[msg.sender].push(PoolPlayer({
                                joinedPoolId : _poolId ,
                                isJoined: true,
                                haveWithdrawn: false
                            })); // Length of this array shall be total no of the pools this guy have joined at any point of time.
                            
                            // the pool information should get updated.
                            pools[_poolId].NoOfPlayersJoined++;
                            PlayerJoined(msg.sender, _poolId, now, "Player Joined succesfully");
                           }
                        else {
                            PlayerJoined(msg.sender, _poolId, now, "Wrong Secret provided. Get correct secret from the Group Leader");
                        }
                    }
                    else {
                        PlayerJoined(msg.sender, _poolId, now, "The pool is public. You can join it without secret.");
                    }
                }
                else {
                    // to do : individual information should get updated
                    poolPlayers[msg.sender].push(PoolPlayer({
                        joinedPoolId : _poolId,
                        isJoined: true,
                        haveWithdrawn: false
                    })); // Length of this array shall be total no of the pools this guy have joined at any point of time.
                    pools[_poolId].NoOfPlayersJoined++;
                    PlayerJoined(msg.sender, _poolId, now, "Player Joined succesfully");
                }
                pools[_poolId].totalMoneyPooled += pools[_poolId].ticketCost; // adding the total money cumulated in the smart contract from this pool
                
                if(pools[_poolId].NoOfPlayersJoined == pools[_poolId].poolPlayerLimit  ){
                    var amount = pools[_poolId].totalMoneyPooled ;
                    /* if (amount >= pools[_poolId].ticketCost * pools[_poolId].poolPlayerLimit){*/
                        pools[_poolId].totalMoneyPooled = 0;
                        bool isSendSuccess = _leaderAddress.send(amount);
                        if(isSendSuccess){ 
                            extendedpools[_poolId].LotteryPoolCutOffDate = now ; // we're changing this because changing it will allow the leader to upload the ticket quickly.
                            UploadImage(_leaderAddress, pools[_poolId].poolPlayerLimit,_poolId); //this is the intimation to the leader to upload the ticket.
                        }
                        else {
                            
                           pools[_poolId].totalMoneyPooled = amount;
                           pools[_poolId].canFetchManually = true;
                            PlayerJoined(msg.sender, _poolId, now, "Total money is reached. But we faced some issue in transferring it to the Leader's Address. Try manually.");
                        }
                    /*}
                    else {
                        pools[_poolId].ended = true;
                        PlayerJoined(msg.sender, poolId, now, "Total money is not reached with the set player limit. Hence giving back the money and ending this pool");
    
                        //to do: give back all the money of all the participants
                    }*/
                    
                }
                
            }
        }
        else{
            throw;
        }
    }
    
    
    /**@dev After the total player limit is reached and the total amount gets collected in the smart contract, then leader has to upload the smart 
     * contract before the draw date and after the cut-off date. mentioned in the modifiers
     * @param _imageURLonIPFS Uniques Hash of the file uploaded on the IPFS. this shall contain the ticket images' URL that were uploaded on IPFS
     * @param _poolId UniqueID of the pool for which the leader has to upload these ticket images
     * modifiers some modifiers to keep a check that only valid data gets entered in the blockchain
    */
    function uploadTicketImages(string _imageURLonIPFS, uint256 _poolId)
    // condition()
    // onlyAfter(extendedpools[_poolId].LotteryPoolCutOffDate)
    // onlyBefore(extendedpools[_poolId].TicketImageUploadDate)
    {
        if(msg.sender == (pools[_poolId].leaderAddress)){
            pools[_poolId].IPFSLinkOfTickets = _imageURLonIPFS;
            ImageUploadedOnIPFS(msg.sender, _imageURLonIPFS, now, _poolId );
        }
        else {
            throw;
        }
    }
    
    /**@dev Ideally we shall have a script that shall fetch the list of the pools whose draw date is less than today's date and end those pool. So this method shall be used to end the pool externally or automatically
     * This can only be called after the draw date
     * @param _poolId UniqueID of the pool for which the leader has to upload these ticket images
     * modifiers some modifiers to keep a check that only valid data gets entered in the blockchain. 
    */
    function endPool(uint256 _poolId) 
    // condition()
    // condition()
    // onlyAfter(extendedpools[_poolId].LotteryPoolDrawDate)
    {
        if(msg.sender == (pools[_poolId].leaderAddress) && pools[_poolId].ended == false ){
            totalCompletedPools++;
            pools[_poolId].ended = true;
            PoolEnded(_poolId, now);
        }
        else{
            throw;
        }
        
    }
    
    /**@dev Method to update the basic profile parameter. Name and location only. For simplicity sake we are keeping this much details only. 
     * In future, this can be extended with varifiable entity using uPort or some digital identity mechanism. These details can be blank as well, if the player wants to be anonymous. 
     * In that case only address is enough, just like Ethereum or bitcoin. No names or location.
     * @param _name Name of the participant
     * @param _location location of the participant
    */
    function updateProfile (string _name, string _location) {
        profileDetails[msg.sender].playerAddress = msg.sender;
        profileDetails[msg.sender].name = _name;
        profileDetails[msg.sender].location = _location;
    }
    
    
    /**@dev To fetch the name and the location of the player as per his address
     * @param _address address of the participant
     * @return _name returns the name of the participant
     * @return  _location location of the participant
    */
    function getPlayerDetails(address _address) constant returns (string _name, string _location){
        return (profileDetails[_address].name, profileDetails[_address].location);
    }
    
    /**@dev To give his own address. Not needed just keeping for debugging purpose. sometimes metamask doesn't get injected and some random address gets passed'
     * @return  address address of the request maker
    */
    function myAddress() returns (address){
        return msg.sender;
    }
    
    event PullFundManually(string text);
    
    /**@dev This method is the fail-safe mechanism, if while sending the Ethers automatically in the "JoinPool" function fails for reason because send may fail in Ethereum.
     * this is a manual trigger for sending the funds to leader once the threshold reaches to the player limit and funds are accumulated in smart contract.
     * @param _poolId UniqueID of the pool
    */
    function pullFundsManually(uint256 _poolId)
    // condition()
    // onlyAfter(extendedpools[_poolId].LotteryPoolStartDate)
    // onlyBefore(extendedpools[_poolId].TicketImageUploadDate)
    // condition()
    {
        if(msg.sender == (pools[_poolId].leaderAddress) && pools[_poolId].canFetchManually == true){
            var amount = pools[_poolId].totalMoneyPooled ;
            if (pools[_poolId].NoOfPlayersJoined == pools[_poolId].poolPlayerLimit  && amount >= pools[_poolId].ticketCost * pools[poolId].poolPlayerLimit){
                bool isSendSuccess = pools[_poolId].leaderAddress.send(amount);
                if(isSendSuccess){ 
                    // pools[poolId].LotteryPoolCutOffDate = now ; // we're changing this because changing it will allow the leader to upload the ticket quickly.
                    UploadImage(pools[_poolId].leaderAddress, pools[poolId].poolPlayerLimit,poolId); //this is the intimation to the leader to upload the ticket.
                }
                PullFundManually( "Leader manually extracted the money from the pool.");
            }
            else {
                PullFundManually( "Somebody withdraw his participation due to which the money can't be extracted.Try when the money reached the threshold.");
            }
        } else {
            throw;
        }
    }
    
    event participatioWithdrawn(address indexed participantAddress, uint256 poolGlobalId, string msg);
    
    
    /**@dev Participant can withdraw from any game anytime. We shall return his money minus some fee for gas. as we can't pay for the gas. this may make the pool money less than the target amount.
     * @param _poolId UniqueID of the pool
     * @param _participantAddress Address of the participant who wants to withdraw his amoiun
     * modifiers Some modifiers to check that before getting out from the pool, some bare minimum conditions are met.
    */
    function WithdrawParticipation(uint256 _poolId, address _participantAddress) 
    // onlyAfter(extendedpools[_poolId].LotteryPoolStartDate)
    // onlyBefore(extendedpools[_poolId].LotteryPoolCutOffDate)
    // condition()
    // condition()
    
    {
        if (true == poolPlayers[_participantAddress][_poolId].isJoined && false == poolPlayers[_participantAddress][_poolId].haveWithdrawn) {
            var amount = pools[_poolId].ticketCost - 100000000000000000; // deducting only a small value for GAS. As otherwise this will be bourne by the contract, which we don't want
            pools[_poolId].totalMoneyPooled -= pools[_poolId].ticketCost;
            pools[_poolId].NoOfPlayersJoined--; //pool is updated here
            poolPlayers[_participantAddress][_poolId].isJoined = false; // this pools gets delisted from his personal list of pools which he joined.
            bool isSendSuccess = _participantAddress.send(amount); //send the reduced amount on the participant's address
            if(isSendSuccess){
                poolPlayers[_participantAddress][_poolId].haveWithdrawn = true;
                participatioWithdrawn(_participantAddress,_poolId,"Participation withdrawn successfully");
            }
            else {
                 poolPlayers[_participantAddress][_poolId].haveWithdrawn = false;
                 participatioWithdrawn(_participantAddress,_poolId,"Participation is not withdrawn suceessfully. Try again later.");
                 
            }
        } else {
            throw;
        }
    }
}
    
  
