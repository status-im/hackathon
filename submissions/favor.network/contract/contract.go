// This file is an automatically generated Go binding. Do not modify as any
// change will likely be lost upon the next re-generation!

package contract

import (
	"math/big"
	"strings"

	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
)

// FavorNetworkABI is the input ABI used to generate the binding from.
const FavorNetworkABI = "[{\"constant\":false,\"inputs\":[{\"name\":\"index\",\"type\":\"uint256\"},{\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"dropRequest\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getRequestCount\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"reqIdx\",\"type\":\"uint256\"},{\"name\":\"reqId\",\"type\":\"uint256\"},{\"name\":\"promIdx\",\"type\":\"uint256\"}],\"name\":\"honourRequest\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"index\",\"type\":\"uint256\"},{\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"dropPromise\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"getRequest\",\"outputs\":[{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"favor\",\"type\":\"string\"},{\"name\":\"bound\",\"type\":\"bool\"},{\"name\":\"reward\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"user\",\"type\":\"address\"},{\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"getPromiseAt\",\"outputs\":[{\"name\":\"id\",\"type\":\"uint256\"},{\"name\":\"owner\",\"type\":\"address\"},{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"favor\",\"type\":\"string\"},{\"name\":\"offered\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"user\",\"type\":\"address\"},{\"name\":\"index\",\"type\":\"uint256\"}],\"name\":\"getRequestAt\",\"outputs\":[{\"name\":\"id\",\"type\":\"uint256\"},{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"favor\",\"type\":\"string\"},{\"name\":\"bound\",\"type\":\"bool\"},{\"name\":\"reward\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"favor\",\"type\":\"string\"},{\"name\":\"reward\",\"type\":\"uint256\"}],\"name\":\"makeRequest\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"user\",\"type\":\"address\"}],\"name\":\"getPromiseCount\",\"outputs\":[{\"name\":\"\",\"type\":\"uint256\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":true,\"inputs\":[{\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"getPromise\",\"outputs\":[{\"name\":\"owner\",\"type\":\"address\"},{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"favor\",\"type\":\"string\"},{\"name\":\"offered\",\"type\":\"bool\"}],\"payable\":false,\"type\":\"function\"},{\"constant\":false,\"inputs\":[{\"name\":\"from\",\"type\":\"address\"},{\"name\":\"index\",\"type\":\"uint256\"},{\"name\":\"id\",\"type\":\"uint256\"}],\"name\":\"acceptRequest\",\"outputs\":[],\"payable\":false,\"type\":\"function\"},{\"inputs\":[],\"payable\":false,\"type\":\"constructor\"}]"

