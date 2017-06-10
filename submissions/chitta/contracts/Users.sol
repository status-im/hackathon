pragma solidity ^0.4.8;

contract Users {

  address public owner; // address of the Contract

  function Users() payable {
    owner = msg.sender;
  }

  // modifier to allow only owner has full control on the function
  modifier onlyOwnder {
    if (msg.sender != owner) {
      throw;
    } else {
      _;
    }
  }

  // Delete / kill the contract... only the owner has rights to do this
  function kill() onlyOwnder {
    suicide(owner);
  }

  struct User {
    string username;
    string password;
    string fullname;
    address account;
  }

  User[] public users;

  function getReviewers(address userAccount) public constant returns (bool, address, address, address) {
    bool result = false;
    address reviewer1;
    address reviewer2;
    address reviewer3;
    if (users.length > 3) {
      if (users[0].account != userAccount) {
        reviewer1 = users[0].account;
        if (users[1].account != userAccount) {
          reviewer2 = users[1].account;
          if (users[2].account != userAccount) {
            reviewer3 = users[2].account;
          } else if (users[3].account != userAccount) {
            reviewer3 = users[3].account;
          }
        } else if (users[2].account != userAccount) {
          reviewer2 = users[2].account;
          reviewer3 = users[3].account;
        }
      } else if (users[1].account != userAccount) {
        reviewer1 = users[1].account;
        reviewer2 = users[2].account;
        reviewer3 = users[3].account;
      }
      result = true;
    }
    return (result, reviewer1, reviewer2, reviewer3);
  }

  function addUser(string _username, string _password, string _fullname, address _account) {
    users.push(User({
      username : _username,
      password : _password,
      fullname : _fullname,
      account : _account
      }));
  }

  function validateUsername(string _username) public constant returns (bool) {
    bool available = true;

    for (uint index = 0; index < users.length; index++) {
      if (sha3(users[index].username) == sha3(_username)) {
        available = false;

      }
    }
    return available;
  }

  function loginUser(string _username, string _password) public constant returns(bool, string, address) {
    bool login = false;
    string memory _fullname;
    address _account;
    for (uint index = 0; index < users.length; index++) {
      if (sha3(users[index].username) == sha3(_username) && sha3(users[index].password) == sha3(_password)) {
        login = true;
        _fullname = users[index].fullname;
        _account = users[index].account;
      }
    }
    return (login, _fullname, _account);
  }
}
