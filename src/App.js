// @flow

import React from 'react'
import SimpleTable from 'react-simple-table'
import { graphql, gql } from 'react-apollo'

const initQuery = gql`
  query ($pageSize: Int!) {
    allDatas (first: $pageSize) {
      id
      address
      firstName
      lastName
    }
  }
`;

const paginationQuery = gql`
  query ($pageSize: Int!, $cursor: String!) {
    allDatas (first: $pageSize, after: $cursor) {
      id
      address
      firstName
      lastName
    }
  }
`;

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      lastCursor: ''
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentDidUpdate() {

    var data = this.props.data.allDatas;

    if(!this.props.data.loading && this.state.lastCursor !== data[data.length - 1].id) {
      this.setState({
        lastCursor: data[data.length - 1].id
      })
    }

  }

  onScroll = () => {
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight)) {
      this.props.data.fetchMore({
        query: paginationQuery,
        variables: {
          pageSize: 10,
          cursor: this.state.lastCursor
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if(!this.props.data.loading) {
            return {
              allDatas: previousResult.allDatas.concat(fetchMoreResult.allDatas)
            }
          }
        },
      })
    }
  }

  render() {
    var allDatas = this.props.data.allDatas;

    if (this.props.data.loading) {
      return (<div>Loading ...</div>)
    } else {
      return (
         <div>
           <SimpleTable columns={['id', 'address', 'firstName', 'lastName']} data={allDatas}></SimpleTable>
         </div>
       )
    }
  }
}

App = graphql(initQuery, {
    options: (props) => ({
      variables: {
        pageSize: 10
      },
    })
  })(App)

export default App