// FavorNetworkBin is the compiled bytecode used for deploying new contracts.
const FavorNetworkBin = `0x6060604052341561000c57fe5b5b60016000555b5b6114ba806100236000396000f300606060405236156100ac5763ffffffff7c01000000000000000000000000000000000000000000000000000000006000350416630d50f13281146100ae578063ada49963146100c6578063b82f8fda146100f4578063b974bfa11461010f578063c58343ef14610127578063cab76a6e146101df578063d88d74d3146102c7578063e53716911461039d578063f64fe57714610401578063f72085931461042f578063fb05449a146104eb575bfe5b34156100b657fe5b6100c460043560243561050f565b005b34156100ce57fe5b6100e2600160a060020a03600435166106af565b60408051918252519081900360200190f35b34156100fc57fe5b6100c46004356024356044356106ce565b005b341561011757fe5b6100c4600435602435610b7d565b005b341561012f57fe5b61013a600435610cee565b60408051600160a060020a0386168152831515918101919091526060810182905260806020808301828152865192840192909252855160a084019187019080838382156101a2575b8051825260208311156101a257601f199092019160209182019101610182565b505050905090810190601f1680156101ce5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34156101e757fe5b6101fe600160a060020a0360043516602435610dce565b6040518086815260200185600160a060020a0316600160a060020a0316815260200184600160a060020a0316600160a060020a031681526020018060200183151515158152602001828103825284818151815260200191508051906020019080838360008314610289575b80518252602083111561028957601f199092019160209182019101610269565b505050905090810190601f1680156102b55780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34156102cf57fe5b6102e6600160a060020a0360043516602435610efc565b6040518086815260200185600160a060020a0316600160a060020a031681526020018060200184151515158152602001838152602001828103825285818151815260200191508051906020019080838360008314610289575b80518252602083111561028957601f199092019160209182019101610269565b505050905090810190601f1680156102b55780820380516001836020036101000a031916815260200191505b50965050505050505060405180910390f35b34156103a557fe5b60408051602060046024803582810135601f81018590048502860185019096528585526100c4958335600160a060020a03169593946044949392909201918190840183828082843750949650509335935061102492505050565b005b341561040957fe5b6100e2600160a060020a0360043516611166565b60408051918252519081900360200190f35b341561043757fe5b610442600435611185565b60408051600160a060020a038087168252851660208083019190915283151560608301526080928201838152855193830193909352845191929160a084019186019080838382156101a2575b8051825260208311156101a257601f199092019160209182019101610182565b505050905090810190601f1680156101ce5780820380516001836020036101000a031916815260200191505b509550505050505060405180910390f35b34156104f357fe5b6100c4600160a060020a0360043516602435604435611266565b005b600160a060020a033316600090815260036020526040812054908184106105365760006000fd5b600160a060020a033316600090815260036020526040902080548491908690811061055d57fe5b906000526020600020900160005b5054146105785760006000fd5b60008381526001602052604090206003015460ff16156105985760006000fd5b5060008281526001602052604090206004015480156105cb576000818152600260205260409020600401805460ff191690555b600160a060020a0333166000908152600360205260409020805460001984019081106105f357fe5b906000526020600020900160005b5054600160a060020a033316600090815260036020526040902080548690811061062757fe5b906000526020600020900160005b5055600160a060020a0333166000908152600360205260409020805490610660906000198301611340565b50600083815260016020819052604082208281559081018054600160a060020a031916905590610693600283018261136a565b5060038101805460ff1916905560006004909101555b50505050565b600160a060020a0381166000908152600360205260409020545b919050565b600160a060020a03331660009081526003602052604081205490808286106106f65760006000fd5b600160a060020a033316600090815260036020526040902080548691908890811061071d57fe5b906000526020600020900160005b5054146107385760006000fd5b60008581526001602052604090206003015460ff1615156107595760006000fd5b50506000838152600160209081526040808320600160a060020a033316845260049283905292205490820154156107de578084106107975760006000fd5b600480830154600160a060020a033316600090815260209290925260409091208054869081106107c357fe5b906000526020600020900160005b5054146107de5760006000fd5b5b6004820154151561097e576040805160a081018252868152600184810154600160a060020a0390811660208085019190915233909116838501526002808701805486516101009582161595909502600019011691909104601f810183900483028401830190955284835292936060850193918301828280156108a25780601f10610877576101008083540402835291602001916108a2565b820191906000526020600020905b81548152906001019060200180831161088557829003601f168201915b50505091835250506000602091820181905287815260028083526040918290208451815584840151600182018054600160a060020a0319908116600160a060020a039384161790915593860151928201805490941692169190911790915560608301518051919261091b926003850192909101906113b2565b50608091909101516004918201805460ff1916911515919091179055600183810154600160a060020a0316600090815260209290925260409091208054909181016109668382611340565b916000526020600020900160005b5086905550610a97565b6001808301805460048086018054600090815260026020908152604080832088018054600160a060020a031916600160a060020a03978816179055925482528282208401805460ff19169055945490931683529252208054909181016109e48382611340565b916000526020600020900160005b50600480850154909155600160a060020a03331660009081526020919091526040902080549091506000198301908110610a2857fe5b906000526020600020900160005b5054600160a060020a0333166000908152600460205260409020805486908110610a5c57fe5b906000526020600020900160005b5055600160a060020a0333166000908152600460205260409020805490610a95906000198301611340565b505b600160a060020a033316600090815260036020526040902080546000198501908110610abf57fe5b906000526020600020900160005b5054600160a060020a0333166000908152600360205260409020805488908110610af357fe5b906000526020600020900160005b5055600160a060020a0333166000908152600360205260409020805490610b2c906000198301611340565b50600085815260016020819052604082208281559081018054600160a060020a031916905590610b5f600283018261136a565b5060038101805460ff1916905560006004909101555b505050505050565b600160a060020a033316600090815260046020526040902054808310610ba35760006000fd5b600160a060020a0333166000908152600460205260409020805483919085908110610bca57fe5b906000526020600020900160005b505414610be55760006000fd5b60008281526002602052604090206004015460ff1615610c055760006000fd5b600160a060020a033316600090815260046020526040902080546000198301908110610c2d57fe5b906000526020600020900160005b5054600160a060020a0333166000908152600460205260409020805485908110610c6157fe5b906000526020600020900160005b5055600160a060020a0333166000908152600460205260409020805490610c9a906000198301611340565b5060008281526002602081905260408220828155600181018054600160a060020a0319908116909155918101805490921690915590610cdc600383018261136a565b50600401805460ff191690555b505050565b6000610cf861145b565b600083815260016020818152604080842080840154600382015460048301546002808501805487516101009a8216159a909a02600019011691909104601f810188900488028901880190965285885288979496600160a060020a0390941695909460ff90931693919291859190830182828015610db65780601f10610d8b57610100808354040283529160200191610db6565b820191906000526020600020905b815481529060010190602001808311610d9957829003601f168201915b5050505050925094509450945094505b509193509193565b600060006000610ddc61145b565b600160a060020a0386166000908152600460205260408120805482916002918391908a908110610e0857fe5b906000526020600020900160005b5054815260208082019290925260409081016000208054600180830154600280850154600486015460038701805489516101009782161597909702600019011693909304601f81018a90048a0286018a019098528785529598509396600160a060020a03928316969290941694909360ff90911692918491830182828015610edf5780601f10610eb457610100808354040283529160200191610edf565b820191906000526020600020905b815481529060010190602001808311610ec257829003601f168201915b50505050509150955095509550955095505b509295509295909350565b60006000610f0861145b565b600160a060020a038516600090815260036020526040812080548291829160019183918a908110610f3557fe5b906000526020600020900160005b5054815260208082019290925260409081016000208054600180830154600384015460048501546002808701805489516101009782161597909702600019011691909104601f81018a90048a0286018a019098528785529598509396600160a060020a039092169560ff9091169392918591908301828280156110075780601f10610fdc57610100808354040283529160200191611007565b820191906000526020600020905b815481529060010190602001808311610fea57829003601f168201915b50505050509250955095509550955095505b509295509295909350565b6000811561107a57506000818152600260205260409020600181015433600160a060020a03908116911614158061105f5750600481015460ff165b1561106a5760006000fd5b60048101805460ff191660011790555b600160a060020a03331660009081526003602052604090208054600181016110a28382611340565b916000526020600020900160005b5060008054918290556040805160a081018252838152600160a060020a0389811660208084019182528385018b815260608501879052608085018b90529686526001808252949095208351815590519381018054600160a060020a0319169490921693909317905592518051939450909261113192600285019201906113b2565b50606082015160038201805460ff19169115159190911790556080909101516004909101556000805460010190555b50505050565b600160a060020a0381166000908152600460205260409020545b919050565b6000600061119161145b565b60008481526002602081815260408084206001808201548286015460048401546003850180548751601f600019978316156101000297909701909116999099049485018890048802890188019096528388529396600160a060020a039283169691909216949360ff1692849183018282801561124e5780601f106112235761010080835404028352916020019161124e565b820191906000526020600020905b81548152906001019060200180831161123157829003601f168201915b5050505050915094509450945094505b509193509193565b600160a060020a03831660009081526003602052604090205480831061128c5760006000fd5b600160a060020a03841660009081526003602052604090208054839190859081106112b357fe5b906000526020600020900160005b5054146112ce5760006000fd5b6000828152600160208190526040909120015433600160a060020a039081169116146112fa5760006000fd5b60008281526001602052604090206003015460ff161561131a5760006000fd5b6000828152600160208190526040909120600301805460ff191690911790555b50505050565b815481835581811511610ce957600083815260209020610ce991810190830161146d565b5b505050565b50805460018160011615610100020316600290046000825580601f1061139057506113ae565b601f0160209004906000526020600020908101906113ae919061146d565b5b50565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106113f357805160ff1916838001178555611420565b82800160010185558215611420579182015b82811115611420578251825591602001919060010190611405565b5b5061142d92915061146d565b5090565b815481835581811511610ce957600083815260209020610ce991810190830161146d565b5b505050565b60408051602081019091526000815290565b61148b91905b8082111561142d5760008155600101611473565b5090565b905600a165627a7a7230582034b1caa00c6ef5d6c94236691746087a8488497b1298ae156b667b3b7f26a9990029`

