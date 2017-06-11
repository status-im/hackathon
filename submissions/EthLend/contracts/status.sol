
pragma solidity ^0.4.2;

contract AccountContract { // Account contract 
    struct LenderAccount //  LenderAccount structure
    {
        bytes32 name;
        uint256 max_amount;
        uint256 min_amount;
        uint interest;
        
        bytes32 account_type;
    }

    // map of accounts
    mapping(address => LenderAccount) lenderAccounts;
    
      struct BorrowerAccount //  BorrowerAccount structure
    {
        bytes32 name;
        bytes32 account_type;
    }

    // map of accounts
    mapping(address => BorrowerAccount) borrowerAccounts;
    
     event Testing( uint  reqId,address  from, bytes32  data);
    
    address[] userList;
      uint userNos;
     
     //constructor
    function AccountContract()
    {
        userNos=0;
        userList=new address[](10);
    }
  
  //only lender   
    function checkAccountExists() constant returns(bool) {
        if (lenderAccounts[msg.sender].name == "") {
            return false;
        } else {
            return true;
        }
    }
    

    // new Lender account function
    function newLender(bytes32 name, uint256 min_amount,uint256 max_amount,uint interest) {

            // if(lenderAccounts[msg.sender].name =="")
            //   {
            //   Testing(1,msg.sender,"done");
            //     userList[userNos]=msg.sender;
            //     userNos++;
            // }
       
            lenderAccounts[msg.sender].name = name;
            lenderAccounts[msg.sender].max_amount = max_amount;
            lenderAccounts[msg.sender].min_amount = min_amount;
            lenderAccounts[msg.sender].interest=interest;
          
            lenderAccounts[msg.sender].account_type = "lender";
             userList[userNos]=msg.sender;
            userNos++;
            
       

    }
    
      // new Borrower account function
    function newBorrower(bytes32 name) {


            borrowerAccounts[msg.sender].name = name;
            borrowerAccounts[msg.sender].account_type = "borrower";
           
            // userList[userNos]=msg.sender;
            // userNos++;
      

    }

    // get lender name function
    function getName(address addr) constant returns(bytes32) {
        
        if(lenderAccounts[addr].name != "")
         return lenderAccounts[addr].name;
         else return borrowerAccounts[addr].name;
    }
    
    
  
    // borrow function return list of lenders
    function getAllLenders(uint amount) constant returns( address[] memory, bytes32[] memory, uint256[] memory, uint256[] memory, uint[] memory) {
               address[] memory addr;
               bytes32[] memory name;
               uint256[] memory max;
               uint256[] memory min;
               uint[] memory interest;
              uint arrayLength=0; 
               for (uint i = 0; i < userNos; i++) {
                 if( ( lenderAccounts[userList[i]].account_type == 'lender')  && (amount <= lenderAccounts[userList[i]].max_amount)  && (amount >= lenderAccounts[userList[i]].min_amount)   )
                  {
                    arrayLength++;
                  }
               }
    
             addr = new address[](arrayLength);
             name = new bytes32[](arrayLength);
             max = new uint256[](arrayLength);
             min = new uint256[](arrayLength);
             interest = new uint[](arrayLength);
            uint  count=0;
             for ( i = 0; i < userNos; i++) {
                 
                 if( ( lenderAccounts[userList[i]].account_type == 'lender')  && (amount <= lenderAccounts[userList[i]].max_amount)  && (amount >= lenderAccounts[userList[i]].min_amount)   )
                  {
                   addr[i]=userList[i];
                   address temp = userList[i];
                     name[count]= lenderAccounts[temp].name;
                       min[count]= lenderAccounts[temp].min_amount;
                      max[count]= lenderAccounts[temp].max_amount;
                      
                      interest[count]= lenderAccounts[temp].interest;
                  count++;
                  }
                 
             }
         
   
              return (addr,name,max,min,interest);
    }

    // test function
    function getSender() constant returns(address) {
        return msg.sender;
    }

}

