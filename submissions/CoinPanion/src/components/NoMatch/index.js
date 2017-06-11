import React, { Component } from 'react'
import styled from 'styled-components'

const Main = styled.div`
  display: flex;
  flexWrap: wrap;
  justify-content: space-around;
`

class NoMatch extends Component {
  render() {
    return (
      <Main>
        <h1>404 Nothing found</h1>
      </Main>
    )
  }
}

export default NoMatch
