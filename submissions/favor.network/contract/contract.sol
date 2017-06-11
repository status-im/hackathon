// Copyright (C) 2017 Péter Szilágyi - All Rights Reserved.
//
// This file is part of the `favor.network` Status IM hackathon entry. Source code
// is provided solely for judging purposes, without any explicit or implied waiver
// of rights or allowance of reuse in whole or in part.
pragma solidity ^0.4.11;

// FavorNetwork is the favor-network's ledger contract that keeps track of favors
// users requested from one another, promises made to repay them and current
// balances of who is "owed one" by whom and why.
contract FavorNetwork {
  // Request is a currently unfulfilled favor request. Once a request is
  // accepted, the only way to get rid of it is to fulfil it, issuing a
  // promise to repay the favor (or rewarding with an existing promise).
  struct Request {
    uint     Id;     // Unique identifier of this favor request
    address  From;   // Address of the user to fulfill the favor
    string   Favor;  // Description of the favor being asked
    bool     Bound;  // Whether the request was accepted to fulfil
    uint     Reward; // Promise to reward in exchange for this favor
  }
  // Promise is a pending commitment issued by a user for someone doing a
  // favor for her. Promises may be swapped or traded at will, eventually
  // reaching back to the indebted party for honouring it via a favor.
  struct Promise {
    uint    Id;     // Unique identifier of this favor promise
    address Owner;   // Current owner of the favor return commitment
    address From;    // Address of the user making the promise to fulfil
    string  Favor;   // Description of the favor promised to be repayed
    bool    Offered; // Whether a favor request offers this as a reward
  }

  uint autoid;                        // Next id to assign to a new request
  mapping (uint => Request) requests; // Set of unfulfilled favor requests
  mapping (uint => Promise) promises; // Set of pending return commitments

  mapping (address => uint[]) liabilities; // Favors requested by users
  mapping (address => uint[]) assets;      // Commitments owned by users

  // FavorNetwork is the contract constructor. For now it only initializes the
  // autoid to 1 to reserve 0 as an unusable special case.
  function FavorNetwork() {
    autoid = 1;
  }
  // makeRequest creates a new favor request from the specified user. The
  // favor by default rewards with a new promise to return the favor, but
  // the user may offer for exchange an existing promise too instead.
  function makeRequest(address from, string favor, uint reward) {
    // If the user offered an existing promise as a reward, ensure it's
    // actually owned by the sender and that it's not locked up in some
    // other already pending request.
    if (reward != 0) {
      Promise promise = promises[reward];
      if (promise.Owner != msg.sender || promise.Offered) {
        throw;
      }
      promise.Offered = true;
    }
    // Reward checks out, create the request and return
    liabilities[msg.sender].push(autoid);
    requests[autoid] = Request({
      Id:     autoid,
      Favor:  favor,
      From:   from,
      Bound:  false,
      Reward: reward
    });
    autoid++;
  }
  // dropRequest deletes an unfulfilled and unboud favor request from the users
  // own list of liabilities. Requests that have already been accepted cannot
  // be dropped.
  //
  // The reason both index and id are required for this operation is to allow
  // calculating the index off chain (cheap), but still retain the guarantee
  // of operating on the correct request object.
  function dropRequest(uint index, uint id) {
    // Ensure the request exists and is still unbound
    uint count = liabilities[msg.sender].length;
    if (index >= count) {
      throw;
    }
    if (liabilities[msg.sender][index] != id) {
      throw;
    }
    if (requests[id].Bound) {
      throw;
    }
    // All checks passed, get rid of the favor request
    uint reward = requests[id].Reward;
    if (reward != 0) {
        promises[reward].Offered = false;
    }
    liabilities[msg.sender][index] = liabilities[msg.sender][count-1];
    liabilities[msg.sender].length--;
    delete(requests[id]);
  }
  // acceptRequest makes a binding agreement to honour a given favor request.
  // From this point onward the request can only ever be deleted if its author
  // honors it with a promise reward, otherwise
  //
  // The reason both index and id are required for this operation is to allow
  // calculating the index off chain (cheap), but still retain the guarantee
  // of operating on the correct request object.
  function acceptRequest(address from, uint index, uint id) {
    // Ensure the request exists, is for us and still unbound
    uint count = liabilities[from].length;
    if (index >= count) {
      throw;
    }
    if (liabilities[from][index] != id) {
      throw;
    }
    if (requests[id].From != msg.sender) {
      throw;
    }
    if (requests[id].Bound) {
      throw;
    }
    // Everything checks out, make a binding commitment
    requests[id].Bound = true;
  }
  // honourRequest finalizes a bound favor request, and rewards the destination
  // account with either a new promise of repayal or an existing one designated
  // in the request.
  function honourRequest(uint reqIdx, uint reqId, uint promIdx) {
    // Ensure the request exists and is already bound
    uint reqCount = liabilities[msg.sender].length;
    if (reqIdx >= reqCount) {
      throw;
    }
    if (liabilities[msg.sender][reqIdx] != reqId) {
      throw;
    }
    if (!requests[reqId].Bound) {
      throw;
    }
    Request req = requests[reqId];

    // Ensure the promised reward exists
    uint promCount = assets[msg.sender].length;
    if (req.Reward != 0) {
      if (promIdx >= promCount) {
        throw;
      }
      if (assets[msg.sender][promIdx] != req.Reward) {
        throw;
      }
    }
    // Everything checks out, grant the reward, clean up and return
    if (req.Reward == 0) {
      // New promise was made, create it and grant to the fulfiller
      promises[reqId] = Promise({
        Id:      reqId,
        Owner:   req.From,
        From:    msg.sender,
        Favor:   req.Favor,
        Offered: false,
      });
      assets[req.From].push(reqId);
    } else {
      // Existing promise was set as the reward, transfer ownership
      promises[req.Reward].Owner   = req.From;
      promises[req.Reward].Offered = false;

      assets[req.From].push(req.Reward);
      assets[msg.sender][promIdx] = assets[msg.sender][promCount-1];
      assets[msg.sender].length--;
    }
    liabilities[msg.sender][reqIdx] = liabilities[msg.sender][reqCount-1];
    liabilities[msg.sender].length--;
    delete(requests[reqId]);
  }
  // dropPromise deletes a promise from the users own list of assets. Promises
  // that have been offered as favor rewards cannot be dropped.
  //
  // The reason both index and id are required for this operation is to allow
  // calculating the index off chain (cheap), but still retain the guarantee
  // of operating on the correct promise object.
  function dropPromise(uint index, uint id) {
    // Ensure the request exists and is still unbound
    uint count = assets[msg.sender].length;
    if (index >= count) {
      throw;
    }
    if (assets[msg.sender][index] != id) {
      throw;
    }
    if (promises[id].Offered) {
      throw;
    }
    // All checks passed, get rid of the favor request
    assets[msg.sender][index] = assets[msg.sender][count-1];
    assets[msg.sender].length--;
    delete(promises[id]);
  }

  // getRequestCount return the number of favor requests a user currently has open.
  function getRequestCount(address user) constant returns (uint) {
    return liabilities[user].length;
  }
  // getRequestAt returns the currently unfulfilled favor request of a particular
  // user at a particular storage slot.
  function getRequestAt(address user, uint index) constant returns (uint id, address from, string favor, bool bound, uint reward) {
    Request req = requests[liabilities[user][index]];
    return (req.Id, req.From, req.Favor, req.Bound, req.Reward);
  }
  // getRequest returns the specified currently unfulfilled favor request.
  function getRequest(uint id) constant returns (address from, string favor, bool bound, uint reward) {
    Request req = requests[id];
    return (req.From, req.Favor, req.Bound, req.Reward);
  }
  // getPromiseCount return the number of favor promises a user currently has open.
  function getPromiseCount(address user) constant returns (uint) {
    return assets[user].length;
  }
  // getPromiseAt returns the currently unfulfilled favor promise of a particular
  // user at a particular storage slot.
  function getPromiseAt(address user, uint index) constant returns (uint id, address owner, address from, string favor, bool offered) {
    Promise prom = promises[assets[user][index]];
    return (prom.Id, prom.Owner, prom.From, prom.Favor, prom.Offered);
  }
  // getPromise returns the specified currently unfulfilled favor promise.
  function getPromise(uint id) constant returns (address owner, address from, string favor, bool offered) {
    Promise prom = promises[id];
    return (prom.Owner, prom.From, prom.Favor, prom.Offered);
  }
}
