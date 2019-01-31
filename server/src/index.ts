import { ApolloServer, gql } from 'apollo-server';

(async () => {

  const typeDefs = gql`
    type Item {
      id: ID!
      title: String!
      list: List!
    }

    type List {
      id: ID!
      title: String!
      items: [Item]
    }

    type Query {
      list(
        id: ID!
      ): List
      item: [Item]
    }
`

  const resolvers = {
    Query: {

    }
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    mocks: true,
  })

  try {
    await server.listen();
  } catch (err) {
    console.log(err)
  }

})()