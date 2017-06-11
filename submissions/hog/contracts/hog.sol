/* Copyright (C) Etherplay <contact@etherplay.io> - All Rights Reserved */
pragma solidity 0.4.11;

contract Hog {

/////////////////////////////////////////////////////////////////// DATA /////////////////////////////////////////////////////////////
    struct State{
        bytes32 hash;

        uint64 lastTime;  //can be used as a unique seed for the starter (2nd player)
        uint32 minSzabo;
        uint32 maxSzabo;
        uint32 szaboPaid;
        uint16 periodInMinutes;
        uint8 p1NumUnits;
        uint8 p2NumUnits;
        uint8 turn;
        int8 position;
        uint8 move1;
        uint8 move2;
    }
    
    struct Game{
        State state;
        address shadow;
        uint256 otherSlot; //used as otherPlay for invites
    }
    
    mapping (uint256 => Game) games; 

    mapping (address => uint256) occupancy;

    //TODO 

    // struct Conf{
    //     uint8 feePerTHousand;
    //     address gameDeveloper;     
    // }
    
    // Conf conf;

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////////////// EVENTS /////////////////////////////////////////////////////////////

    //TODO 

    // event Create(
    //  address indexed creator,
    //  address indexed starter
    //  // bytes32 codeHash // the sha256 of the game code as used by the player
    // );

    // event Start(
    //  address indexed creator,
    //  address indexed starter
    //  // bytes32 codeHash // the sha256 of the game code as used by the player
    // );

    // event End(
    //  address indexed creator,
    //  address indexed starter
    //  // bytes32 codeHash // the sha256 of the game code as used by the player
    // );


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function getSlot(address addr, uint8 index) internal returns (uint256 slot ){
        assembly {
            slot := add(addr, mul(1461501637330902918203684832716283019655932542976,index))
        }
    }

    function create_game(uint8 slotIndex, uint32 minSzabo, uint32 maxSzabo, uint8 numUnits, uint16 periodInMinutes, address shadow, uint256 allowance) payable {
        
        uint256 value = msg.value - allowance; //compute the value used by substratcing allowance that pay for the shadow
        
        uint256 slot = getSlot(msg.sender, slotIndex);
        
        if((games[slot].state.turn == 0 || games[slot].state.turn == 1) //should not have a game started
        && maxSzabo < 2147483647 //max szabo allowed uint max divided by 2 player
        && value >= uint256(maxSzabo) * 1 szabo   //should paid enough to cover the maxprice
        && numUnits > 5 && numUnits < 127
        ){
            games[slot] = Game({
                state : State({
                    szaboPaid : uint32(value / 1 szabo), //if sending too much you will lose money
                    minSzabo : minSzabo,
                    maxSzabo : maxSzabo,
                    periodInMinutes : periodInMinutes,
                    p1NumUnits : numUnits, 
                    p2NumUnits : numUnits, 
                    position : 0,
                    turn : 1,
                    lastTime : uint64(now),
                    move1 : 0,
                    move2 : 0,
                    hash : 0 //TODO reset to 1 ?
                }),
                shadow : shadow,
                otherSlot : 0
            });
            occupancy[msg.sender] |= 2**uint256(slotIndex);
            
            shadowAllowance(shadow,allowance);
            
        }else{
            throw;
        }
    }
    
    function shadowAllowance(address shadow, uint256 allowance)  internal{
        if(allowance > 0){
            shadow.transfer(allowance);
        }
    }
    
    function create_game_invite(uint8  slotIndex, address otherPlayer, uint32 minSzabo, uint32 maxSzabo, uint8 numUnits, uint16 periodInMinutes, address shadow, uint256 allowance) payable {
        
        uint256 value = msg.value - allowance; //compute the value used by substratcing allowance that pay for the shadow
        
        uint256 slot = getSlot(msg.sender, slotIndex);
        
        if((games[slot].state.turn == 0 || games[slot].state.turn == 1) //should not have a game started
        && maxSzabo < 2147483647 //max szabo allowed uint max divided by 2 player
        && value >= uint256(maxSzabo) * 1 szabo   //should paid enough to cover the maxprice
        && numUnits > 5 && numUnits < 127
        ){
            games[slot] = Game({
                state : State({
                    szaboPaid : uint32(value / 1 szabo), //if sending too much you will lose money
                    minSzabo : minSzabo,
                    maxSzabo : maxSzabo,
                    periodInMinutes : periodInMinutes,
                    p1NumUnits : 50, //TODO parametrize?
                    p2NumUnits : 50, //TODO parametrize?
                    position : 0,
                    turn : 1,
                    lastTime : uint64(now),
                    move1 : 0,
                    move2 : 0,
                    hash : 0 //TODO reset to 1 ?
                }),
                shadow : shadow,
                otherSlot : getSlot(otherPlayer,0) //slot 0 is the actual address
            });
            
            occupancy[msg.sender] |= 2**uint256(slotIndex);

            shadowAllowance(shadow,allowance);    
        }else{
            throw;
        }
    }
    
    function start_game(uint8  slotIndex, uint168 otherSlot, uint8 numUnits, uint16 periodInMinutes, address shadow, uint256 allowance) payable {
        
        uint256 value = msg.value - allowance; //compute the value used by substratcing allowance that pay for the shadow
        
        uint256 slot = getSlot(msg.sender, slotIndex);
        address otherPlayer = address(otherSlot);
        
        if(otherPlayer != msg.sender //do not allow player to play with itself (not supported and pointless)
        && games[otherSlot].state.turn == 1 //game should have been created but not have started  
        && games[slot].state.turn == 0 //your slot should be available  
        && (games[otherSlot].otherSlot == 0 || address(games[otherSlot].otherSlot) == msg.sender) //no player invited or invite match
        && games[otherSlot].state.p1NumUnits == numUnits // check condition match
        && games[otherSlot].state.periodInMinutes == periodInMinutes // check condition match
        && games[otherSlot].state.minSzabo <= (value/ 1 szabo) // check condition match
        && games[otherSlot].state.maxSzabo >= (value/ 1 szabo) // check condition match
        && now - games[otherSlot].state.lastTime < games[otherSlot].state.periodInMinutes*60 // in the allowed period
        ){
            games[slot].otherSlot = otherSlot; //set your game to be with the otherPlayer slot
            games[slot].state.turn = 255; // 255 indicate to look other slot
            games[slot].state.lastTime =  games[otherSlot].state.lastTime; //save the ceationTime there
            games[slot].shadow = shadow;
            var paid = uint256(games[otherSlot].state.szaboPaid) * 1 szabo;
            if(paid > value){
                otherPlayer.transfer(paid - value); //send extra ether to creator
            }

            games[otherSlot].state.lastTime = uint64(now);
            games[otherSlot].otherSlot = slot; // tell the otherPlayer to associate yours slot
            games[otherSlot].state.turn = 2; // set the turn value to 2 for started indicator
            games[otherSlot].state.szaboPaid = uint32(value / 1 szabo) * 2; // save the value paid by both players
            

            occupancy[msg.sender] |= 2**uint256(slotIndex);

            shadowAllowance(shadow,allowance);
            
        }else{
            throw;
        }
    }
    
    function move(uint256  slot, bytes32 hash){ 
        var game = games[slot]; 

        //TODO for every method ? this would allow to specify the any of the 2 slot 
        // if(game.state.turn == 255){
        //     game = games[game.otherSlot];
        // }

        if(game.state.turn == 2 // if game just started
        && (address(game.otherSlot) == msg.sender || games[game.otherSlot].shadow == msg.sender) //only player 2
        && now - game.state.lastTime < game.state.periodInMinutes*60 // in the allowed period
        ){ 
            game.state.turn = 3; //first move done
            games[slot].state.hash = hash;
            games[slot].state.lastTime = uint64(now);
        }else{
            throw;
        }
    }
    
    function move_reveal(uint256  slot, uint8 move){ //after a move or reveal_move
        var game = games[slot]; 
        
        if(game.state.turn >= 3 && game.state.turn != 255 && game.state.turn % 2 == 1 // move done
        && (address(slot) == msg.sender || game.shadow == msg.sender) // only player 1
        && now - game.state.lastTime < game.state.periodInMinutes*60 // in the allowed period
        ){ 
            
            if((game.state.p1NumUnits > 0 && move == 0) || move > game.state.p1NumUnits){
                throw;
            }
            game.state.move1 = move;
            game.state.turn ++; //move_reveal done
            game.state.lastTime = uint64(now);
        }else{
            throw;
        }
    }

    //TODO alow to use the content of that function for a end_reveal ? 
    function reveal_move(uint256  slot, uint8 move, bytes32 secret, bytes32 hash){ //after a move_reveal
        var game = games[slot]; 
        
        if(game.state.turn >= 4 && game.state.turn % 2 == 0
        && (address(game.otherSlot) == msg.sender || games[game.otherSlot].shadow == msg.sender) //only player 2
        && now - game.state.lastTime < game.state.periodInMinutes*60 // in the allowed period
        && sha3(secret, address(game.otherSlot), move) == games[slot].state.hash //secret match + move match previous hash //TODO remove msg.sender from the sha3 computation ?
        ){ 
            game.state.turn ++;
            game.state.lastTime = uint64(now);
            
            if((game.state.p2NumUnits > 0 && move == 0) || move > game.state.p2NumUnits){
                throw;
            }
            game.state.move2 = move; //TODO no need if win/draw/
            game.state.hash = hash; //TODO no need if win/draw/

            uint8 p1Move = game.state.move1;

            
            game.state.p1NumUnits -= p1Move; //TODO no need if win/draw/
            game.state.p2NumUnits -= move; //TODO no need if win/draw/

            if(p1Move < move){
                game.state.position --; //TODO no need if win/draw/
            }else if(p1Move > move){
                game.state.position ++; //TODO no need if win/draw/
            }

            //deal with the case of someone reaching zero before the other : auto win in that case, no point forcing players with zero units to play
            if(game.state.p1NumUnits == 0 && game.state.p2NumUnits > 0){
                game.state.position -= int8(game.state.p2NumUnits);
            }else if(game.state.p1NumUnits > 0 && game.state.p2NumUnits == 0){
                game.state.position += int8(game.state.p1NumUnits);
            }
            
            if(game.state.position < -2){
                win(slot,address(game.otherSlot));
            }else if(game.state.position > 2){
                win(slot,address(slot));
            }else if(game.state.p2NumUnits == 0 && game.state.p1NumUnits == 0){
                if(game.state.position < 0){
                    win(slot,address(game.otherSlot));
                }else if(game.state.position > 0){
                    win(slot,address(slot));
                }else{
                    draw(slot);
                }
            }
             
        }else{
            throw;
        }
    }
    
    function win(uint256 gameSlot, address winner) internal{
        var game = games[gameSlot];
        winner.send(uint256(game.state.szaboPaid) * 1 szabo);
        closeGame(gameSlot);
    }
    
    function draw(uint256 gameSlot) internal{
        var game = games[gameSlot];
        var creator = address(gameSlot);
        var starter = address(game.otherSlot);
        var starterPrize = (uint256(game.state.szaboPaid) * 1 szabo) /2;
        starter.send(starterPrize);
        creator.send( (uint256(game.state.szaboPaid) * 1 szabo) - starterPrize);
        closeGame(gameSlot);
    }

    
    function closeGame(uint256 gameSlot) internal{
        var game = games[gameSlot];
        game.state.turn = 0;
        games[game.otherSlot].state.turn = 0;

        //save the data for later reading // TODO make this a client issue
        games[game.otherSlot].state.p1NumUnits = game.state.p2NumUnits;
        games[game.otherSlot].state.p2NumUnits = game.state.p1NumUnits;
        games[game.otherSlot].state.move1 = game.state.move2;
        games[game.otherSlot].state.move2 = game.state.move1;
        games[game.otherSlot].state.position = - game.state.position;
        
        var slotIndex = uint8(gameSlot / 1461501637330902918203684832716283019655932542976);
        occupancy[address(gameSlot)] |= 2**uint256(slotIndex);
        slotIndex = uint8(game.otherSlot / 1461501637330902918203684832716283019655932542976);
        occupancy[address(game.otherSlot)] &= ~(2**uint256(slotIndex));
    }
    
    //TODO fast track (both player should be able to submit (even the one twhose secret is not his own (pased via the game client via network)))
    // function end_reveal(uint256 slot, address player, uint8 move, bytes32 secret){ //at the end to finish the game

    //     var turnExpected = 4;
    //     var newTurn = 3;
        
    //     var gameSlot = slot;
    //     var game = games[slot]; 
    //     if(address(slot) != msg.sender && game.shadow != msg.sender){
    //         throw;
    //     }
    //     //var otherSlot = game.otherSlot;
    //     if(games[slot].state.turn == 1){
    //        gameSlot=game.otherSlot;
    //        game = games[game.otherSlot];
    //        turnExpected = 3;
    //        newTurn = 4;
    //     }

    //     if(sha3(secret, player, move) == games[player].hash){
            
    //     }else{
    //         throw;
    //     }
    // }
    
    function collect(uint256  slot){ //to get the prize
        var game = games[slot];
        
        if(now - game.state.lastTime > game.state.periodInMinutes*60 //can collect after no move from other player
        ){
            if( ( (game.state.turn >= 4 && game.state.turn % 2 == 0) || game.state.turn == 1 || game.state.turn == 2)){ //player 2 late
                win(slot, address(slot));
            }else if((game.state.turn >= 3 && game.state.turn != 255 && game.state.turn % 2 == 1)){ //player 1 late
                win(slot, address(game.otherSlot));
            }else{
                throw;
            }
            
        }else{
            throw;
        }
    }
    
    function quit(uint256  slot, bool force){ // to cnacel, will make you lose money if game is started
        var game = games[slot];
        
        if(now - game.state.lastTime > game.state.periodInMinutes*60){
            collect(slot);
        }else if(force){
            if(address(slot) == msg.sender){
                win(slot, address(game.otherSlot));
            }else if(address(game.otherSlot) == msg.sender){
                win(slot, address(slot));
            }else{
                throw;
            }
        }else{
            throw;
        }
    }
    
    
    // function getNextFreeSlot() constant returns (uint8 freeSlot){
    //     for(var i = 0; i < 20; i++){
    //         if(games[msg.sender])
    //     }
    // }

    function getOccupancy() constant returns(uint256 occup){
        occup = occupancy[msg.sender];
    }


    function getGame(uint256 slot) constant returns (
        uint16 period, 
        uint32 szaboPaid, 
        uint8 p1NumUnits, 
        uint8 p2NumUnits,
        int8 position,
        uint8 turn,
        address otherPlayer,
        uint8 otherSlotIndex,
        uint8 move1,
        uint8 move2,
        bytes32 hash,
        uint64 lastTime,
        uint64 creationTime,
        uint256 gameSlot
        ){
        
        
        gameSlot = slot;
        var game = games[gameSlot]; 
        if(games[gameSlot].state.turn == 255){
            gameSlot = game.otherSlot;
            game =games[game.otherSlot];
        }
        
        creationTime = games[game.otherSlot].state.lastTime;
        otherPlayer = address(game.otherSlot);
        otherSlotIndex = uint8(game.otherSlot / 1461501637330902918203684832716283019655932542976);
        move1 = game.state.move1;
        move2 = game.state.move2;
        hash = game.state.hash;
        period = game.state.periodInMinutes;
        szaboPaid = game.state.szaboPaid;
        p1NumUnits = game.state.p1NumUnits;
        p2NumUnits = game.state.p2NumUnits;
        position = game.state.position;
        turn = game.state.turn;
        lastTime = game.state.lastTime;
    }
}
