pragma solidity ^0.4.11;

import "./UnConf.sol";
import "./strings.sol";

contract UnConfFactory {
  using strings for *;

  UnConference[] unconfs;

  struct UnConference {
    string name;
    address unconf_address;
  }

  event NewUnConf(string name, address unconf_address);

  function findUnConference(string _name) constant public returns(address) {
    strings.slice memory nameSlice = _name.toSlice();
    for(uint i = 0; i < unconfs.length; i++) {
      if (nameSlice.equals(unconfs[i].name.toSlice())) {
        return unconfs[i].unconf_address;
      }
    }

    return 0;
  }

  function listUnconferences() constant public returns(string list) {
    for(uint i = 0; i < unconfs.length; i++) {
      if (i > 0) list = list.toSlice().concat("\n".toSlice());
      list = list.toSlice().concat(unconfs[i].name.toSlice());
    }
    return list;
  }

  function create(string _name) public returns(address) {
    address unconf_address = findUnConference(_name);
    if (unconf_address != 0) return unconf_address;
    unconf_address = address(new UnConf(_name, msg.sender));
    uint unconfId = unconfs.length++;
    UnConference u = unconfs[unconfId];
    u.name = _name;
    u.unconf_address = unconf_address;
    NewUnConf(_name, unconf_address);
    return unconf_address;
  }
}
