// Copyright (C) 2017 Péter Szilágyi - All Rights Reserved.
//
// This file is part of the `favor.network` Status IM hackathon entry. Source code
// is provided solely for judging purposes, without any explicit or implied waiver
// of rights or allowance of reuse in whole or in part.

package contract

import (
	"crypto/ecdsa"
	"fmt"
	"math/big"
	"math/rand"
	"testing"

	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/accounts/abi/bind/backends"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core"
	"github.com/ethereum/go-ethereum/crypto"
)

// setupFavorNetworkTest creates a blockchain simulator and deploys a favor-network
// contract for testing.
func setupFavorNetworkTest(t *testing.T, prefund ...*ecdsa.PrivateKey) (*ecdsa.PrivateKey, *FavorNetwork, *backends.SimulatedBackend) {
	// Generate a new random account and a funded simulator
	key, _ := crypto.GenerateKey()
	auth := bind.NewKeyedTransactor(key)

	alloc := core.GenesisAlloc{auth.From: {Balance: big.NewInt(1000000000000000000)}}
	for _, key := range prefund {
		alloc[crypto.PubkeyToAddress(key.PublicKey)] = core.GenesisAccount{Balance: big.NewInt(1000000000000000000)}
	}
	sim := backends.NewSimulatedBackend(alloc)

	// Deploy a version favornet contract, commit and return
	_, _, favornet, err := DeployFavorNetwork(auth, sim)
	if err != nil {
		t.Fatalf("Failed to deploy favor-network contract: %v", err)
	}
	sim.Commit()

	return key, favornet, sim
}

// Tests that favor requests can be made and existing requests correctly listed.
func TestRequestCreation(t *testing.T) {
	// Prefund a few accounts to request with and create the favornet
	keys := make([]*ecdsa.PrivateKey, 5)
	for i := 0; i < len(keys); i++ {
		keys[i], _ = crypto.GenerateKey()
	}
	_, favornet, sim := setupFavorNetworkTest(t, keys...)

	// Gradually issue new requests with the keys, validating the existing ones
	for i := 0; i < 5; i++ {
		for j, key := range keys {
			// Validate the request count prior to insertion
			if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(key.PublicKey)); err != nil {
				t.Fatalf("iter %d, key %d: failed to retrieve request count: %v", i, j, err)
			} else if reqs.Uint64() != uint64(i) {
				t.Fatalf("iter %d, key %d: request count mismatch prior to requesting: have %d, want %d", i, j, reqs, i)
			}
			// Create a new favor requst
			if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(key), common.Address{byte(i), byte(j)}, fmt.Sprintf("%d.%d", i, j), new(big.Int)); err != nil {
				t.Fatalf("iter %d, key %d: failed to create favor request transaction: %v", i, j, err)
			}
			sim.Commit()

			// Validate the request count and content post insertion
			if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(key.PublicKey)); err != nil {
				t.Fatalf("iter %d, key %d: failed to retrieve request count: %v", i, j, err)
			} else if reqs.Uint64() != uint64(i+1) {
				t.Fatalf("iter %d, key %d: request count mismatch after requesting: have %d, want %d", i, j, reqs, i+1)
			}
			if req, err := favornet.GetRequestAt(nil, crypto.PubkeyToAddress(key.PublicKey), big.NewInt(int64(i))); err != nil {
				t.Fatalf("iter %d, key %d: failed to retrieve request struct: %v", i, j, err)
			} else if req.Id.Uint64() != uint64(5*i+j+1) || req.From != (common.Address{byte(i), byte(j)}) || req.Favor != fmt.Sprintf("%d.%d", i, j) || req.Bound != false || req.Reward.Uint64() != 0 {
				t.Fatalf("iter %d, key %d: request struct mismatch: have %+v", i, j, req)
			}
		}
	}
}