contract RequestContract is AccountContract{ // Request Contract


    struct Request { // Request structure
        uint reqId;
        address from;
        address to;
        bytes32 status;
        uint256 date;
        uint256 amount;
        uint256 due_amount;
        uint256 duration;
        bytes32 purpose;
         }
    uint totalReq = 0;
    // map of Requests
    mapping(uint => Request) request;
    mapping(address => uint[]) incomingRequest;
    mapping(address => uint[]) outgoingRequest;
   

    //Events for requests
    event RequestMoney( uint indexed reqId,address indexed from, address indexed to);
    event AcceptRequest(uint indexed reqId, address indexed from, address indexed to);
   // event RejectRequest(uint indexed reqid, address indexed from, address indexed to);
       event Payback(uint indexed reqid, address indexed from, address indexed to);

    function borrowRequest(address userId,uint256 amount, uint256 duration, bytes32 purpose) {

        totalReq++;
        uint256 rhs=( ((lenderAccounts[userId].interest/100)*100)+(lenderAccounts[userId].interest%100) )/100;
        uint256 lhs=amount/100;
       uint256 temp =amount+(lhs*rhs);
        request[totalReq] = Request({
            reqId: totalReq,
            from:msg.sender,
            to: userId,
            status: "requested",
            date: now,
            amount: amount ,
            duration: duration,
            purpose: purpose,
            due_amount:temp
          
        });

        outgoingRequest[msg.sender].push(totalReq);
        incomingRequest[userId].push(totalReq);
        RequestMoney(totalReq,userId, msg.sender); // request event


    }
    
    // accept request function
    function acceptRequest(uint reqid) payable {
        if (reqid > totalReq || reqid <= 0 || msg.value != request[reqid].amount || request[reqid].status !='requested' ) {
            throw;
        } else {
            if (request[reqid].to == msg.sender) {
                request[reqid].status = "accepted";
                  request[reqid].from.send(msg.value);
                
                            }
        }
        AcceptRequest(reqid, msg.sender, request[reqid].from); // accept event
    }
    
     // payback request function
    function payback(uint reqid) payable {
        if (reqid > totalReq || reqid <= 0 || msg.value != request[reqid].due_amount || request[reqid].status !='accepted'   ) {
            throw;
        } else {
            if (request[reqid].from == msg.sender) {
                request[reqid].status = "settled";
                  request[reqid].to.send(msg.value);
                
                }
        }
        Payback(reqid, msg.sender, request[reqid].to); // accept event
    }
   
    // reject request function
    // function rejectRequest(uint reqid) {
    //     if (reqid > totalReq && reqid <= 0) {
    //         throw;
    //     } else {
    //         if (request[reqid].to == msg.sender) {
    //             request[reqid].status = "rejected";
    //                       }
    //     }
    //     RejectRequest(reqid, msg.sender, request[reqid].from); // reject event
    // }
    
    // get incoming request function
    function getIncomingRequests() constant returns(uint[]  memory, address[]  memory,  bytes32[]  memory,uint256[] memory, uint256[]  memory, uint256[]  memory , bytes32[]  memory) {
       
       uint[] memory id;
       address[]  memory from;
       bytes32[] memory status;
      
       uint256[] memory  amount;
       uint256[] memory duration;
       bytes32[] memory purpose;
       uint256[] memory due_amount;
       
       id = new uint[](incomingRequest[msg.sender].length);
       from = new address[](incomingRequest[msg.sender].length);
       status = new bytes32[](incomingRequest[msg.sender].length);
       
       amount = new uint256[](incomingRequest[msg.sender].length);
       duration = new uint256[](incomingRequest[msg.sender].length);
       purpose = new bytes32[](incomingRequest[msg.sender].length);
       due_amount = new uint256[](incomingRequest[msg.sender].length);
       
        for(uint i=0; i< incomingRequest[msg.sender].length;i++) {
            uint  reqId = incomingRequest[msg.sender][i];
            id[i] = request[reqId].reqId;
            from[i] = request[reqId].from;
            status[i] = request[reqId].status;
           
            amount[i] = request[reqId].amount;
            purpose[i] = request[reqId].purpose;
            duration[i] = request[reqId].duration;
            due_amount[i] = request[reqId].due_amount;
            
         }
         return (id,from,status,due_amount,amount,duration,purpose);
    }
    
     // get outgoing request function
    function getOutgoingRequests() constant returns(uint[]  memory, address[]  memory,  bytes32[]  memory,uint256[] memory, uint256[]  memory, uint256[]  memory , bytes32[]  memory) {
       
       uint[] memory id;
       address[]  memory from;
       bytes32[] memory status;
       uint256[] memory  amount;
       uint256[] memory duration;
       bytes32[] memory purpose;
       uint256[] memory due_amount;
       id = new uint[](outgoingRequest[msg.sender].length);
       from = new address[](outgoingRequest[msg.sender].length);
       status = new bytes32[](outgoingRequest[msg.sender].length);
       amount = new uint256[](outgoingRequest[msg.sender].length);
       duration = new uint256[](outgoingRequest[msg.sender].length);
       purpose = new bytes32[](outgoingRequest[msg.sender].length);
       due_amount = new uint256[](outgoingRequest[msg.sender].length);
        for(uint i=0; i< outgoingRequest[msg.sender].length;i++) {
            uint  reqId = outgoingRequest[msg.sender][i];
            id[i] = request[reqId].reqId;
            from[i] = request[reqId].from;
            status[i] = request[reqId].status;
            amount[i] = request[reqId].amount;
            purpose[i] = request[reqId].purpose;
            duration[i] = request[reqId].duration;
            due_amount[i] = request[reqId].due_amount;
         }
         return (id,from,status,due_amount,amount,duration,purpose);
    }
    

}


// Digital locker contract
contract microLending is   RequestContract {

    address owner = msg.sender;
    // reset data function
    // function resetData() {

    //     delete accounts[msg.sender];
  
    //     for (uint j = 0; j < totalReq; j++)
    //         delete request[j];
    //     delete totalReq;
    // }


}



