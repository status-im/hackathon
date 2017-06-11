const INIT_STATE = {
  error: null,
  address: null,
  ether: null,
  balances: {},
  allowances: {},
  approving: null,
  available: [
    {
      address: '0x64888583e676368390d6eb573bc2ac3bce9002b3',
      cover: 'https://pbs.twimg.com/profile_banners/3448833448/1441828197/1500x500',
      name: 'Gnosis',
      ticker: 'GNO'
    },
    {
      address: '0xe40feb39fcb941a633dec965abc9921b3fe962b2',
      cover: 'https://pbs.twimg.com/profile_banners/4053977488/1477292856/1500x500',
      name: 'Golem',
      ticker: 'GNT'
    },
    {
      address: '0xF9A3a3d45185981D918d3FaD91af3e161E47352E',
      cover: 'https://pbs.twimg.com/profile_banners/2895317462/1424807904/1500x500',
      name: 'Augur',
      ticker: 'REP'
    },
    {
      address: '0xdb6d5d3d074bfcb03ca5b7ffb9efac9192b99be6',
      cover: 'https://pbs.twimg.com/profile_banners/725253338640617472/1482443881/1500x500',
      name: 'Iconomi',
      ticker: 'ICN'
    },
    {
      address: '0x1b789619d23cb67755d61691e8a9ddbd60b7bf8f',
      cover: 'https://pbs.twimg.com/profile_banners/763039521936203776/1493283159/1500x500',
      name: 'Melonport',
      ticker: 'MLN'
    }
  ]
}

export default function orders(state = INIT_STATE, action) {
  switch (action.type) {
    case 'INITIALIZE_ERROR':
      return {
        ...state,
        error: action.message
      }
    case 'GOT_ADDRESS':
      return {
        ...state,
        address: action.address
      }
    case 'GOT_ETHER_BALANCE':
      return {
        ...state,
        ether: action.balance
      }
    case 'GOT_BALANCE':
      return {
        ...state,
        balances: {
          ...state.balances,
          [action.token]: action.balance
        }
      }
    case 'GOT_ALLOWANCE':
      return {
        ...state,
        allowances: {
          ...state.allowances,
          [action.token]: action.allowance
        }
      }
    case 'START_APPROVE':
      return {
        ...state,
        approving: {
          ...action.token,
          balance: action.balance
        }
      }
    case 'APPROVE_FAILED':
      return {
        ...state,
        error: action.message
      }
    case 'APPROVE_PENDING':
      return {
        ...state,
        approving: null
      }
    case 'CLOSE_APPROVE':
      return {
        ...state,
        approving: null
      }
    default:
      return state
  }
}
