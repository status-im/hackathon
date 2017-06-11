// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      //Increase to the below when running tests on testrpc
      // gas: 99000000,
      gas: 4612388,
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    }
  }
}