// DeployFavorNetwork deploys a new Ethereum contract, binding an instance of FavorNetwork to it.
func DeployFavorNetwork(auth *bind.TransactOpts, backend bind.ContractBackend) (common.Address, *types.Transaction, *FavorNetwork, error) {
	parsed, err := abi.JSON(strings.NewReader(FavorNetworkABI))
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	address, tx, contract, err := bind.DeployContract(auth, parsed, common.FromHex(FavorNetworkBin), backend)
	if err != nil {
		return common.Address{}, nil, nil, err
	}
	return address, tx, &FavorNetwork{FavorNetworkCaller: FavorNetworkCaller{contract: contract}, FavorNetworkTransactor: FavorNetworkTransactor{contract: contract}}, nil
}

// FavorNetwork is an auto generated Go binding around an Ethereum contract.
type FavorNetwork struct {
	FavorNetworkCaller     // Read-only binding to the contract
	FavorNetworkTransactor // Write-only binding to the contract
}

// FavorNetworkCaller is an auto generated read-only Go binding around an Ethereum contract.
type FavorNetworkCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FavorNetworkTransactor is an auto generated write-only Go binding around an Ethereum contract.
type FavorNetworkTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// FavorNetworkSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type FavorNetworkSession struct {
	Contract     *FavorNetwork     // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// FavorNetworkCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type FavorNetworkCallerSession struct {
	Contract *FavorNetworkCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts       // Call options to use throughout this session
}

// FavorNetworkTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type FavorNetworkTransactorSession struct {
	Contract     *FavorNetworkTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts       // Transaction auth options to use throughout this session
}

// FavorNetworkRaw is an auto generated low-level Go binding around an Ethereum contract.
type FavorNetworkRaw struct {
	Contract *FavorNetwork // Generic contract binding to access the raw methods on
}

// FavorNetworkCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type FavorNetworkCallerRaw struct {
	Contract *FavorNetworkCaller // Generic read-only contract binding to access the raw methods on
}

// FavorNetworkTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type FavorNetworkTransactorRaw struct {
	Contract *FavorNetworkTransactor // Generic write-only contract binding to access the raw methods on
}

// NewFavorNetwork creates a new instance of FavorNetwork, bound to a specific deployed contract.
func NewFavorNetwork(address common.Address, backend bind.ContractBackend) (*FavorNetwork, error) {
	contract, err := bindFavorNetwork(address, backend, backend)
	if err != nil {
		return nil, err
	}
	return &FavorNetwork{FavorNetworkCaller: FavorNetworkCaller{contract: contract}, FavorNetworkTransactor: FavorNetworkTransactor{contract: contract}}, nil
}

// NewFavorNetworkCaller creates a new read-only instance of FavorNetwork, bound to a specific deployed contract.
func NewFavorNetworkCaller(address common.Address, caller bind.ContractCaller) (*FavorNetworkCaller, error) {
	contract, err := bindFavorNetwork(address, caller, nil)
	if err != nil {
		return nil, err
	}
	return &FavorNetworkCaller{contract: contract}, nil
}

