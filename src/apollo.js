import {
  ApolloClient,
  createNetworkInterface
} from 'react-apollo'

const networkInterface = createNetworkInterface({
  uri: "https://api.graph.cool/simple/v1/cj85jpkki0swd0163zol7d1fa"
})

networkInterface.use([{
  applyMiddleware(req, next) {
    let token = localStorage.getItem('token')

    req.options.headers = {
      authorization: token ? `Bearer ${token}` : null,
      ...req.options.headers
    }

    next()
  }
}])

const client = new ApolloClient({
  networkInterface,
  dataIdFromObject: o => o.id,
  connectToDevTools: process.env.NODE_ENV === 'development'
})

export default client
