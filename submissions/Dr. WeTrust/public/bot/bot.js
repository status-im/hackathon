/**
 *  Hello, thanks for checking out the bot. You might notice that things are a bit messy in here,
 *  I guess that's my fault but there's nothing I can do about it, it's just who I am.
 *  There are some pretty horrible functions, like the while loop on `waitForMining`, and some of
 *  the markup-returning functions are a bit gross, but I blame that on the funky way of creating
 *  React Native components that Status has enforced and not at all on my frivolous usage of copy
 *  and paste without concern for maintainability. I actually really like the component generation
 *  flow, though the fact that `touchable` components can only accept `view` components as their
 *  final argument confused me and caused a lot of crashes before I realised. IIRC this is also
 *  enforced in React Native, but it would be good to have something in the docs which mentions it.
 *
 *  All in all, creating the bot was a very pleasant experience, and I would say that the API, while
 *  still a pretty long way from being completely production-ready, is fully-fledged enough to build
 *  some very powerful applications.
 *
 *  Any items in the list below which do not have a GitHub link are assumed to be already known to
 *  the Status team, so I didn't see any value in creating an issue for them.
 *
 *  Some bugs I think I noticed:
 *
 *    - If I assign web3.eth.accounts[0] to a variable at the top of this script, the whole thing
 *      kinda dies and I have to delete and re-add the bot to get it to work again
 *
 *    - Suggestions markup only shows for the first param if you have `sequentialParams: true`.
 *      Logged it here: https://github.com/status-im/status-react/issues/1279
 *
 *    - If I `x` out of a transaction on the confirmation screen, I get a nasty error popup, and I'm
 *      not sure on the method of handling that
 *
 *    - When issuing a command which has a `preview` that takes a long time to render, the
 *      `suggestions` markup will stay visible until the preview has returned. This looks a bit
 *      rough around the edges, it would be nice to be able to hide the `suggestions` area on-demand
 *      Logged here: https://github.com/status-im/status-react/issues/1299
 *
 *    - When using `events.SET_VALUE` to add a command to the input text, the suggestions for the
 *      new command are not shown. You can reproduce this by hitting /remove with no Circles in your
 *      storage, then clicking on the `/create` command button within the suggestions area.
 *      Logged here: https://github.com/status-im/status-react/issues/1298
 *
 *  Some things I would like to see:
 *
 *    - The ability to return custom React Native components in a .sendMessage() function
 *
 *    - An easier way of ordering any messages arising from `handler` and `preview`. Logged that
 *      here: https://github.com/status-im/status-react/issues/1280
 *
 *    - Custom JavaScript handlers for the touchable component's onPress properties
 *
 *    - If not the above, the ability to specify and listen to custom events with `dispatch` and
 *      `addListener`
 */