// NewFavorNetworkTransactor creates a new write-only instance of FavorNetwork, bound to a specific deployed contract.
func NewFavorNetworkTransactor(address common.Address, transactor bind.ContractTransactor) (*FavorNetworkTransactor, error) {
	contract, err := bindFavorNetwork(address, nil, transactor)
	if err != nil {
		return nil, err
	}
	return &FavorNetworkTransactor{contract: contract}, nil
}

// bindFavorNetwork binds a generic wrapper to an already deployed contract.
func bindFavorNetwork(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor) (*bind.BoundContract, error) {
	parsed, err := abi.JSON(strings.NewReader(FavorNetworkABI))
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, parsed, caller, transactor), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FavorNetwork *FavorNetworkRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _FavorNetwork.Contract.FavorNetworkCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FavorNetwork *FavorNetworkRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FavorNetwork.Contract.FavorNetworkTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FavorNetwork *FavorNetworkRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FavorNetwork.Contract.FavorNetworkTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_FavorNetwork *FavorNetworkCallerRaw) Call(opts *bind.CallOpts, result interface{}, method string, params ...interface{}) error {
	return _FavorNetwork.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_FavorNetwork *FavorNetworkTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _FavorNetwork.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_FavorNetwork *FavorNetworkTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _FavorNetwork.Contract.contract.Transact(opts, method, params...)
}

// GetPromise is a free data retrieval call binding the contract method 0xf7208593.
//
// Solidity: function getPromise(id uint256) constant returns(owner address, from address, favor string, offered bool)
func (_FavorNetwork *FavorNetworkCaller) GetPromise(opts *bind.CallOpts, id *big.Int) (struct {
	Owner   common.Address
	From    common.Address
	Favor   string
	Offered bool
}, error) {
	ret := new(struct {
		Owner   common.Address
		From    common.Address
		Favor   string
		Offered bool
	})
	out := ret
	err := _FavorNetwork.contract.Call(opts, out, "getPromise", id)
	return *ret, err
}

// GetPromise is a free data retrieval call binding the contract method 0xf7208593.
//
// Solidity: function getPromise(id uint256) constant returns(owner address, from address, favor string, offered bool)
func (_FavorNetwork *FavorNetworkSession) GetPromise(id *big.Int) (struct {
	Owner   common.Address
	From    common.Address
	Favor   string
	Offered bool
}, error) {
	return _FavorNetwork.Contract.GetPromise(&_FavorNetwork.CallOpts, id)
}

// GetPromise is a free data retrieval call binding the contract method 0xf7208593.
//
// Solidity: function getPromise(id uint256) constant returns(owner address, from address, favor string, offered bool)
func (_FavorNetwork *FavorNetworkCallerSession) GetPromise(id *big.Int) (struct {
	Owner   common.Address
	From    common.Address
	Favor   string
	Offered bool
}, error) {
	return _FavorNetwork.Contract.GetPromise(&_FavorNetwork.CallOpts, id)
}

// GetPromiseAt is a free data retrieval call binding the contract method 0xcab76a6e.
//
// Solidity: function getPromiseAt(user address, index uint256) constant returns(id uint256, owner address, from address, favor string, offered bool)
func (_FavorNetwork *FavorNetworkCaller) GetPromiseAt(opts *bind.CallOpts, user common.Address, index *big.Int) (struct {
	Id      *big.Int
	Owner   common.Address
	From    common.Address
	Favor   string
	Offered bool
}, error) {
	ret := new(struct {
		Id      *big.Int
		Owner   common.Address
		From    common.Address
		Favor   string
		Offered bool
	})
	out := ret
	err := _FavorNetwork.contract.Call(opts, out, "getPromiseAt", user, index)
	return *ret, err
}

