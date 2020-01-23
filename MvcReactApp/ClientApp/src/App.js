import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/Product/FetchData';
import { Sales } from './components/Sales/Sales';
import { Customer } from './components/Customer/Customer';
import { Store } from './components/Store/Store';


export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={FetchData} />
            <Route path='/fetch-data' component={FetchData} />
            <Route path='/sales' component={Sales} />
            <Route path='/customer' component={Customer} />
            <Route path='/store' component={Store} />    
      </Layout>
    );
  }
}