var DB_PREFIX = 'savewithstatus_'
var CIRCLE_ABI = [{'constant': true, 'inputs': [], 'name': 'contributionSize', 'outputs': [{'name': '', 'type': 'uint128'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'withdraw', 'outputs': [{'name': 'success', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'checkRoundCanAdvance', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'startRound', 'outputs': [{'name': 'success', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [{'name': '', 'type': 'uint256'}], 'name': 'membersAddresses', 'outputs': [{'name': '', 'type': 'address'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'endOfROSCA', 'outputs': [{'name': '', 'type': 'bool'}], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'currentRound', 'outputs': [{'name': '', 'type': 'uint16'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'index', 'type': 'uint256'}], 'name': 'getUserName', 'outputs': [{'name': 'userName', 'type': 'string'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'getMemberCount', 'outputs': [{'name': 'memberCount', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [{'name': 'newMember', 'type': 'address'}, {'name': 'userName', 'type': 'string'}], 'name': 'addMember', 'outputs': [], 'payable': false, 'type': 'function'}, {'constant': true, 'inputs': [], 'name': 'roundPeriodInSecs', 'outputs': [{'name': '', 'type': 'uint256'}], 'payable': false, 'type': 'function'}, {'constant': false, 'inputs': [], 'name': 'contribute', 'outputs': [], 'payable': true, 'type': 'function'}, {'constant': true, 'inputs': [{'name': 'user', 'type': 'address'}], 'name': 'getParticipantBalance', 'outputs': [{'name': '', 'type': 'int256'}], 'payable': false, 'type': 'function'}, {'inputs': [{'name': 'contributionSize_', 'type': 'uint128'}, {'name': 'userName', 'type': 'string'}], 'payable': false, 'type': 'constructor'}]
var CIRCLE_BYTECODE = '0x60606040526000600360006101000a81548160ff0219169083151502179055506000600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555034156200006a57fe5b60405162001b3f38038062001b3f833981016040528080519060200190919080518201919050505b601e60008190555081600160026101000a8154816fffffffffffffffffffffffffffffffff02191690836fffffffffffffffffffffffffffffffff16021790555042600281905550620000fa3382620001036401000000000262000b12176401000000009004565b5b5050620003f6565b600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900460ff16806200017357506000600160009054906101000a900461ffff1661ffff16115b156200017f5760006000fd5b6080604051908101604052806000815260200160001515815260200160001515815260200160011515815250600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548160ff02191690831515021790555060408201518160010160016101000a81548160ff02191690831515021790555060608201518160010160026101000a81548160ff021916908315150217905550905050600680548060010182816200026d919062000318565b916000526020600020900160005b84909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505080600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002090805190602001906200031292919062000347565b505b5050565b8154818355818115116200034257818360005260206000209182019101620003419190620003ce565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200038a57805160ff1916838001178555620003bb565b82800160010185558215620003bb579182015b82811115620003ba5782518255916020019190600101906200039d565b5b509050620003ca9190620003ce565b5090565b620003f391905b80821115620003ef576000816000905550600101620003d5565b5090565b90565b61173980620004066000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680633979c5ab146100c55780633ccfd60b1461010f57806352460f481461013957806355e3f086146101635780635ee5a3c61461018d57806385860a70146101ed5780638a19c8bc14610217578063988da80f14610245578063997072f7146102ec578063c127c24714610312578063c94177831461038b578063d7bb99ba146103b1578063e9560b3b146103bb575bfe5b34156100cd57fe5b6100d5610405565b60405180826fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b341561011757fe5b61011f610427565b604051808215151515815260200191505060405180910390f35b341561014157fe5b610149610776565b604051808215151515815260200191505060405180910390f35b341561016b57fe5b61017361089c565b604051808215151515815260200191505060405180910390f35b341561019557fe5b6101ab600480803590602001909190505061097a565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b34156101f557fe5b6101fd6109ba565b604051808215151515815260200191505060405180910390f35b341561021f57fe5b6102276109cd565b604051808261ffff1661ffff16815260200191505060405180910390f35b341561024d57fe5b61026360048080359060200190919050506109e1565b60405180806020018281038252838181518152602001915080519060200190808383600083146102b2575b8051825260208311156102b25760208201915060208101905060208303925061028e565b505050905090810190601f1680156102de5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102f457fe5b6102fc610b04565b6040518082815260200191505060405180910390f35b341561031a57fe5b610389600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610b12565b005b341561039357fe5b61039b610d21565b6040518082815260200191505060405180910390f35b6103b9610d27565b005b34156103c357fe5b6103ef600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610eee565b6040518082815260200191505060405180910390f35b600160029054906101000a90046fffffffffffffffffffffffffffffffff1681565b60006000600060006000600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900460ff16151561048d5760006000fd5b6000600160009054906101000a900461ffff1661ffff1611156104b4576104b261089c565b505b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff16801561051d5750600360009054906101000a900460ff16155b156105285760006000fd5b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001549350600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff1661060d57600160029054906101000a90046fffffffffffffffffffffffffffffffff16600160009054906101000a900461ffff1661ffff16026fffffffffffffffffffffffffffffffff16610646565b600160029054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16600680549050025b925083831015156106575760006000fd5b82840391503073ffffffffffffffffffffffffffffffffffffffff1631905081811015610682578091505b81600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc839081150290604051809050600060405180830381858888f1935050505015156107695781600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001600082825401925050819055506000945061076e565b600194505b5b5050505090565b600060006000600054600254019150814210156107965760009250610897565b600090505b6006805490508161ffff16101561089257600160029054906101000a90046fffffffffffffffffffffffffffffffff16600160009054906101000a900461ffff1661ffff16026fffffffffffffffffffffffffffffffff166005600060068461ffff1681548110151561080a57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000015410156108845760009250610897565b5b808060010191505061079b565b600192505b505090565b6000600360009054906101000a900460ff16156108b95760006000fd5b6108c1610776565b15156108d05760009050610976565b6000600160009054906101000a900461ffff1661ffff161415156108f7576108f661103a565b5b600680549050600160009054906101000a900461ffff1661ffff161015610952576001600081819054906101000a900461ffff168092919060010191906101000a81548161ffff021916908361ffff1602179055505061096e565b6001600360006101000a81548160ff0219169083151502179055505b426002819055505b5b90565b60068181548110151561098957fe5b906000526020600020900160005b915054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600360009054906101000a900460ff1681565b600160009054906101000a900461ffff1681565b6109e9611628565b600760006006848154811015156109fc57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610af75780601f10610acc57610100808354040283529160200191610af7565b820191906000526020600020905b815481529060010190602001808311610ada57829003601f168201915b505050505090505b919050565b600060068054905090505b90565b600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900460ff1680610b8157506000600160009054906101000a900461ffff1661ffff16115b15610b8c5760006000fd5b6080604051908101604052806000815260200160001515815260200160001515815260200160011515815250600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000820151816000015560208201518160010160006101000a81548160ff02191690831515021790555060408201518160010160016101000a81548160ff02191690831515021790555060608201518160010160026101000a81548160ff02191690831515021790555090505060068054806001018281610c78919061163c565b916000526020600020900160005b84909190916101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505080600760008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000209080519060200190610d1b929190611668565b505b5050565b60005481565b600060006000600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160029054906101000a900460ff161515610d895760006000fd5b600360009054906101000a900460ff1615610da45760006000fd5b6000600160009054906101000a900461ffff1661ffff161115610dcb57610dc961089c565b505b600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002092503491508183600001600082825401925050819055508260010160009054906101000a900460ff1615610ee657600160029054906101000a90046fffffffffffffffffffffffffffffffff16600160009054906101000a900461ffff1661ffff16026fffffffffffffffffffffffffffffffff16905080600160029054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff1660068054905002846000015403101515610ee55760008360010160006101000a81548160ff0219169083151502179055505b5b5b5b5b505050565b600060006000600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001549150600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160009054906101000a900460ff168015610fa25750600360009054906101000a900460ff16155b15610fe457600160029054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff1660068054905002820391505b600160029054906101000a90046fffffffffffffffffffffffffffffffff16600160009054906101000a900461ffff1661ffff16026fffffffffffffffffffffffffffffffff16905080820392505b5050919050565b600060006001600160009054906101000a900461ffff160360068054905003905061106481611084565b9150611077826001830361ffff1661141e565b61107f611534565b5b5050565b6000600060006000600060006000600095508761ffff16428115156110a557fe5b069350600092505b8761ffff168361ffff161015611255578761ffff168361ffff1685018115156110d257fe5b0691506006828154811015156110e457fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff169050600560008273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160019054906101000a900460ff16151561124757819450600160029054906101000a90046fffffffffffffffffffffffffffffffff16600160009054906101000a900461ffff1661ffff16026fffffffffffffffffffffffffffffffff16600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600001541015156112435780600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550611255565b8095505b5b82806001019350506110ad565b6000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1614156113d15760008673ffffffffffffffffffffffffffffffffffffffff1614806113075750600560008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160019054906101000a900460ff165b156113125760006000fd5b85600360016101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600160056000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160006101000a81548160ff0219169083151502179055505b600680549050600160029054906101000a90046fffffffffffffffffffffffffffffffff166fffffffffffffffffffffffffffffffff16026004819055508496505b505050505050919050565b60068181548110151561142d57fe5b906000526020600020900160005b9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660068381548110151561146957fe5b906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff166006828154811015156114e557fe5b906000526020600020900160005b6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055505b5050565b60045460056000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060000160008282540192505081905550600160056000600360019054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060010160016101000a81548160ff0219169083151502179055505b565b602060405190810160405280600081525090565b8154818355818115116116635781836000526020600020918201910161166291906116e8565b5b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106116a957805160ff19168380011785556116d7565b828001600101855582156116d7579182015b828111156116d65782518255916020019190600101906116bb565b5b5090506116e491906116e8565b5090565b61170a91905b808211156117065760008160009055506001016116ee565b5090565b905600a165627a7a72305820f71336326fabf27665d113c80252b73bf875cf81acff65d2c71f64a7848f6cfd0029'
var LendingCircle = web3.eth.contract(CIRCLE_ABI)

var COLORS = {
  DEFAULT_COMMAND: '#67C5BA',
  TOUCHABLE_TEXT: '#67C5BA',
  TOUCHABLE_BACKGROUND: '#67C5BA1f',
  BALANCE_POSITIVE: '#67C5BA',
  BALANCE_NEGATIVE: '#F3B058',
  BALANCE_NEUTRAL: '#0000001f',
  BORDER: '#67C5BA1f'
}

var STYLES = {
  SUGGESTIONS_HEADING: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.BORDER,
    paddingTop: 10,
    paddingBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    fontWeight: 'bold'
  },
  COMMAND_PREVIEW: {
    borderTopWidth: 1,
    borderTopColor: COLORS.BORDER,
    paddingTop: 5,
    marginTop: 5,
    flexWrap: 'wrap'
  },
  CIRCLE_LIST_ITEM: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    color: COLORS.TOUCHABLE_TEXT,
    fontWeight: 'bold',
    borderRadius: 10,
    backgroundColor: COLORS.TOUCHABLE_BACKGROUND
  },
  BUTTON: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: COLORS.TOUCHABLE_BACKGROUND
  },
  BUTTON_TEXT: {
    color: COLORS.TOUCHABLE_TEXT,
    fontWeight: 'bold'
  }
}

function createCircleNameParam(optional) {
  if (!optional) optional = {}
  var circleNameParam = {
    name: 'circleName',
    placeholder: optional.placeholder || 'Lending Circle Name',
    type: status.types.TEXT,
    suggestions: optional.suggestions || selectCircleSuggestions
  }
  return circleNameParam
}

function commandTextComponent(command) {
  return status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_VALUE, command]), style: STYLES.BUTTON},
      status.components.view({}, [status.components.text({style: STYLES.BUTTON_TEXT}, command)])
    )
}

function selectCircleSuggestions(params, context) {
  var circles = getAllCircles()
  var components
  components = circles.map(function(circle) {
    /**
     *  Please check out what I tried to do here :D
     *  Turns out the RPC calls are a little too slow (presumably because we have to call a non-
     *  light client node) for something like this, the suggestion box just takes a super long time
     *  to appear, which isn't the best experience.
     *  We could load & cache these values on the app's `init`, and then again every time the user
     *  interacts with that particular Lending Circle, but I am not sure how much fun that would be
     *  to write, and the payoff might not be good enough at this stage.
     */
    // var contract = LendingCircle.at(circle.address)
    // var balance = contract.getParticipantBalance.call(web3.eth.accounts[0], {from: web3.eth.accounts[0]})
    // var sign = getPlusOrMinus(balance)
    // var balanceColor = balance >= 0 ? COLORS.BALANCE_POSITIVE : COLORS.BALANCE_NEGATIVE
    // balanceColor = web3.fromWei(balance, 'ether') == 0 ? COLORS.BALANCE_NEUTRAL : balanceColor
    // var sign = '+'
    return status.components.touchable(
      {onPress: status.components.dispatch([status.events.SET_COMMAND_ARGUMENT, [0, circle.name]])},
      status.components.view(
        {style: STYLES.CIRCLE_LIST_ITEM},
        [
          status.components.text({style: {color: COLORS.TOUCHABLE_TEXT, fontWeight: 'bold'}}, circle.name)
          // status.components.text({style: {color: balanceColor, fontWeight: 'bold'}}, sign + web3.fromWei(balance, 'ether') + ' ETH'),
        ]
      )
    )
  })
  if (circles.length === 0) {
    // this flexDirection doesn't seem to work on the last view component in here, not sure what is up with that
    var textLineStyle = {flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, flexWrap: 'wrap', alignItems: 'center'}
    // pretty revolting but what are ya gonna do about it? it's a hackathon not a mr fancy-pantsathon
    components = [status.components.text({style: STYLES.SUGGESTIONS_HEADING}, 'It doesn\'t look like you have joined any Circles yet.'),
      status.components.view({style: textLineStyle}, [
        status.components.text({}, 'To create a circle, hit '),
        commandTextComponent('/create')
      ]),
      status.components.view({style: textLineStyle}, [
        status.components.text({}, 'To join an existing one, hit '),
        commandTextComponent('/join')
      ]),
      status.components.view({style: textLineStyle}, [
        status.components.text({}, 'If you\'re already a member of a Circle, hit '),
        commandTextComponent('/load')
      ])]
  }
  return {markup: status.components.scrollView({
    // this prop is necessary to make sure that the first tap doesn't just close the keyboard!
    keyboardShouldPersistTaps: 'always',
  }, components)}
}

// I did try to make a function which created this component given a heading and some paragraphs,
// so that we would only need one function below but it wouldn't work, don't flame pls
function circleNameSuggestions() {
  var circleNameSuggestions = status.components.scrollView({}, [
    status.components.text({style: STYLES.SUGGESTIONS_HEADING}, 'Please read the incoming wall of text!'),
    status.components.text({style: {margin: 10}}, 'Thanks for chatting with me. I guarantee you will have a fun time making Lending Circles with your friends.'),
    status.components.text({style: {margin: 10}}, 'You have chosen to create a new Lending Circle. First you should give your Lending Circle a name. Nobody else will see this, so just nickname it however you like. You could call it "Super Status Savings" or something equally unimaginative and nobody would know.'),
    status.components.text({style: {margin: 10}}, 'Then you will be asked to provide the contribution amount. This is the amount of Ether which will be asked of participants each round. Unfortunately I can\'t remind you to contribute, so you might have to do some memory games!'),
    status.components.text({style: {margin: 10}}, 'Participating in Lending Circles is strictly voluntary. Neither I nor anyone else can force someone to pay up, so make sure you only invite people you already trust.'),
    status.components.text({style: {margin: 10}}, 'In this iteration, (for the hackathon), Lending Circle rounds last a minimum of 30 seconds, which means every 30 seconds, someone can start a new round if they like by issuing the /start command. This is for the purposes of demonstration.'),
  ])
  return {markup: circleNameSuggestions}
}

function contractAddressSuggestions(params, context) {
  var circleNameSuggestions = status.components.view({}, [
    status.components.text({style: STYLES.SUGGESTIONS_HEADING}, 'Contract Address'),
    status.components.text({style: {margin: 10}}, 'This is the public contract address of the Lending Circle.'),
    status.components.text({style: {margin: 10}}, 'It should have been given to you by the creator, maybe give them a nudge if you don\'t have it.')
  ])
  return {markup: circleNameSuggestions}
}

var removeCommand = {
  name: 'remove',
  title: 'Remove',
  description: 'Remove a Lending Circle from your device',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  params: [createCircleNameParam()],
  preview: function(params, context) {},
  handler: function(params, context) {
    var address = getCircleAddress(params.circleName)
    var circles = getAllCircles()
    circles = deleteCircle(circles, address)
    saveAllCircles(circles)
    status.sendMessage('Ok, I have removed *' + params.circleName + '*.\n\nHit */load* if you want to add it back again.')
  }
}

var createCommand = {
  name: 'create',
  title: 'Create',
  description: 'Create a new Lending Circle',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  fullscreen: true,
  params: [{
    name: 'name',
    placeholder: 'Give it a name',
    type: status.types.TEXT,
    suggestions: circleNameSuggestions
  }, {
    name: 'paymentAmount',
    placeholder: 'How much ETH/week',
    type: status.types.NUMBER,
    suggestions: circleNameSuggestions
  }],
  validator: function(params) {
    var error
    if (params.name.length > 20) {
      error = status.components.validationMessage(
        'My memory isn\'t that good',
        'I\'ll never remember all that. Could you try something a little shorter?'
      )
      return {markup: error}
    }
    if (params.paymentAmount < 0.001) {
      error = status.components.validationMessage(
        'Not enough ETH',
        'What is this, a Lending Circle for ants?'
      )
      return {markup: error}
    }
  },
  preview: function(params, context) {
    return {markup: status.components.view({style: STYLES.COMMAND_PREVIEW}, [
      status.components.view({style: {flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}, [
        status.components.text({style: {paddingRight: 10}}, 'Name'),
        status.components.text({style: {fontWeight: 'bold'}}, params.name)
      ]),
      status.components.view({style: {flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap'}}, [
        status.components.text({style: {paddingRight: 10}}, 'Contribution'),
        status.components.text({style: {fontWeight: 'bold'}}, params.paymentAmount + ' ETH')
      ]),
      status.components.view({style: {paddingTop: 5, marginTop: 5, borderTopColor: COLORS.BORDER, borderTopWidth: 1}}, [
        status.components.text({style: {paddingTop: 5}}, 'Now that you\'ve created a circle, you\'ll probably want some of your friends to join it.'),
        status.components.text({style: {paddingTop: 5}}, 'Share the above address (the one which starts with "0x") with your friends, and they will be able to join using the /join command.'),
        status.components.text({style: {paddingTop: 5}}, 'Once you start the Lending Circle\'s first round with the /start command, nobody else will be able to join'),
      ])
    ])}
  },
  handler: function(params, context) {
    status.sendMessage('Ok, I just need you to confirm that, one sec...')
    var circle = LendingCircle.new(web3.toWei(params.paymentAmount, 'ether'), getMyName(), {
      from: web3.eth.accounts[0],
      data: CIRCLE_BYTECODE
    })
    status.sendMessage('Thanks, it will take a few seconds to deploy *' + params.name + '*.\n\nIf only I actually had hands to put a kettle on, now might be a good time...')
    var receipt = waitForMining(circle.transactionHash)
    if (receipt.failed) return status.sendMessage('Oh dear, I didn\'t manage to complete that, give it another go.')
    status.sendMessage('Done! Send your friends the below address and they can join your circle.')
    status.sendMessage(receipt.contractAddress)
    saveNewCircle({name: params.name, address: receipt.contractAddress, participants: [{name: getMyName(), address: web3.eth.accounts[0]}]})
  }
}

var joinCommand = {
  name: 'join',
  title: 'Join',
  description: 'Join an existing Lending Circle',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  fullscreen: true,
  params: [{
    name: 'contractAddress',
    placeholder: 'Contract Address',
    type: status.types.TEXT,
    suggestions: contractAddressSuggestions
  },
    createCircleNameParam({placeholder: 'Give the Circle a nickname'})
  ],
  validator: function(params, context) {
    if (!web3.isAddress(params.contractAddress)) {
      return {markup: status.components.validationMessage(
        'Not a real contract address',
        'Maybe you made a typo? I recommend copy & paste.'
      )}
    }
  },
  preview: function(params, context) {
    return {markup: status.components.view({style: STYLES.COMMAND_PREVIEW}, [
      status.components.view({style: {flexDirection: 'row', justifyContent: 'space-between'}}, [
        status.components.text({style: {paddingRight: 10}}, 'Name'),
        status.components.text({style: {fontWeight: 'bold'}}, params.circleName),
      ])
    ])}
  },
  handler: function(params, context) {
    status.sendMessage('Okay, hang on while I try to join *' + params.circleName + '* for you. Shouldn\'t be too long...')
    var circle = LendingCircle.at(params.contractAddress)
    var tx = circle.addMember(web3.eth.accounts[0], getMyName(), {from: web3.eth.accounts[0]})
    status.sendMessage('Crunch, whirr, creak...')
    var receipt = waitForMining(tx)
    if (receipt.failed) {
      status.sendMessage('Oh no! For some reason that failed, maybe you\'ve already joined this Circle, try using */load*')
      status.sendMessage('If that doesn\'t work, this Circle might have started without you :(')
      return
    }
    var participants = getCircleParticipants(circle)
    participants.push(getMyName())
    saveNewCircle({address: circle.address, name: params.circleName, participants: participants})
    status.sendMessage('Alright! We joined the circle, now you should be able to contribute!\n\nTry it out using the */contribute* command down below.')
  }
}

var loadCommand = {
  name: 'load',
  title: 'Load',
  description: 'Load an existing Circle',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  fullscreen: true,
  params: [{
    name: 'contractAddress',
    type: status.types.TEXT,
    placeholder: 'Contract address of the Circle'
  },
    createCircleNameParam({placeholder: 'Give the Circle a nickname'})
  ],
  preview: function(params, context) {
    return {markup: status.components.view({style: STYLES.COMMAND_PREVIEW}, [
      status.components.view({style: {flexDirection: 'row', justifyContent: 'space-between'}}, [
        status.components.text({style: {paddingRight: 20}}, 'Load'),
        status.components.text({style: {fontWeight: 'bold'}}, params.circleName)
      ])
    ])}
  },
  handler: function(params, context) {
    status.sendMessage('Ok, fetching that one, give me a moment...')
    var circle = LendingCircle.at(params.contractAddress)
    var dbSafeCircle = parseContractForDb(circle, params.circleName)
    saveNewCircle(dbSafeCircle)
    status.sendMessage('Sweet, I\'ve loaded that Circle and saved it as ' +
      '*' + params.circleName + '*.\n\nHit */stats* if you need a reminder about the status of this Circle.')
  }
}

var statsCommand = {
  name: 'stats',
  title: 'Stats',
  description: 'Check the stats of a Lending Circle',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  params: [createCircleNameParam()],
  fullscreen: true,
  validator: function(params, context) {},
  preview: function(params, context) {
    status.sendMessage('Ok, I\'ll fetch the stats for *' + params.circleName + '*, one tick...')
    var circle = getCircleFromSelection(params.circleName)
    status.sendMessage('The contract address for this Circle is printed in the next message, so you can share it easily:')
    status.sendMessage(circle.address)
    var participants = getCircleParticipants(circle)
    var currentRound = circle.currentRound.call()
    var components = [
      status.components.view({}, [
        status.components.text({style: {borderBottomWidth: 1, borderBottomColor: COLORS.BORDER, fontWeight: 'bold', paddingBottom: 5, marginBottom: 5}}, params.circleName),
        status.components.text({}, 'A green balance means the person is up to date,' +
          ' whereas an orange balance indicates that the person still needs to contribute to the Lending Circle.'),
        status.components.text({style: {
          fontWeight: 'bold', paddingTop: 10, paddingBottom: 5, marginBottom: 5, borderBottomWidth: 1, borderBottomColor: COLORS.BORDER
        }}, 'Balances'),
      ])
    ]
    var longestName = 0
    for (var i = 0; i < participants.length; i++) {
      var participant = participants[i]
      var me = false
      if (participant.address.toLowerCase() === web3.eth.accounts[0].toLowerCase()) me = true
      var balance = circle.getParticipantBalance(participant.address)
      if (participant.name.length > longestName) longestName = participant.name.length
      var color = balance >= 0 ? COLORS.BALANCE_POSITIVE : COLORS.BALANCE_NEGATIVE
      color = balance === 0 ? COLORS.BALANCE_NEUTRAL : color
      var totalContributed = getTotalContributed(circle, participant.address) +
        ' (' + getPlusOrMinus(balance) + web3.fromWei(balance, 'ether') + ') ETH'
      components.push(
        status.components.view({style: {
          flexDirection: 'row',
          justifyContent: 'space-between'
        }}, [
          status.components.text({style: {paddingRight: 20, fontWeight: me ? 'bold' : 'regular'}}, me ? 'You' : participant.name),
          status.components.text({style: {fontWeight: 'bold', color: color}}, totalContributed)
        ])
      )
    }
    var roundText = currentRound == 0 ? 'This Circle hasn\'t started yet' : 'Currently in round ' + currentRound
    components.push(status.components.view({style: {marginTop: 5, borderTopWidth: 1, borderTopColor: COLORS.BORDER}}, [
      status.components.text({style: {paddingTop: 5}}, roundText),
      status.components.text({style: {paddingTop: 5}}, 'Contributions of ' + web3.fromWei(circle.contributionSize.call({from: web3.eth.accounts[0]})) + ' ETH')
    ]))
    return {markup:
      status.components.view({style: STYLES.COMMAND_PREVIEW}, components)
    }
  },
  handler: function(params, context) {
  }
}

var contributeCommand = {
  name: 'contribute',
  title: 'Contribute',
  description: 'Contribute to a Lending Circle',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  params: [createCircleNameParam()],
  fullscreen: true,
  validator: circleNameValidator,
  preview: function(params, context) {
    var circle = getCircleFromSelection(params.circleName)
    var contributionAmount = circle.contributionSize.call({from: web3.eth.accounts[0]})
    return {markup: status.components.view({style: STYLES.COMMAND_PREVIEW}, [
      status.components.view({style: {flexDirection: 'row', justifyContent: 'space-between'}}, [
        status.components.text({style: {paddingRight: 20}}, params.circleName),
        status.components.text({style: {fontWeight: 'bold', color: COLORS.BALANCE_POSITIVE}}, web3.fromWei(contributionAmount, 'ether') + ' ETH')
      ])
    ])}
  },
  handler: function(params, context) {
    status.sendMessage('Righto, give me a moment...')
    var circle = getCircleFromSelection(params.circleName)
    var contributionAmount = circle.contributionSize.call({from: web3.eth.accounts[0]})
    var tx = circle.contribute({value: contributionAmount, from: web3.eth.accounts[0]})
    status.sendMessage('Your contribution of *' + web3.fromWei(contributionAmount, 'ether') + ' ETH* is on the way!')
    var receipt = waitForMining(tx)
    if (receipt.failed) return status.sendMessage('Ummm... that didn\'t work and we\'re at a loss as to why. Maybe ask an 8 ball?')
    var balance = circle.getParticipantBalance(web3.eth.accounts[0], {from: web3.eth.accounts[0]})
    var ethBalance = web3.fromWei(balance, 'ether')
    if (ethBalance == 0) {
      status.sendMessage('Woohoo! You\'ve contributed enough to *' + params.circleName + '* for the time being.')
    }
    if (ethBalance > 0) {
      status.sendMessage('Nice! Currently you\'re about *' + ethBalance + ' ETH* up! You can withdraw this positive balance at any time by hitting */withdraw* down below.')
    }
    if (ethBalance < 0) {
      status.sendMessage('Getting there! You still have *' + ethBalance + ' ETH* left to contribute to *' + params.circleName + '* before you\'re up to date.')
    }
  }
}

var startCommand = {
  name: 'start',
  title: 'Start',
  color: COLORS.DEFAULT_COMMAND,
  description: 'Start a Lending Circle, nobody else can join after this',
  sequentialParams: true,
  params: [createCircleNameParam()],
  fullscreen: true,
  validator: circleNameValidator,
  preview: function(params, context) {
    var circle = getCircleFromSelection(params.circleName)
    var currentRound = circle.currentRound.call({from: web3.eth.accounts[0]})
    var nextRound = parseInt(currentRound) + 1
    return {markup: status.components.text({style: STYLES.COMMAND_PREVIEW}, 'Round ' + nextRound)}
  },
  handler: function(params, context) {
    status.sendMessage('Ok, I\'ll get right to it...')
    var circle = getCircleFromSelection(params.circleName)
    var currentRound = circle.currentRound.call({from: web3.eth.accounts[0]})
    var nextRound = parseInt(currentRound) + parseInt(1)
    status.sendMessage('Starting *round ' + nextRound + '*, hang on...')
    var tx = circle.startRound({from: web3.eth.accounts[0]})
    status.sendMessage('This bit might take a little while...')
    var receipt = waitForMining(tx)
    if (receipt.failed) return status.sendMessage('Oh no! For some reason that didn\'t work, and we\'re not really sure why... :/')
    currentRound = circle.currentRound.call({from: web3.eth.accounts[0]})
    status.sendMessage('Excellent, we\'re now in round ' + currentRound + '!\n\nHit */stats* to see how things stand right now.')
  }
}

var withdrawCommand = {
  name: 'withdraw',
  title: 'Withdraw',
  description: 'Withdraw from a Lending Circle',
  color: COLORS.DEFAULT_COMMAND,
  sequentialParams: true,
  params: [createCircleNameParam()],
  fullscreen: true,
  validator: circleNameValidator,
  preview: function(params, context) {
    var circle = getCircleFromSelection(params.circleName)
    var balance = circle.getParticipantBalance.call(web3.eth.accounts[0], {from: web3.eth.accounts[0]})
    var ethBalance = web3.fromWei(balance, 'ether')
    var balanceColor = ethBalance >= 0 ? COLORS.BALANCE_POSITIVE : COLORS.BALANCE_NEGATIVE
    return {markup: status.components.view({style: STYLES.COMMAND_PREVIEW}, [
      status.components.view({style: {flexDirection: 'row', justifyContent: 'space-between'}}, [
        status.components.text({style: {paddingRight: 20}}, params.circleName),
        status.components.text({style: {fontWeight: 'bold', color: balanceColor}}, ethBalance + ' ETH')
      ])
    ])}
  },
  handler: function(params, context) {
    status.sendMessage('Hang on, I\'ll just check whether you have anything to withdraw...')
    var circle = getCircleFromSelection(params.circleName)
    var balance = circle.getParticipantBalance.call(web3.eth.accounts[0], {from: web3.eth.accounts[0]})
    var ethBalance = web3.fromWei(balance, 'ether')
    if (ethBalance <= 0) {
      status.sendMessage('You don\'t have anything to withdraw at the moment')
      if (ethBalance < 0) {
        status.sendMessage('In fact, you\'re actually in debt by about *' + Math.abs(ethBalance) + ' ETH*, you should think about contributing sometime :P')
      }
      return
    }
    status.sendMessage('Withdrawing ~*' + ethBalance + ' ETH*...')
    var tx = circle.withdraw({from: web3.eth.accounts[0]})
    status.sendMessage('Pretend that this message is a loading spinner...')
    var receipt = waitForMining(tx)
    if (receipt.failed) return status.sendMessage('Eep, that didn\'t work, maybe you could try again?')
    status.sendMessage('Withdrawal successful! Try not to spend it all at once!')
  }
}

var userNameCommand = {
  name: 'name',
  title: 'SetName',
  color: COLORS.DEFAULT_COMMAND,
  description: 'Set your first name',
  sequentialParams: true,
  params: [{
    name: 'name',
    placeholder: 'Your first name',
    type: status.types.TEXT
  }],
  validator: function(params, context) {
    var error
    // also check that the name has no spaces/special chars in
    if (!/^[a-zA-Z0-9]+$/.test(params.name)) {
      error = status.components.validationMessage(
        'Uh oh',
        'I\'m only able to save English alphanumeric characters, blame my programmers...'
      )
      return {markup: error}
    }
    if (params.name.length > 20) {
      error = status.components.validationMessage(
        'Ooh, could you shorten that a little?',
        'There\'s a limit to how much I can remember, something something goldfish joke'
      )
      return {markup: error}
    }
  },
  preview: function(params, context) {},
  handler: function(params, context) {
    saveToDb('username', params.name)
    status.sendMessage('Nice to meet you ' + params.name + '.')
    status.sendMessage('If this is your first go around, I guess the best thing to do would be to create a Lending Circle.')
    status.sendMessage('Hit */create* to get the party started!')
  }
}

function waitForMining(txHash) {
  var mined = false
  var receipt
  while (!mined) {
    receipt = web3.eth.getTransactionReceipt(txHash)
    if (!receipt) continue
    if (receipt.contractAddress || receipt.gasUsed) mined = true
    if (receipt.gasUsed === receipt.gasLimit) receipt.failed = true
  }
  return receipt
}

function saveNewCircle(newCircle) {
  var circles = getAllCircles()
  if (!Array.isArray(circles)) {
    circles = []
  } else if (circleAlreadySaved(circles, newCircle.address)) {
    circles = deleteCircle(circles, newCircle.address)
  }
  circles.push(newCircle)
  saveAllCircles(circles)
}

function circleAlreadySaved(circles, newCircleAddress) {
  return getCircleIndex(circles, newCircleAddress) !== -1
}

function getCircleIndex(circles, newCircleAddress) {
  for (var i = 0; i < circles.length; i++) {
    if (!circles[i].address) return -1
    if (circles[i].address.toLowerCase() === newCircleAddress.toLowerCase()) return i
  }
  return -1
}

function deleteCircle(circles, circleAddress) {
  if (getCircleIndex(circles, circleAddress) === -1) return
  circles.splice(getCircleIndex(circles, circleAddress), 1)
  return circles
}

function getMyName() {
  var name = getFromDb('username')
  return name || web3.eth.accounts[0]
}

function getPlusOrMinus(balance) {
  var ethBalance = web3.fromWei(balance, 'ether')
  if (ethBalance === 0) return ''
  var sign = ''
  if (ethBalance > 0) sign = '+'
  return sign
}

function getTotalContributed(circle, participantAddress) {
  var paymentAmount = circle.contributionSize.call({from: web3.eth.accounts[0]})
  var balance = circle.getParticipantBalance(participantAddress, {from: web3.eth.accounts[0]})
  var currentRound = circle.currentRound.call({from: web3.eth.accounts[0]})
  var totalContributed = web3.fromWei(balance, 'ether').toNumber() + (web3.fromWei(paymentAmount, 'ether') * currentRound)
  return totalContributed
}

function parseContractForDb(circle, name) {
  var participants = getCircleParticipants(circle)
  var safeCircle = {address: circle.address, name: name, participants: participants}
  return safeCircle
}

function getCircleParticipants(circle) {
  var participantCount = circle.getMemberCount.call({from: web3.eth.accounts[0]})
  var participants = []
  for (var i = 0; i < participantCount; i++) {
    var participantAddress = circle.membersAddresses.call(i, {from: web3.eth.accounts[0]})
    participants.push({address: participantAddress, name: circle.getUserName.call(i, {from: web3.eth.accounts[0]})})
  }
  return participants
}

function getCircleFromDb(contractAddress) {
  var circles = getAllCircles()
  if (!circles) return false
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].address.toLowerCase() === contractAddress.toLowerCase()) return circles[i]
  }
  return false
}

function circleNameValidator(params, context) {
  if (!getCircleFromSelection(params.circleName)) {
    return {markup: status.components.validationMessage(
      'Whoops',
      'It doesn\'t look like you have joined that Circle'
    )}
  }
}

function saveToDb(item, value) {
  localStorage.setItem(addDbPrefix(item), value)
}

function getFromDb(item) {
  return localStorage.getItem(addDbPrefix(item))
}

function addDbPrefix(item) {
  return DB_PREFIX + item
}

function getCircleAddress(name) {
  var circles = getAllCircles()
  for (var i = 0; i < circles.length; i++) {
    if (circles[i].name === name) return circles[i].address
  }
  return null
}

function getCircleFromSelection(name) {
  if (!getCircleAddress(name)) return null
  return LendingCircle.at(getCircleAddress(name))
}

function getAllCircles() {
  return JSON.parse(getFromDb('circles'))
}

function saveAllCircles(circles) {
  saveToDb('circles', JSON.stringify(circles))
}

status.addListener('init', function(params, context) {
  if (getFromDb('username') !== null) return
  status.sendMessage('Oh hello, welcome (back), I see you haven\'t told me your name yet.')
  status.sendMessage('Trusted Lending Circles are supposed to be used with friends, so in order to make chatting with me totally rad, I recommend setting a nickname, otherwise you will look like this: *' + web3.eth.accounts[0] + '*')
  status.sendMessage('Hit the */name* command below to tell me your name.')
})

status.addListener('on-message-send', function() {
  return {'text-message': 'Unfortunately I wasn\'t programmed to have normal conversations. You\'ll have to issue one of the commands below to get me to do anything.'}
})

// lets roll these bad boys out!
status.response(createCommand)
status.response(joinCommand)
status.response(statsCommand)
status.response(startCommand)
status.response(withdrawCommand)
status.response(contributeCommand)
status.response(userNameCommand)
status.response(loadCommand)
status.response(removeCommand)

status.command(createCommand)
status.command(joinCommand)
status.command(statsCommand)
status.command(startCommand)
status.command(withdrawCommand)
status.command(contributeCommand)
status.command(userNameCommand)
status.command(loadCommand)
status.command(removeCommand)