// GetPromiseAt is a free data retrieval call binding the contract method 0xcab76a6e.
//
// Solidity: function getPromiseAt(user address, index uint256) constant returns(id uint256, owner address, from address, favor string, offered bool)
func (_FavorNetwork *FavorNetworkSession) GetPromiseAt(user common.Address, index *big.Int) (struct {
	Id      *big.Int
	Owner   common.Address
	From    common.Address
	Favor   string
	Offered bool
}, error) {
	return _FavorNetwork.Contract.GetPromiseAt(&_FavorNetwork.CallOpts, user, index)
}

// GetPromiseAt is a free data retrieval call binding the contract method 0xcab76a6e.
//
// Solidity: function getPromiseAt(user address, index uint256) constant returns(id uint256, owner address, from address, favor string, offered bool)
func (_FavorNetwork *FavorNetworkCallerSession) GetPromiseAt(user common.Address, index *big.Int) (struct {
	Id      *big.Int
	Owner   common.Address
	From    common.Address
	Favor   string
	Offered bool
}, error) {
	return _FavorNetwork.Contract.GetPromiseAt(&_FavorNetwork.CallOpts, user, index)
}

// GetPromiseCount is a free data retrieval call binding the contract method 0xf64fe577.
//
// Solidity: function getPromiseCount(user address) constant returns(uint256)
func (_FavorNetwork *FavorNetworkCaller) GetPromiseCount(opts *bind.CallOpts, user common.Address) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _FavorNetwork.contract.Call(opts, out, "getPromiseCount", user)
	return *ret0, err
}

// GetPromiseCount is a free data retrieval call binding the contract method 0xf64fe577.
//
// Solidity: function getPromiseCount(user address) constant returns(uint256)
func (_FavorNetwork *FavorNetworkSession) GetPromiseCount(user common.Address) (*big.Int, error) {
	return _FavorNetwork.Contract.GetPromiseCount(&_FavorNetwork.CallOpts, user)
}

// GetPromiseCount is a free data retrieval call binding the contract method 0xf64fe577.
//
// Solidity: function getPromiseCount(user address) constant returns(uint256)
func (_FavorNetwork *FavorNetworkCallerSession) GetPromiseCount(user common.Address) (*big.Int, error) {
	return _FavorNetwork.Contract.GetPromiseCount(&_FavorNetwork.CallOpts, user)
}

// GetRequest is a free data retrieval call binding the contract method 0xc58343ef.
//
// Solidity: function getRequest(id uint256) constant returns(from address, favor string, bound bool, reward uint256)
func (_FavorNetwork *FavorNetworkCaller) GetRequest(opts *bind.CallOpts, id *big.Int) (struct {
	From   common.Address
	Favor  string
	Bound  bool
	Reward *big.Int
}, error) {
	ret := new(struct {
		From   common.Address
		Favor  string
		Bound  bool
		Reward *big.Int
	})
	out := ret
	err := _FavorNetwork.contract.Call(opts, out, "getRequest", id)
	return *ret, err
}

// GetRequest is a free data retrieval call binding the contract method 0xc58343ef.
//
// Solidity: function getRequest(id uint256) constant returns(from address, favor string, bound bool, reward uint256)
func (_FavorNetwork *FavorNetworkSession) GetRequest(id *big.Int) (struct {
	From   common.Address
	Favor  string
	Bound  bool
	Reward *big.Int
}, error) {
	return _FavorNetwork.Contract.GetRequest(&_FavorNetwork.CallOpts, id)
}

// GetRequest is a free data retrieval call binding the contract method 0xc58343ef.
//
// Solidity: function getRequest(id uint256) constant returns(from address, favor string, bound bool, reward uint256)
func (_FavorNetwork *FavorNetworkCallerSession) GetRequest(id *big.Int) (struct {
	From   common.Address
	Favor  string
	Bound  bool
	Reward *big.Int
}, error) {
	return _FavorNetwork.Contract.GetRequest(&_FavorNetwork.CallOpts, id)
}

