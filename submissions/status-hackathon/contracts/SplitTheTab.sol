pragma solidity ^0.4.11;

import './strings.sol';

contract SplitTheTab {

  address owner;
  mapping(string => address) tabs;

  modifier restricted() {
    if (msg.sender == owner) _;
  }

  function SplitTheTab() {
    owner = msg.sender;
  }
  
  function createTab(string _name, string _total, uint _npeople, string _shortid, string _payment_option)
    returns (string shortid)
  {
    address tab = new Tab(msg.sender, _name, _total, _npeople, _shortid, _payment_option);
    tabs[_shortid] = tab;
    shortid = _shortid;
  }

  function findTab(string shortid) constant
    returns (address addr)
  {
    addr = tabs[shortid];
  }

  function shutdown() restricted {
    selfdestruct(owner);
  }
}

contract Tab {
  using strings for *;

  event FriendJoined(string user_name, bool sender, address addr);

  event Finalized(address[] selected);

  enum PaymentOption {
    SPLIT_EVENLY,
    CREDIT_CARD_ROULETTE,
    FREE_MEAL_ROULETTE
  }

  struct Friend {
    string user_name;
    bool sender;
    address addr;
  }

  struct Data {
    PaymentOption payment_option;
    string name;
    string total;
    uint npeople;
    string shortid;
    bool finalized;
    address creator;
    address[] selected;
    Friend[] friends;
  }

  Data public tab;

  modifier restricted() {
    if (msg.sender == tab.creator) _;
  }

  function Tab(address _creator, string _name, string _total, uint _npeople, string _shortid, string _payment_option)
  {
    var option = _payment_option.toSlice();
    
    if (option.equals('CREDIT_CARD_ROULETTE'.toSlice())) {
      tab.payment_option = PaymentOption.CREDIT_CARD_ROULETTE;
    } else if (option.equals('FREE_MEAL_ROULETTE'.toSlice())) {
      tab.payment_option = PaymentOption.FREE_MEAL_ROULETTE;
    } else {
      tab.payment_option = PaymentOption.SPLIT_EVENLY;
    }
    tab.name = _name;
    tab.total =_total;
    tab.npeople = _npeople;
    tab.shortid = _shortid;
    tab.creator = _creator;
    tab.finalized = false;
  }

  function getState() constant
    returns (string name, string total, uint npeople, string payment_option, uint nfriends, address[] selected, bool finalized)
  {
    if (tab.payment_option == PaymentOption.CREDIT_CARD_ROULETTE) {
      payment_option = 'CREDIT_CARD_ROULETTE';
    } else if (tab.payment_option == PaymentOption.FREE_MEAL_ROULETTE) {
      payment_option = 'FREE_MEAL_ROULETTE';
    } else {
      payment_option = 'SPLIT_EVENLY';
    }
    name = tab.name;
    total = tab.total;
    npeople = tab.npeople;
    nfriends = tab.friends.length;
    selected = tab.selected;
    finalized = tab.finalized;
  }

  function addFriend(string user_name, bool sender, address addr) {
    tab.friends.push(Friend(user_name, sender, addr));
    FriendJoined(user_name, sender, addr);
  }

  function setSelectedFriends(address[] selected) restricted {
    tab.selected = selected;
  }

  function finalize(string shortid) restricted {
    tab.finalized = true;
    Finalized(tab.selected);
  }
  
  function getFriend(uint i) constant
    returns (string user_name, bool sender, address addr)
  {
    Friend friend = tab.friends[i];

    user_name = friend.user_name;
    sender = friend.sender;
    addr = friend.addr;
  }
}
