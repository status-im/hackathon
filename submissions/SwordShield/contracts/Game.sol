pragma solidity ^0.4.8;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract Game is owned {
    string public meta_name    = 'SwordShield';
	
	uint8 MINOTAUR = 1;
	uint8 LIZARD = 2;
	uint8 DRUID = 3;
	
	enum GameState {
        InProgress,
        PlayerWon,
        PlayerLose
    }
	
	struct Game {
        address player;
        address rival;
        uint8 attaking;
        uint8 protecting;
        GameState state;
        uint8 rnd;
    }
    
	struct User {
        address player;
        uint8 skin;
        uint32 countAttackWin;
        uint32 countAttackMax;
        uint32 countDefenseWin;
        uint32 countDefenseMax;
    }
	
    mapping(bytes32 => Game) public listGames;
    mapping(address => User) public listUsers;
    
    event logRnd(uint8 value);
    event logUser(address player);
    event logGame(address attacking, address indexed protecting, bytes32 seed);
	
	modifier checkSkin(uint8 value) {
        if (value > DRUID && value < MINOTAUR) {
            throw;
        }
        _;
    }
    
    function createUser(uint8 skin)
		public
		checkSkin(skin)
	{
        logUser(msg.sender);
		
		User memory user = listUsers[msg.sender];
        if (user.player != 0) { // only one register
            throw;
        }  
		
	    listUsers[msg.sender] = User({
            player: msg.sender,
            skin: skin,
            countAttackWin: 0,
            countAttackMax: 0,
            countDefenseWin: 0,
            countDefenseMax: 0
        });
	}
	
    function battle(uint8 skin, bytes32 seed, address rival)
		public
		checkSkin(skin)
	{
	    logGame(msg.sender, rival, seed);
		
		listGames[seed] = Game({
            player: msg.sender,
            rival: rival,
            attaking: skin,
            protecting: 0,
            state: GameState.InProgress,
            rnd: 0
        });
		
	}
	
    function confirm(bytes32 random_id, uint8 shield, uint8 _v, bytes32 _r, bytes32 _s)
		public
	{
		if (ecrecover(random_id, _v, _r, _s) != msg.sender) { // will be change to RSA
            Game game = listGames[random_id];
            // check is this attacking user
			if(game.player != msg.sender && game.rival == msg.sender){
			    User attaking = listUsers[game.player];
			    User protecting = listUsers[msg.sender];
			    game.protecting = shield;
			    attaking.countAttackMax ++;
			    protecting.countDefenseMax ++;
				uint8 rnd = uint8(sha3(_s, game.attaking, shield)) % 100;
				game.rnd = rnd;
				logRnd(rnd);
				if(rnd > 50){
					game.state = GameState.PlayerWon;
					attaking.countAttackWin ++;
				} else {
					game.state = GameState.PlayerLose;
					protecting.countDefenseWin ++;
				}
			}
        }
	}
	
	function getState(bytes32 random_id) 
		public 
		constant returns(GameState) 
	{
        Game memory game = listGames[random_id];

        if (game.player == 0) {
            throw;
        }

        return game.state;
    }
	
	function getAttackWin(address player) public constant returns(uint32) 
	{
        User memory user = listUsers[player];
        if (user.player == 0) {
            throw;
        }
        return user.countAttackWin;
    }
    
	function getAttackMax(address player) public constant returns(uint32) 
	{
        User memory user = listUsers[player];
        if (user.player == 0) {
            throw;
        }
        return user.countAttackMax;
    }
    
	function getDefenseWin(address player) public constant returns(uint32) 
	{
        User memory user = listUsers[player];
        if (user.player == 0) {
            throw;
        }
        return user.countDefenseWin;
    }
    
	function getDefenseMax(address player) public constant returns(uint32) 
	{
        User memory user = listUsers[player];
        if (user.player == 0) {
            throw;
        }
        return user.countDefenseMax;
    }
}