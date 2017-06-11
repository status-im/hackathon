pragma solidity ^0.4.11;

contract Ethcrow {
    struct Arbiter{
        address arbiter;
        string avatar;
        string specialty;
        string profile;
        uint karma;
        uint exp;
    }
    struct Contract {
        string desc; 
        Proof creator_pow;
        Proof signer_pow;
        uint value;  
        address arbiter; 
        bool is_arbiter;
        address creator;
        address signer;
        bool creator_signed;
        bool signer_signed;
        bool arbitration_ended;
        bool creator_completed;
        bool signer_completed;
        bool dispersed;
        bool is_dispute;
        Conversation[] dispute;
        Resolution resolution;
        uint creator_rating;
        uint signer_rating;        
    }
    struct Conversation{
        string text;
        address author;
        uint time;
    }   
    struct Person{
        address addr;
        string avatar;
        string profile;
        uint exp ;
        uint time;
        uint rating;
        uint rating_count;
    }    
    struct Proof{
        string format;
        string value;
        uint time;
    }
    struct Resolution{
        address winner;
        address loser;
        string reason;
        uint winning_percent;
        uint losing_percent;
        uint time;
    }    
    address Owner;
    address Supreme_Arbiter;
    uint Contract_Id;
    uint fee;
    address[] Arbiter_Array;
    address[] People_Array;
    
    mapping(address => Arbiter) Arbiters;
    mapping(uint => Contract) Contracts;
    mapping(address => Person) People;
    mapping(address => uint[]) Read;
    mapping(address => uint[]) Written;    
    function Ethcrow()
        {
            Owner = msg.sender;
            Supreme_Arbiter = msg.sender;
            fee = 999;
            Arbiters[msg.sender] = Arbiter({karma:999,avatar:"http://goo.gl/WFHDTL",specialty:"Contract Management",profile:"Yo dawg, I heard you like Contracts",exp:999,arbiter:msg.sender});
			Arbiter_Array.push(msg.sender);
        }
    function (){throw;}
    function add_arbiter(string ind,string img, string info) payable returns (int result)
        {
            if(msg.value < fee)throw;
            if(Arbiters[msg.sender].arbiter != msg.sender)
                {
                    Arbiter_Array.push(msg.sender);
                }
            Arbiters[msg.sender] = Arbiter({karma:Arbiters[msg.sender].karma,avatar:img,profile:info,specialty:ind,exp:Arbiters[msg.sender].exp,arbiter:msg.sender});
            Arbiter_Array.push(msg.sender);
            return 0;
        }
    function add_person(string img, string info) payable returns (int result)
        {
            if(msg.value < fee)throw;
            if(People[msg.sender].addr != msg.sender)
                {
                    People_Array.push(msg.sender);
                }
            People[msg.sender] = Person({rating_count:People[msg.sender].rating_count,addr:msg.sender,rating:People[msg.sender].rating,avatar:img,profile:info,exp:People[msg.sender].exp,time:block.number});
            return 0;
        }        
	function check_arbiter_1_2(address id) constant returns (uint exp,uint karma,string avatar,string profile)
	   {
	        return (Arbiters[id].exp,Arbiters[id].karma,Arbiters[id].avatar,Arbiters[id].profile);
	   } 
	function check_arbiter_2_2(address id) constant returns (address addr,string speciality)
	   {
	        return (Arbiters[id].arbiter,Arbiters[id].specialty);
	   } 	   
	function check_contracts_owned() constant returns(uint[] written,uint[] read)
		{
		    return (Written[msg.sender],Read[msg.sender]);
		}
	function check_contract_1(uint id) constant returns (string description,string creator_pow,string signer_pow,uint value,address arbiter,address creator,address signer)
	    {
	        if(Contracts[id].arbiter != msg.sender && Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender) throw;
	        return (Contracts[id].desc,Contracts[id].creator_pow.value,Contracts[id].signer_pow.value,Contracts[id].value,Contracts[id].arbiter,Contracts[id].creator,Contracts[id].signer);
	    }
	function check_contract_2(uint id) constant returns (bool creator_signed,bool signer_signed,bool is_arbiter,bool arbitration_ended,uint creator_rating,uint signer_rating)
	    {
	        if(Contracts[id].arbiter != msg.sender && Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender) throw;
	        return (Contracts[id].creator_signed,Contracts[id].signer_signed,Contracts[id].is_arbiter,Contracts[id].arbitration_ended,Contracts[id].creator_rating,Contracts[id].signer_rating);
	    }
	function check_contract_3(uint id) constant returns (bool creator_completed,bool signer_completed,bool is_dispute,bool dispersed,uint dispute_legnth,uint creator_pow_time,uint signer_pow_time)
	    {
	        if(Contracts[id].arbiter != msg.sender && Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender) throw;
	        return (Contracts[id].creator_completed,Contracts[id].signer_completed,Contracts[id].is_dispute,Contracts[id].dispersed,Contracts[id].dispute.length,Contracts[id].creator_pow.time,Contracts[id].signer_pow.time);
	    }
	function check_contract_4(uint id) constant returns (address winner, address loser, string reason, uint winning_percent,uint losing_percent,uint time)
	    {
	        if(Contracts[id].arbiter != msg.sender && Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender) throw;
	        return (Contracts[id].resolution.winner,Contracts[id].resolution.loser,Contracts[id].resolution.reason,Contracts[id].resolution.winning_percent,Contracts[id].resolution.losing_percent,Contracts[id].resolution.time);
	    }
    function complete_contract(uint id,string proof,string ftype) returns (int result)
        {
            if(Contracts[id].dispersed == true || Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender) throw;
		    if(Contracts[id].creator == msg.sender)
		        {
		            Contracts[id].creator_completed = true;
		            Contracts[id].creator_pow = Proof({format:ftype,value:proof,time:block.number});	
		        }
		    if(Contracts[id].signer == msg.sender)
		        {
		            Contracts[id].signer_completed = true;
                    Contracts[id].signer_pow = Proof({format:ftype,value:proof,time:block.number});		            
		        }          
		    return 0;
        }	 
    function create_contract(string info,address signer,int arbiter_choice,address optional_arbiter) payable returns (int result)
        {
            if(msg.sender == optional_arbiter || msg.sender == signer) throw;
            Contracts[block.number].desc = info;
            Contracts[block.number].value = msg.value;
            if(arbiter_choice == 0){Contracts[block.number].is_arbiter = true;Contracts[block.number].arbiter = Supreme_Arbiter;Read[Supreme_Arbiter].push(block.number);}
            if(arbiter_choice == 1)
				{
					if(Arbiters[optional_arbiter].arbiter != optional_arbiter)throw;
					Contracts[block.number].is_arbiter = true;
					Read[optional_arbiter].push(block.number);
					Contracts[block.number].arbiter = optional_arbiter;
				}
            Contracts[block.number].desc = info;
            Contracts[block.number].creator = msg.sender;
            Contracts[block.number].signer = signer;
            Written[msg.sender].push(block.number); 
            Read[signer].push(block.number);
            return 0;
        }        
    function dispute(uint id,string disp) returns (int result)
        {
            if(Contracts[id].arbiter != msg.sender && Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender)throw;
            if(Contracts[id].dispersed == true)throw;
            if(Contracts[id].is_arbiter != true)throw;
            if(!Contracts[id].is_dispute){Contracts[id].is_dispute = true;}
            Contracts[id].dispute.push(Conversation({text:disp,author:msg.sender,time:block.number}));
            return 0;
        }	    
	function get_arbiter() constant returns (address addr,string avatar, string profile,string specialty,uint exp,uint karma)
	    {
	        return (Arbiters[Supreme_Arbiter].arbiter,Arbiters[Supreme_Arbiter].avatar,Arbiters[Supreme_Arbiter].profile,Arbiters[Supreme_Arbiter].specialty,Arbiters[Supreme_Arbiter].exp,Arbiters[Supreme_Arbiter].karma);
	    }	
	function get_all_arbiters() constant returns (address[] arbiters)
	    {
            return Arbiter_Array;
	    }		    
	function get_all_people() constant returns(address[] people)
	    {
	        return People_Array;
	    }
	function get_person(address id) constant returns (uint rating_count,uint rating, string avatar, string profile, uint exp)
		{
			return (People[id].rating_count,People[id].rating,People[id].avatar,People[id].profile,People[id].exp);		
		}
	function kill_contract(uint id) returns (int result)
	    {
	       if(Contracts[id].creator != msg.sender || Contracts[id].signer_signed == true || Contracts[id].dispersed == true) throw;
	       Contracts[id].dispersed = true;
	       Contracts[id].creator_pow.value = "Contract KILLED!";
	       msg.sender.transfer(Contracts[id].value);
	       return 0;
	    }
	function rating(uint id,address user,uint star) returns (int result)
	    {
	        if(Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender)throw;
	        if(Contracts[id].signer != user && Contracts[id].creator != user)throw;
	        if(star < 1 || star > 5 || msg.sender == user || !Contracts[id].dispersed)throw;
	        if(msg.sender == Contracts[id].creator)
	            {
	                if(Contracts[id].signer_rating > 0)throw;
					else
						{
							Contracts[id].signer_rating = star;
						}
	            }
	        if(msg.sender == Contracts[id].signer)
	            {
	                if(Contracts[id].creator_rating > 0)throw;
	                else
						{
							Contracts[id].creator_rating = star;
						}
	            }	 
	        People[user].rating_count++;
			People[user].rating = People[user].rating + star;
			People[user].exp++;               
	        return 0;
	    }
	function resolve(uint id,address winner,address loser,uint winning_percent,uint losing_percent,string reason) returns (int result)
	    {
	        if(Contracts[id].arbiter != msg.sender || Contracts[id].dispersed == true || Contracts[id].arbitration_ended == true) throw;
            if((winning_percent + losing_percent) > 95)throw;
            if(winning_percent < losing_percent)throw;
            Contracts[id].arbitration_ended = true;
            Contracts[id].resolution.winner = winner;
            Contracts[id].resolution.loser = loser;
            Contracts[id].resolution.winning_percent = winning_percent;
            Contracts[id].resolution.losing_percent = losing_percent;
            Contracts[id].resolution.time = block.number;
            Contracts[id].resolution.reason = reason;
            return 0;
	    }
    function retract(uint id) returns (int result)
        {
            if(Contracts[id].creator != msg.sender || Contracts[id].signer_signed == true || Contracts[id].dispersed == true) throw;
            Contracts[id].dispersed = true;
            Contracts[id].creator.transfer(Contracts[id].value);
            return 0;
        }    
	function sign(uint id) returns (int result)
		{
            if(Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender && Contracts[id].arbiter != msg.sender)throw;
            if(Contracts[id].dispersed == true)throw;
		    if(Contracts[id].creator == msg.sender){Contracts[id].creator_signed = true;}
		    if(Contracts[id].signer == msg.sender){Contracts[id].signer_signed = true;}
		    return 0;
		}	    
	 function withdraw_karma(uint amount) returns (int result)
	    {
	        if(Arbiters[msg.sender].karma < amount)
	            throw;
	       Arbiters[msg.sender].karma = Arbiters[msg.sender].karma - amount;
	       Arbiters[msg.sender].arbiter.transfer(amount);
	       if(Supreme_Arbiter == msg.sender)
	        {
	            if(Arbiters[msg.sender].karma < Arbiters[Owner].karma)
	                {
	                    Supreme_Arbiter = Owner;
	                }
	        }
	       return 0;
	    }
	 function withdraw_from_contract(uint id) returns (int result)
	    {
	        if(Contracts[id].dispersed == true) throw;
	        //disperse contract
		    if(!Contracts[id].is_arbiter)
		        {
		            if(Contracts[id].creator_signed && Contracts[id].signer_signed && Contracts[id].creator_completed && Contracts[id].signer_completed)
		                {
		                    Contracts[id].dispersed = true;
		                    Contracts[id].signer.transfer(Contracts[id].value * 999/1000);
		                }
		            return 0;
		        }
		    else
		        {
		            if(Contracts[id].is_dispute && !Contracts[id].arbitration_ended)throw;
		            if(!Contracts[id].is_dispute && Contracts[id].creator_signed &&  Contracts[id].signer_signed && Contracts[id].creator_completed && Contracts[id].signer_completed)
		                {
		                    Contracts[id].dispersed = true;
		                    Contracts[id].signer.transfer(Contracts[id].value * 99/100);
		                }
		          
		            if(Contracts[id].is_dispute && Contracts[id].arbitration_ended &&(Contracts[id].creator == Contracts[id].resolution.winner || Contracts[id].resolution.winner == Contracts[id].signer) )
		                {
		                    if((Contracts[id].resolution.winning_percent + Contracts[id].resolution.losing_percent) > 80)throw;
		                    Arbiters[Contracts[id].arbiter].exp = Arbiters[Contracts[id].arbiter].exp +1;
		                    var w_amount = (Contracts[id].value *  Contracts[id].resolution.winning_percent)/100;
		                    var l_amount = (Contracts[id].value *  Contracts[id].resolution.losing_percent)/100;
		                    Contracts[id].dispersed = true;
		                    Contracts[id].resolution.winner.transfer(w_amount);
		                    Contracts[id].resolution.loser.transfer(l_amount);
		                }
		            Arbiters[Contracts[id].arbiter].exp = Arbiters[Contracts[id].arbiter].exp + 1;
		            Arbiters[Contracts[id].arbiter].karma = Contracts[id].value/6;
		            if(Arbiters[Contracts[id].arbiter].karma > Arbiters[Supreme_Arbiter].karma)
		                {
		                    if(Supreme_Arbiter != Arbiters[Contracts[id].arbiter].arbiter)
		                        {Supreme_Arbiter = Arbiters[Contracts[id].arbiter].arbiter;}
		                }
		            return 0;
		        }
	       
	    }
	 function update_fee(uint new_fee) payable returns (int result)
	    {
	        if(msg.sender != Supreme_Arbiter)throw;
	        fee = new_fee;
	        return 0;
	    }
	 function view_dispute_text(uint id,uint idt) constant returns(uint time,address author,string text)
	    {
	       if(Contracts[id].arbiter != msg.sender && Contracts[id].signer != msg.sender && Contracts[id].creator != msg.sender) throw;
            return (Contracts[id].dispute[idt].time,Contracts[id].dispute[idt].author,Contracts[id].dispute[idt].text);
	    }
}
