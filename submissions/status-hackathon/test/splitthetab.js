var SplitTheTab = artifacts.require("SplitTheTab");
var Tab = artifacts.require("Tab");

contract('SplitTheTab', function(accounts) {
  it("should create a new tab", function() {
    let actual_name = 'Test Tab'
    let shortid = 'abcde'
    var stt

    console.log(SplitTheTab.address)
    return SplitTheTab.deployed().then(function(instance) {
      stt = instance
      return stt.createTab(actual_name, "22", 2, shortid, "SPLIT_EVENLY")
    }).then(function(result) {
      return stt.findTab(shortid)
    }).then(function(address) {
      return Tab.at(address).getState()
    }).then(function(tab) {
      let [test_name, test_total, test_npeople, test_payment_option, test_nfriends, selected, finalized] = tab

      assert.equal(test_name, actual_name)
    })
  })
  it("should add a friend to the tab", function() {
    let actual_name = 'Bob Villa'
    let shortid = 'cdefg'
    var stt, tab
    
    return SplitTheTab.deployed().then(function(instance) {
      stt = instance
      return stt.createTab("Test Tab", "22", 2, shortid, "SPLIT_EVENLY")
    }).then(function() {
      return stt.findTab(shortid)
    }).then(function(address) {
      tab = Tab.at(address)
    }).then(function() {
      return tab.addFriend(actual_name, false, '0x0')
    }).then(function() {
      return tab.getState()
    }).then(function(tab) {
      let [test_name, test_total, test_npeople, test_payment_option, test_nfriends] = tab

      assert.equal(test_nfriends.toString(), '1')
    }).then(function() {
      return tab.getFriend(0)
    }).then(function(friend) {
      let [test_name, test_sender, test_addr] = friend

      assert.equal(test_name, actual_name)
      assert.equal(test_sender, false)
    })
  })

})