// Tests that favor requests can be made, unbound ones deleted and existing
// requests correctly listed even after gapped deletion.
func TestRequestDeletion(t *testing.T) {
	// Prefund an account to request with and create the favornet
	key, _ := crypto.GenerateKey()
	_, favornet, sim := setupFavorNetworkTest(t, key)

	// Issue a batch of requests and sanity check the count
	for i := 0; i < 25; i++ {
		if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(key), common.Address{byte(i)}, fmt.Sprintf("%d", i), new(big.Int)); err != nil {
			t.Fatalf("iter %d: failed to create favor request transaction: %v", i, err)
		}
	}
	sim.Commit()

	if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(key.PublicKey)); err != nil {
		t.Fatalf("failed to retrieve request count: %v", err)
	} else if reqs.Uint64() != 25 {
		t.Fatalf("request count mismatch: have %d, want %d", reqs, 25)
	}
	// Start randomly dropping the requests, validating after each drop
	left := make(map[int]bool)
	for i := 1; i <= 25; i++ {
		left[i] = true
	}
	for len(left) > 0 {
		// Pick a request at random and delete it
		index := big.NewInt(rand.Int63n(int64(len(left))))

		req, _ := favornet.GetRequestAt(nil, crypto.PubkeyToAddress(key.PublicKey), index)
		delete(left, int(req.Id.Uint64()))

		favornet.DropRequest(bind.NewKeyedTransactor(key), index, req.Id)
		sim.Commit()

		// Ensure the request is deleted from all pools
		if req, err := favornet.GetRequest(nil, req.Id); err != nil {
			t.Fatalf("left %d: failed to retrieve deleted request: %v", len(left), err)
		} else if req.Favor != "" {
			t.Fatalf("left %d: deleted request still lingering: %+v", len(left), req)
		}
		// Ensure the remainding requests are what we expect
		if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(key.PublicKey)); err != nil {
			t.Fatalf("left %d: failed to retrieve request count: %v", len(left), err)
		} else if reqs.Uint64() != uint64(len(left)) {
			t.Fatalf("left %d: request count mismatch after requesting: have %d, want %d", len(left), reqs, len(left))
		}
		remain := make(map[int]bool)
		for i := 0; i < len(left); i++ {
			req, err := favornet.GetRequestAt(nil, crypto.PubkeyToAddress(key.PublicKey), big.NewInt(int64(i)))
			if err != nil {
				t.Fatalf("left %d, idx %d: failed to retrieve request: %v", len(left), i, err)
			}
			id := int(req.Id.Uint64())
			if !left[id] {
				t.Fatalf("left %d, idx %d: deleted request still present: %d", len(left), i, id)
			}
			if remain[id] {
				t.Fatalf("left %d, idx %d: duplicate request remained: %d", len(left), i, id)
			}
			remain[id] = true
		}
	}
}

// Tests that requests can be accepted by their rightful owner, and that after
// a binding agreement, requests can no longer be simply deleted.
func TestRequestAcceptance(t *testing.T) {
	// Prefund a requester and an accepter for the favornet
	requester, _ := crypto.GenerateKey()
	accepter, _ := crypto.GenerateKey()

	_, favornet, sim := setupFavorNetworkTest(t, requester, accepter)

	// Create a request to test acceptance against and ensure it's unbound
	if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(requester), crypto.PubkeyToAddress(accepter.PublicKey), "Hello, Favor!", new(big.Int)); err != nil {
		t.Fatalf("failed to create favor request transaction: %v", err)
	}
	sim.Commit()

	if req, err := favornet.GetRequest(nil, big.NewInt(1)); err != nil {
		t.Fatalf("failed to retrieve request: %v", err)
	} else if req.Bound {
		t.Fatalf("request binding mismatch: have %v, want %v", req.Bound, false)
	}
	// Try to accept with the wrong account and ensure it remains unbound
	if _, err := favornet.AcceptRequest(bind.NewKeyedTransactor(requester), crypto.PubkeyToAddress(requester.PublicKey), new(big.Int), big.NewInt(1)); err != nil {
		t.Fatalf("failed to create bad acceptance transaction: %v", err)
	}
	sim.Commit()

	if req, err := favornet.GetRequest(nil, big.NewInt(1)); err != nil {
		t.Fatalf("failed to retrieve request: %v", err)
	} else if req.Bound {
		t.Fatalf("request binding mismatch: have %v, want %v", req.Bound, false)
	}
	// Try to accept with the correct account and ensure it becoms bound
	if _, err := favornet.AcceptRequest(bind.NewKeyedTransactor(accepter), crypto.PubkeyToAddress(requester.PublicKey), new(big.Int), big.NewInt(1)); err != nil {
		t.Fatalf("failed to create good acceptance transaction: %v", err)
	}
	sim.Commit()

	if req, err := favornet.GetRequest(nil, big.NewInt(1)); err != nil {
		t.Fatalf("failed to retrieve request: %v", err)
	} else if !req.Bound {
		t.Fatalf("request binding mismatch: have %v, want %v", req.Bound, true)
	}
	// Lastly ensure that bound requests cannot be deleted any more
	if _, err := favornet.DropRequest(bind.NewKeyedTransactor(requester), new(big.Int), big.NewInt(1)); err != nil {
		t.Fatalf("failed to create drop transaction: %v", err)
	}
	sim.Commit()

	if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(requester.PublicKey)); err != nil {
		t.Fatalf("failed to retrieve request count: %v", err)
	} else if reqs.Uint64() != uint64(1) {
		t.Fatalf("request count mismatch: have %v, want %v", reqs, 1)
	}
}

