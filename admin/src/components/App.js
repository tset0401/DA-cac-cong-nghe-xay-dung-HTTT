import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Footer from "./Footer";
import ControlSidebar from "./ControlSidebar";
import { Route, Switch } from 'react-router-dom';
import AccountManager from './Account/AccountManager';
import ProductManager from './Product/ProductManager';

class Wrapper extends React.Component {
  render() {
    return (
      <div className="wrapper">
        <Header />
        {}
        <Sidebar />
        {}
        <Switch>
          <Route path='/account-manager' component={AccountManager}/>
          <Route path='/product-manager' component={ProductManager}/>
          <Route path='' component={Dashboard}/>
        </Switch>
        {}
        <Footer />
        {}
        <ControlSidebar />
      </div>
    );
  }
}

export default Wrapper;