// GetRequestAt is a free data retrieval call binding the contract method 0xd88d74d3.
//
// Solidity: function getRequestAt(user address, index uint256) constant returns(id uint256, from address, favor string, bound bool, reward uint256)
func (_FavorNetwork *FavorNetworkCaller) GetRequestAt(opts *bind.CallOpts, user common.Address, index *big.Int) (struct {
	Id     *big.Int
	From   common.Address
	Favor  string
	Bound  bool
	Reward *big.Int
}, error) {
	ret := new(struct {
		Id     *big.Int
		From   common.Address
		Favor  string
		Bound  bool
		Reward *big.Int
	})
	out := ret
	err := _FavorNetwork.contract.Call(opts, out, "getRequestAt", user, index)
	return *ret, err
}

// GetRequestAt is a free data retrieval call binding the contract method 0xd88d74d3.
//
// Solidity: function getRequestAt(user address, index uint256) constant returns(id uint256, from address, favor string, bound bool, reward uint256)
func (_FavorNetwork *FavorNetworkSession) GetRequestAt(user common.Address, index *big.Int) (struct {
	Id     *big.Int
	From   common.Address
	Favor  string
	Bound  bool
	Reward *big.Int
}, error) {
	return _FavorNetwork.Contract.GetRequestAt(&_FavorNetwork.CallOpts, user, index)
}

// GetRequestAt is a free data retrieval call binding the contract method 0xd88d74d3.
//
// Solidity: function getRequestAt(user address, index uint256) constant returns(id uint256, from address, favor string, bound bool, reward uint256)
func (_FavorNetwork *FavorNetworkCallerSession) GetRequestAt(user common.Address, index *big.Int) (struct {
	Id     *big.Int
	From   common.Address
	Favor  string
	Bound  bool
	Reward *big.Int
}, error) {
	return _FavorNetwork.Contract.GetRequestAt(&_FavorNetwork.CallOpts, user, index)
}

// GetRequestCount is a free data retrieval call binding the contract method 0xada49963.
//
// Solidity: function getRequestCount(user address) constant returns(uint256)
func (_FavorNetwork *FavorNetworkCaller) GetRequestCount(opts *bind.CallOpts, user common.Address) (*big.Int, error) {
	var (
		ret0 = new(*big.Int)
	)
	out := ret0
	err := _FavorNetwork.contract.Call(opts, out, "getRequestCount", user)
	return *ret0, err
}

// GetRequestCount is a free data retrieval call binding the contract method 0xada49963.
//
// Solidity: function getRequestCount(user address) constant returns(uint256)
func (_FavorNetwork *FavorNetworkSession) GetRequestCount(user common.Address) (*big.Int, error) {
	return _FavorNetwork.Contract.GetRequestCount(&_FavorNetwork.CallOpts, user)
}

// GetRequestCount is a free data retrieval call binding the contract method 0xada49963.
//
// Solidity: function getRequestCount(user address) constant returns(uint256)
func (_FavorNetwork *FavorNetworkCallerSession) GetRequestCount(user common.Address) (*big.Int, error) {
	return _FavorNetwork.Contract.GetRequestCount(&_FavorNetwork.CallOpts, user)
}

// AcceptRequest is a paid mutator transaction binding the contract method 0xfb05449a.
//
// Solidity: function acceptRequest(from address, index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkTransactor) AcceptRequest(opts *bind.TransactOpts, from common.Address, index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.contract.Transact(opts, "acceptRequest", from, index, id)
}

// AcceptRequest is a paid mutator transaction binding the contract method 0xfb05449a.
//
// Solidity: function acceptRequest(from address, index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkSession) AcceptRequest(from common.Address, index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.AcceptRequest(&_FavorNetwork.TransactOpts, from, index, id)
}

// AcceptRequest is a paid mutator transaction binding the contract method 0xfb05449a.
//
// Solidity: function acceptRequest(from address, index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkTransactorSession) AcceptRequest(from common.Address, index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.AcceptRequest(&_FavorNetwork.TransactOpts, from, index, id)
}