// Tests that favor requests can be closed both without an explicit promise as
// the reward (creating a new one) as well as by transferring ownership of an
// already existing one.
func TestRequestHonouring(t *testing.T) {
	// Prefund two accounts to rotate a favor in between
	alice, _ := crypto.GenerateKey()
	bob, _ := crypto.GenerateKey()

	_, favornet, sim := setupFavorNetworkTest(t, alice, bob)

	// Create a request with Alice and bind it with Bob
	if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(alice), crypto.PubkeyToAddress(bob.PublicKey), "Hello, Favor!", new(big.Int)); err != nil {
		t.Fatalf("failed to create favor request transaction: %v", err)
	}
	if _, err := favornet.AcceptRequest(bind.NewKeyedTransactor(bob), crypto.PubkeyToAddress(alice.PublicKey), big.NewInt(0), big.NewInt(1)); err != nil {
		t.Fatalf("failed to create acceptance transaction: %v", err)
	}
	sim.Commit()

	// Make sure Bob has no promises from others before an honour is made
	if proms, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(bob.PublicKey)); err != nil {
		t.Fatalf("failed to retrieve promise count: %v", err)
	} else if proms.Uint64() != uint64(0) {
		t.Fatalf("promise count mismatch: have %v, want %v", proms, 0)
	}
	// Close the request and verify the creation of a new promise to honour it
	if _, err := favornet.HonourRequest(bind.NewKeyedTransactor(alice), big.NewInt(0), big.NewInt(1), big.NewInt(0)); err != nil {
		t.Fatalf("failed to create favor honour transaction: %v", err)
	}
	sim.Commit()

	// Make sure the request is gone and a new promise created instead
	if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(alice.PublicKey)); err != nil {
		t.Fatalf("failed to retrieve request count: %v", err)
	} else if reqs.Uint64() != uint64(0) {
		t.Fatalf("request count mismatch: have %v, want %v", reqs, 0)
	}
	if req, err := favornet.GetRequest(nil, big.NewInt(1)); err != nil {
		t.Fatalf("failed to retrieve honoured request: %v", err)
	} else if req.Favor != "" {
		t.Fatalf("honoured request still lingering: %+v", req)
	}

	if proms, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(bob.PublicKey)); err != nil {
		t.Fatalf("failed to retrieve promise count: %v", err)
	} else if proms.Uint64() != uint64(1) {
		t.Fatalf("promise count mismatch: have %v, want %v", proms, 1)
	}
	if promise, err := favornet.GetPromiseAt(nil, crypto.PubkeyToAddress(bob.PublicKey), big.NewInt(0)); err != nil {
		t.Fatalf("failed to retrieve promise: %v", err)
	} else if promise.Id.Uint64() != uint64(1) || promise.Owner != crypto.PubkeyToAddress(bob.PublicKey) || promise.From != crypto.PubkeyToAddress(alice.PublicKey) || promise.Favor != "Hello, Favor!" || promise.Offered {
		t.Fatalf("created promise struct mismatch: have %+v", promise)
	}
	// Repeat the same test but with the existing promise as a reward
	{
		// Create a request with Bob
		if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(bob), crypto.PubkeyToAddress(alice.PublicKey), "Hello, Favor 2!", big.NewInt(1)); err != nil {
			t.Fatalf("failed to create favor request transaction: %v", err)
		}
		sim.Commit()

		// Make sure Bob cannot offer the same reward to someone else
		if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(bob), crypto.PubkeyToAddress(alice.PublicKey), "Hello, Favor 3!", big.NewInt(1)); err != nil {
			t.Fatalf("failed to create favor request transaction: %v", err)
		}
		sim.Commit()

		if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(bob.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve request count: %v", err)
		} else if reqs.Uint64() != uint64(1) {
			t.Fatalf("request count mismatch: have %v, want %v", reqs, 1)
		}
		// Make sure Bob cannot destroy a reward already locked into a request
		if _, err := favornet.DropPromise(bind.NewKeyedTransactor(bob), big.NewInt(0), big.NewInt(1)); err != nil {
			t.Fatalf("failed to create promise drop transaction: %v", err)
		}
		sim.Commit()

		if reqs, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(bob.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve promise count: %v", err)
		} else if reqs.Uint64() != uint64(1) {
			t.Fatalf("promise count mismatch: have %v, want %v", reqs, 1)
		}
		// Make sure droppig the request unlocks the reward
		if _, err := favornet.DropRequest(bind.NewKeyedTransactor(bob), big.NewInt(0), big.NewInt(2)); err != nil {
			t.Fatalf("failed to create promise drop transaction: %v", err)
		}
		sim.Commit()

		if prom, err := favornet.GetPromise(nil, big.NewInt(1)); err != nil {
			t.Fatalf("failed to retrieve backtracked promise: %v", err)
		} else if prom.Offered {
			t.Fatalf("backtracked promise still on offer")
		}
		// Recreate the request with Bob and bind it with Alice
		if _, err := favornet.MakeRequest(bind.NewKeyedTransactor(bob), crypto.PubkeyToAddress(alice.PublicKey), "Hello, Favor 4!", big.NewInt(1)); err != nil {
			t.Fatalf("failed to create favor request transaction: %v", err)
		}
		if _, err := favornet.AcceptRequest(bind.NewKeyedTransactor(alice), crypto.PubkeyToAddress(bob.PublicKey), big.NewInt(0), big.NewInt(3)); err != nil {
			t.Fatalf("failed to create acceptance transaction: %v", err)
		}
		sim.Commit()

		// Make sure Alice has no promises from others before an honour is made
		if proms, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(alice.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve promise count: %v", err)
		} else if proms.Uint64() != uint64(0) {
			t.Fatalf("promise count mismatch: have %v, want %v", proms, 0)
		}
		// Close the request and verify the creation of a new promise to honour it
		if _, err := favornet.HonourRequest(bind.NewKeyedTransactor(bob), big.NewInt(0), big.NewInt(3), big.NewInt(0)); err != nil {
			t.Fatalf("failed to create favor honour transaction: %v", err)
		}
		sim.Commit()

		// Make sure the request is gone and the existing promise transferred instead
		if reqs, err := favornet.GetRequestCount(nil, crypto.PubkeyToAddress(bob.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve request count: %v", err)
		} else if reqs.Uint64() != uint64(0) {
			t.Fatalf("request count mismatch: have %v, want %v", reqs, 0)
		}
		if proms, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(alice.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve promise count: %v", err)
		} else if proms.Uint64() != uint64(1) {
			t.Fatalf("promise count mismatch: have %v, want %v", proms, 1)
		}
		if promise, err := favornet.GetPromiseAt(nil, crypto.PubkeyToAddress(alice.PublicKey), big.NewInt(0)); err != nil {
			t.Fatalf("failed to retrieve promise: %v", err)
		} else if promise.Id.Uint64() != uint64(1) || promise.Owner != crypto.PubkeyToAddress(alice.PublicKey) || promise.From != crypto.PubkeyToAddress(alice.PublicKey) || promise.Favor != "Hello, Favor!" || promise.Offered {
			t.Fatalf("transferred promise struct mismatch: have %+v", promise)
		}
		if proms, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(bob.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve promise count: %v", err)
		} else if proms.Uint64() != uint64(0) {
			t.Fatalf("promise count mismatch: have %v, want %v", proms, 0)
		}
		// Alice having a non reserved promise must be able to destroy it
		if _, err := favornet.DropPromise(bind.NewKeyedTransactor(alice), big.NewInt(0), big.NewInt(1)); err != nil {
			t.Fatalf("failed to create promise drop transaction: %v", err)
		}
		sim.Commit()

		if proms, err := favornet.GetPromiseCount(nil, crypto.PubkeyToAddress(alice.PublicKey)); err != nil {
			t.Fatalf("failed to retrieve promise count: %v", err)
		} else if proms.Uint64() != uint64(0) {
			t.Fatalf("promise count mismatch: have %v, want %v", proms, 0)
		}
		if prom, err := favornet.GetPromise(nil, big.NewInt(1)); err != nil {
			t.Fatalf("failed to retrieve deleted promise: %v", err)
		} else if prom.Favor != "" {
			t.Fatalf("deleted promise still lingering: %+v", prom)
		}
	}
}
