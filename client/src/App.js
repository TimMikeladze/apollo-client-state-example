import './App.css';

import {
  AppBar,
  Button,
  Checkbox,
  CssBaseline,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  ListSubheader,
  Toolbar,
  Typography,
  withStyles,
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import React from 'react';
import { ApolloProvider, compose, graphql } from 'react-apollo';
import { BrowserRouter, Route, withRouter } from 'react-router-dom';

const typeDefs = gql`

type ListState {
  selectedItems: [Item]
}
`

const defaults = {
  listState: {
    __typename: 'ListState',
    selectedItems: []
  }
}

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  clientState: {
    typeDefs,
    defaults,
  }
});

const ListPage = compose(
  withRouter,
  withStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: theme.breakpoints.width('md'),
      margin: theme.spacing.unit * 2,
      backgroundColor: theme.palette.background.paper,
    },
    flex: {
      flex: 1,
    },
    flexGrow: {
      flexGrow: 1,
    }
  })),
  graphql(gql`
  query ListPage(
    $id: ID!
  ) {
    listState @client {
      selectedItems {
        id
      }
    }

    list(
      id: $id
    ) {
      id
      title
      items {
        id
        title
      }
    }
  }
  `, {
      options: props => ({
        variables: {
          id: props.match.params.id,
        }
      })
    })
)(
  ({
    classes,
    data,
  }) =>
    !data.loading && data.list &&
    <div className={classes.root}>
      <AppBar position='relative'>
        <Toolbar>
          <div className={classes.flex}>
            <Typography color="inherit" variant="h6">
              0 selected
            </Typography>
          </div>
          <Button color="inherit">
            <DeleteIcon />
            Delete
        </Button>
        </Toolbar>
      </AppBar>
      <List
        subheader={<ListSubheader>{data.list.title}</ListSubheader>}
      >
        {data.list.items && data.list.items.map(item => (
          <ListItem key={item.id}>
            <ListItemText primary={item.title} />
            <ListItemSecondaryAction>
              <Checkbox
              />
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </div>
)

const App = () => (
  <>
    <CssBaseline />
    <ApolloProvider client={client}>
      <BrowserRouter>
        <>
          <Route path="/list/:id" component={ListPage} />
        </>
      </BrowserRouter>
    </ApolloProvider>
  </>
);


export default App;
