import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from '../Header';
import Sidebar from '../Sidebar';
import Footer from '../Footer';
import HomePage from '../HomePage';
import Contact from '../Contact';
import Signup from '../Signup';
import NotFound from '../NotFound';
import ProductDetail from '../ProductDetail';
import Cart from '../Cart';
import Category from '../Category';
import Supplier from '../Supplier';
import Order from '../Order';
import CustomerOrder from '../CustomerOrder';
import Profile from '../Profile';
import PropTypes from 'prop-types';

// import Demo from '../Demo';

import '../..//App.css';

// import { getCookie, setCookie } from '../../globalFunc';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {

    }
  }
  componentDidMount() {
    if (localStorage.getItem('cart') === '' || localStorage.getItem('cart') === 'undefined') localStorage.setItem('cart', '');
    if (localStorage.getItem('cartQuantity') === '' || localStorage.getItem('cartQuantity') === 'undefined') localStorage.setItem('cartQuantity', '0');
    if (localStorage.getItem('cartTotal') === '' || localStorage.getItem('cartTotal') === 'undefined') localStorage.setItem('cartTotal', '0.0');
  }
  static contextTypes = {
    router: PropTypes.object
  }
  render() {
    return (
      <div className="App">
        <Header/>
        <div id="mainBody">
        <div className="container">
        <div className="row">
        <Sidebar/>
        <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/home" component={HomePage} />
            <Route path="/contact" component={Contact} />
            <Route path="/signup" component={Signup} />
            <Route path="/order" component={Order} />
            <Route path="/product_summary" component={Cart} />
            <Route path="/product/:id" component={ProductDetail} />
            <Route path="/category/:id" component={Category} />
            <Route path="/supplier/:id" component={Supplier} />
            <Route path="/customer/orders" component={() => {
              if(localStorage.getItem('account')) {
                return (<CustomerOrder/>)
              } else {
                return (<div>{this.context.router.history.push('/')}</div>)
              }
            }} />
            <Route path="/customer/profile" component={() => {
              if(localStorage.getItem('account')) {
                return (<Profile/>)
              } else {
                return (<div>{this.context.router.history.push('/')}</div>)
              }
            }} />

            {/* <Route path="" component={NotFound} /> */}
            {/* <Redirect to="/" /> */}
        </Switch>
        </div>
        </div>
        </div>
        <Footer/>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location !== this.props.location) {
      this.setState({ prevPath: this.props.location })
    }
    console.log('Index App -> this.state.prevPath', this.state.prevPath);
  }
}

export default App;
