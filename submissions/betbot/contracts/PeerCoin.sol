pragma solidity ^0.4.8;

contract PeerCoin {

    event GroupGet(
    address indexed _from,
    bytes32 indexed _name,
    bytes32 indexed _id,
    int _balance
  );

  modifier onlyGroupMember(bytes32 gid) {
    if (!groups[gid].isMember[msg.sender]) {
      throw;
    }
    _;
  }

  mapping (bytes32 => Group) public groups;
  mapping (address => User) public users;

  struct Group {
    mapping (address => int) balances;
    mapping (address => bool) isMember; //test if person is a member of the group
    address[] members; //an array to easily iterate through the members
    mapping (bytes32 => GroupBets) groupBets;
    bytes32[] groupBetsArray;
    bytes32[] bets;
    bytes32 name;
    bytes32 id;
    bool exists;
  }

  struct GroupBets {
    mapping (address => Bet) bets;
    address[] participants;
    bytes32 name;
    bytes32 description;
    bool exists;

    bytes32 state;
    address creator;

    uint tokensFor;
    uint tokensAgainst;

    uint forVote;
    uint againstVote;

    mapping(address => bool) voted;
  }

 struct Bet {
    bool stance;
    uint amount;
    bool isOpen;
    bool exists;
  }

  struct User {
    bytes32[] groups;
    bytes32[] groupBets;
    bytes32[] groupInvites;
    uint numberOfBets;
    uint numberOfPendingInvites; //Ugly but it had to be done
    mapping (bytes32 => bool) pendingInvite;
    bool exists;
  }

  address[] registeredUsers;

  function registerUser() {
      if(!users[msg.sender].exists){
          registeredUsers.push(msg.sender);
      }
  }

  function listRegisteredUsers() returns (address[] addr){
        return registeredUsers;
  }

  function createGroup (bytes32 gname, bytes32 gid) returns (bool) {
    if(!groups[gid].exists) {
      //create group
      Group memory newGroup;

      newGroup.name = gname;
      newGroup.exists = true;
      newGroup.id = gid;
      groups[gid] = newGroup;
      groups[gid].members.push(msg.sender);
      groups[gid].isMember[msg.sender] = true;

      // Add group to the users list of groups
      addToUsersGroup(gid);

      return true;
    } else {
      return false;
    }
  }

  function addBetGroup (bytes32 bgname, bytes32 bgdescription, bytes32 gid) returns( bool ){
    assert(groups[gid].exists);
    if(groups[gid].groupBets[bgname].exists){
        //bet group allready exists inside of the group
        return false;
    }
    users[msg.sender].groupBets.push(bgname);
    groups[gid].groupBets[bgname].exists = true;
    groups[gid].groupBets[bgname].name = bgname;
    groups[gid].groupBets[bgname].description = bgdescription;
    groups[gid].groupBets[bgname].state = "voting";
    groups[gid].groupBetsArray.push(bgname);
    return true;
  }

    function getGroupInfo (bytes32 gid) constant returns (bytes32[] _bets, address[] _members, int[] _balances){
      uint length = groups[gid].members.length;
      int[] memory balances = new int[](length);
      for (uint i = 0; i < length; i++) {
        address curMember = groups[gid].members[i];

        balances[i] = groups[gid].balances[curMember];
      }
      return (groups[gid].bets, groups[gid].members, balances);
    }

  function addBet(bytes32 bgid, bytes32 gid, bool bstance, uint bamount) {
      require(bamount == bamount);
      // I do not like that this 1000 is hard coded but it has to be
      Group group = groups[gid]; //gets the group
      require(group.isMember[msg.sender]);
      require(group.groupBets[bgid].state == "voting");
      require(!group.groupBets[bgid].bets[msg.sender].exists);
      //creates the bet
      group.groupBets[bgid].bets[msg.sender].stance = bstance;
      group.groupBets[bgid].bets[msg.sender].amount = 1000; //hardcoded this as rounding errors and etc might be tricky later on
      group.groupBets[bgid].bets[msg.sender].isOpen = true;
      group.groupBets[bgid].bets[msg.sender].exists = true;
      group.groupBets[bgid].participants.push(msg.sender);
      group.balances[msg.sender] -= int(1000);
      users[msg.sender].numberOfBets++;
      if(bstance){
          group.groupBets[bgid].tokensFor += 1000;
      }else{
          group.groupBets[bgid].tokensAgainst += 1000;
      }
      groups[gid] = group;
  }

  function changeState(bytes32 bgid, bytes32 gid){
    //   assert(groups[gid].groupBets[bgid].creator == msg.sender); not beautiful but we didn't hsve time to implement this in the UI
      groups[gid].groupBets[bgid].state = "voting";
  }

  function addToUsersGroup (bytes32 gid) internal {
    //TODO: Add more checks and security here:
    // iterate through to check if pressent? Or check in the group itself if this user is referenced in members.
    users[msg.sender].exists = true;
    users[msg.sender].groups.push(gid);
    groups[gid].isMember[msg.sender] = true;
  }

    function settleBet(bytes32 gid, bytes32 bgid, bool position){
      require(groups[gid].groupBets[bgid].state == "voting");
      require(groups[gid].groupBets[bgid].bets[msg.sender].exists);
      require(!groups[gid].groupBets[bgid].voted[msg.sender]);

      if(position){
          groups[gid].groupBets[bgid].forVote++;
      }else{
          groups[gid].groupBets[bgid].againstVote++;
      }
      uint total = groups[gid].groupBets[bgid].participants.length;
      uint amountToPayOut = 0;
      if(groups[gid].groupBets[bgid].forVote > total/2){
          //for vote wins
          amountToPayOut = (groups[gid].groupBets[bgid].tokensFor + groups[gid].groupBets[bgid].tokensAgainst)/(groups[gid].groupBets[bgid].tokensFor/1000);
          for(uint i = 0; i < groups[gid].groupBets[bgid].participants.length; i++){
             if(groups[gid].groupBets[bgid].bets[groups[gid].groupBets[bgid].participants[i]].stance){
                groups[gid].balances[groups[gid].groupBets[bgid].participants[i]] += int(amountToPayOut);
             }
         }
       groups[gid].groupBets[bgid].state == "closed";
      }else if(groups[gid].groupBets[bgid].againstVote > total/2){
          //against vote wins
          amountToPayOut = (groups[gid].groupBets[bgid].tokensAgainst + groups[gid].groupBets[bgid].tokensFor)/(groups[gid].groupBets[bgid].tokensAgainst/1000);
          for(uint j = 0; j < groups[gid].groupBets[bgid].participants.length; j++){
              if(!groups[gid].groupBets[bgid].bets[groups[gid].groupBets[bgid].participants[j]].stance){
                    groups[gid].balances[groups[gid].groupBets[bgid].participants[j]] += int(amountToPayOut);
              }
          }
          groups[gid].groupBets[bgid].state == "closed";

      }else if(groups[gid].groupBets[bgid].againstVote + groups[gid].groupBets[bgid].forVote == total){
          //it is a draw
          for(uint k = 0; j < groups[gid].groupBets[bgid].participants.length; k++){
                    groups[gid].balances[groups[gid].groupBets[bgid].participants[k]] += 1000;
          }

          groups[gid].groupBets[bgid].state == "closed";
      }
  }

    function listAllInvitiations(address addr) constant returns (bytes32[] invitations, bool[] pending){
        uint length = users[addr].groupInvites.length;
        invitations = new bytes32[](length);
        pending = new bool[](length);
        for(uint i = 0; i < length;i++){
            invitations[i] = users[addr].groupInvites[i];
            pending[i] = users[addr].pendingInvite[invitations[i]];
        }
        return (invitations,pending);
  }

  function listPendingInvites(address addr) constant returns (bytes32[] invitations){
      invitations = new bytes32[](users[addr].numberOfPendingInvites);
      uint count = 0;
      for(uint i = 0; i < users[addr].groupInvites.length; i++){
          if(users[addr].pendingInvite[users[addr].groupInvites[i]]){
            invitations[count++] = (users[addr].groupInvites[i]);
          }
      }
  }

    function inviteUser (bytes32 gid, address newMember) onlyGroupMember(gid) {
        // users[newMember].groupInvites.push(gid);
        users[newMember].pendingInvite[gid] = true;
        users[newMember].numberOfPendingInvites++;
        users[newMember].groupInvites.push(gid); // This should really be stored on a central server, not a good solution using an array like this.
        // Rather store in a server, and check with the previous line if they have an account.
        // this append only, so not scalable if user joins many many groups.
  }

  function acceptInvite(bytes32 gid) {
    if (!groups[gid].isMember[msg.sender] && users[msg.sender].pendingInvite[gid]) { // TODO:: do exists check also
      users[msg.sender].pendingInvite[gid] = false;
      groups[gid].members.push(msg.sender);
      groups[gid].isMember[msg.sender] = true;
      users[msg.sender].numberOfPendingInvites--;
      users[msg.sender].groups.push(gid);
    }
  }

  function isGroupIdUsed (bytes32 gid) constant returns( bool ) {
    return groups[gid].exists;
  }

  function listGroups(address uaddr) constant returns (bytes32[],bytes32[],int[]) {
//   function listGroups() constant returns (uint length) {
    /*uint length = people.length;*/
    uint length = users[uaddr].groups.length;

    bytes32[] memory groupIds = new bytes32[](length);
    bytes32[] memory groupNames = new bytes32[](length);
    int[] memory balances = new int[](length);

    // This for loop isn't too expensive because this function is 'constart'
    for (uint i = 0; i < length; i++) {
      bytes32 curGroupId = users[uaddr].groups[i];
      Group memory curGroup;
      curGroup = groups[curGroupId];

      groupIds[i] = curGroupId;
      groupNames[i] = curGroup.name;
      balances[i] = groups[curGroupId].balances[uaddr];
      /*GroupGet(uaddr, curGroup.name, curGroupId, groups[curGroupId].balances[uaddr]);*/
    }
    return (groupIds, groupNames,balances);
  }

  function listBetsByGID(bytes32 gid) constant returns (bytes32[] groupBet,uint[] forT, uint[] againstT) {
      Group group = groups[gid];
      groupBet = new bytes32[](group.groupBetsArray.length);
      forT = new uint[](group.groupBetsArray.length);
      againstT = new uint[](group.groupBetsArray.length);
      for(uint j = 0; j < group.groupBetsArray.length; j++){
            if(group.groupBets[group.groupBetsArray[j]].exists){
                groupBet[j] = (group.groupBetsArray[j]);
                forT[j] = group.groupBets[groupBet[j]].tokensFor;
                againstT[j] = group.groupBets[groupBet[j]].tokensAgainst;
            }

        }
  }

  function listMembers(bytes32 gid) constant returns (address[] memberID, int[] amount){
      Group group = groups[gid];
      memberID = new address[](group.members.length);
      amount = new int[](group.members.length);
      for(uint j = 0; j < group.members.length; j++){
            memberID[j] = group.members[j];
            amount[j] = group.balances[group.members[j]];
        }
  }

  function listGroupBets(address uaddr) constant returns(bytes32[] groupBets, bytes32[] groupID, bytes32[] groupBetsDiscription, bytes32[] state){
      groupBets = new bytes32[](users[msg.sender].groupBets.length);
      groupID = new bytes32[](users[msg.sender].groupBets.length);
      groupBetsDiscription  = new bytes32[](users[msg.sender].groupBets.length);
      state =  new bytes32[](users[msg.sender].groupBets.length);
      var(groupIds , , ) = listGroups(uaddr);
      for(uint i = 0; i < groupIds.length; i++){
          Group group = groups[groupIds[i]];
          for(uint j = 0; j < group.groupBetsArray.length; j++){
                if(group.groupBets[group.groupBetsArray[j]].bets[uaddr].exists){
                    groupBets[i*j] = (group.groupBetsArray[j]);
                    groupID[i*j] = (group.name);
                    groupBetsDiscription[i*j] = (group.groupBets[group.groupBetsArray[j]].description);
                    state[i*j] = (group.groupBets[group.groupBetsArray[j]].state);
                }
          }

      }
      return  (groupBets,groupID,groupBetsDiscription,state);
  }

  function listBets(address uaddr) constant returns (bool[] stance ,uint[] amount ,bytes32[] groupIDs,bytes32[] gbetID, bytes32[] state,bytes32[] groupNames) { //returns an array of bets name as well as a corrosponding array of groupbets that the bet belongs too
      uint length = users[uaddr].numberOfBets;
      stance = new bool[](length);
      gbetID = new bytes32[](length);
      amount = new uint[](length);
      groupIDs = new bytes32[](length);
      state = new bytes32[](length);
      groupNames = new bytes32[](length);
      var(groupIds , , ) = listGroups(uaddr);
      uint count = 0;
      for(uint i = 0; i < groupIds.length; i++){
          Group group = groups[groupIds[i]];
          for(uint j = 0; j < group.groupBetsArray.length; j++){
                if(group.groupBets[group.groupBetsArray[j]].bets[uaddr].exists){
                    stance[count] = (group.groupBets[group.groupBetsArray[j]].bets[uaddr].stance);
                    amount[count] = (group.groupBets[group.groupBetsArray[j]].bets[uaddr].amount);
                    groupIDs[count] = (group.id);
                    state[count] = (group.groupBets[group.groupBetsArray[j]]).state;
                    gbetID[count] = (group.groupBetsArray[j]);
                    groupNames[count++] = group.name;
                }
          }
      }
      return (stance,amount,groupIDs,gbetID,state,groupNames);
    }

  function sendToken(address toAdr, bytes32 gid, uint amount) returns (int balance){
    require(groups[gid].isMember[toAdr]);
    require(groups[gid].isMember[msg.sender]);
    groups[gid].balances[msg.sender] = groups[gid].balances[msg.sender] - int(amount);
    groups[gid].balances[toAdr] = groups[gid].balances[toAdr] + int(amount);
    return groups[gid].balances[msg.sender];
  }

  function getbalance(bytes32 gid) constant returns (int balance) {
      return groups[gid].balances[msg.sender];
  }

  //for debugging:
  function getSenderAddress() constant returns (address) {
      return msg.sender;
  }

}
