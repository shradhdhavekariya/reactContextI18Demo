import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { map } from 'lodash'
import { getCurrentConfig } from 'src/shared/observables/configForNetwork'
import typeDefs from './type-defs'

const getGraphqlUrl = () => getCurrentConfig().graphqlUrl

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pools: {
            keyArgs: ['id', 'where'],
            merge: (existing, incoming, { args }) => {
              const skip = args?.skip || 0

              if (skip === 0) {
                return incoming
              }

              if (incoming.length) {
                return [...(existing || []), ...(incoming || [])]
              }

              return existing
            },
          },
          swaps: {
            keyArgs: ['id', 'where'],
            merge: (existing = [], incoming = [], options) => {
              // skipping swaps request for metrics
              if (options.args?.first === 1) return incoming

              const skip = options.args?.skip || 0

              if (skip === 0) return incoming

              const existingRefs = map(existing, '__ref')

              if (incoming.length)
                return existing.concat(
                  incoming.filter(
                    (row: { __ref: string }) =>
                      // eslint-disable-next-line no-underscore-dangle
                      !existingRefs.includes(row.__ref),
                  ),
                )

              return existing
            },
          },
          poolShares: {
            keyArgs: ['id'],
            merge: (existing = [], incoming = [], options) => {
              const skip = options.args?.skip || 0

              if (skip === 0) return incoming

              if (incoming.length) return [...existing, ...incoming]

              return existing
            },
          },
        },
      },
    },
  }),
  link: new HttpLink({
    uri: getGraphqlUrl,
  }),
  typeDefs,
})

export default client
