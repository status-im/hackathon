class Actions {
  static refreshBalances(balances) {
    return {
      type: 'REFRESH_BALANCES',
      balances
    }
  }

  static refreshOrders() {
    return {
      type: 'REFRESH_ORDERS'
    }
  }

  static submitMaker(order) {
    return {
      type: 'SUBMIT_MAKER',
      order
    }
  }

  static submitTaker(order) {
    return {
      type: 'SUBMIT_TAKER',
      order
    }
  }
}

export default Actions