// DropPromise is a paid mutator transaction binding the contract method 0xb974bfa1.
//
// Solidity: function dropPromise(index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkTransactor) DropPromise(opts *bind.TransactOpts, index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.contract.Transact(opts, "dropPromise", index, id)
}

// DropPromise is a paid mutator transaction binding the contract method 0xb974bfa1.
//
// Solidity: function dropPromise(index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkSession) DropPromise(index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.DropPromise(&_FavorNetwork.TransactOpts, index, id)
}

// DropPromise is a paid mutator transaction binding the contract method 0xb974bfa1.
//
// Solidity: function dropPromise(index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkTransactorSession) DropPromise(index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.DropPromise(&_FavorNetwork.TransactOpts, index, id)
}

// DropRequest is a paid mutator transaction binding the contract method 0x0d50f132.
//
// Solidity: function dropRequest(index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkTransactor) DropRequest(opts *bind.TransactOpts, index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.contract.Transact(opts, "dropRequest", index, id)
}

// DropRequest is a paid mutator transaction binding the contract method 0x0d50f132.
//
// Solidity: function dropRequest(index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkSession) DropRequest(index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.DropRequest(&_FavorNetwork.TransactOpts, index, id)
}

// DropRequest is a paid mutator transaction binding the contract method 0x0d50f132.
//
// Solidity: function dropRequest(index uint256, id uint256) returns()
func (_FavorNetwork *FavorNetworkTransactorSession) DropRequest(index *big.Int, id *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.DropRequest(&_FavorNetwork.TransactOpts, index, id)
}

// HonourRequest is a paid mutator transaction binding the contract method 0xb82f8fda.
//
// Solidity: function honourRequest(reqIdx uint256, reqId uint256, promIdx uint256) returns()
func (_FavorNetwork *FavorNetworkTransactor) HonourRequest(opts *bind.TransactOpts, reqIdx *big.Int, reqId *big.Int, promIdx *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.contract.Transact(opts, "honourRequest", reqIdx, reqId, promIdx)
}

// HonourRequest is a paid mutator transaction binding the contract method 0xb82f8fda.
//
// Solidity: function honourRequest(reqIdx uint256, reqId uint256, promIdx uint256) returns()
func (_FavorNetwork *FavorNetworkSession) HonourRequest(reqIdx *big.Int, reqId *big.Int, promIdx *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.HonourRequest(&_FavorNetwork.TransactOpts, reqIdx, reqId, promIdx)
}

// HonourRequest is a paid mutator transaction binding the contract method 0xb82f8fda.
//
// Solidity: function honourRequest(reqIdx uint256, reqId uint256, promIdx uint256) returns()
func (_FavorNetwork *FavorNetworkTransactorSession) HonourRequest(reqIdx *big.Int, reqId *big.Int, promIdx *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.HonourRequest(&_FavorNetwork.TransactOpts, reqIdx, reqId, promIdx)
}

// MakeRequest is a paid mutator transaction binding the contract method 0xe5371691.
//
// Solidity: function makeRequest(from address, favor string, reward uint256) returns()
func (_FavorNetwork *FavorNetworkTransactor) MakeRequest(opts *bind.TransactOpts, from common.Address, favor string, reward *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.contract.Transact(opts, "makeRequest", from, favor, reward)
}

// MakeRequest is a paid mutator transaction binding the contract method 0xe5371691.
//
// Solidity: function makeRequest(from address, favor string, reward uint256) returns()
func (_FavorNetwork *FavorNetworkSession) MakeRequest(from common.Address, favor string, reward *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.MakeRequest(&_FavorNetwork.TransactOpts, from, favor, reward)
}

// MakeRequest is a paid mutator transaction binding the contract method 0xe5371691.
//
// Solidity: function makeRequest(from address, favor string, reward uint256) returns()
func (_FavorNetwork *FavorNetworkTransactorSession) MakeRequest(from common.Address, favor string, reward *big.Int) (*types.Transaction, error) {
	return _FavorNetwork.Contract.MakeRequest(&_FavorNetwork.TransactOpts, from, favor, reward)
}
