import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Main from './components/Main'
import registerServiceWorker from './registerServiceWorker'
import './index.css'

render(
  <Main />,
  document.getElementById('root')
)

registerServiceWorker();
