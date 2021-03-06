import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder, removeOrder } from './actions';
// import { getCookie, setCookie } from '../../globalFunc';
import {updateCart} from '../Cart/actions';
import { access } from 'fs';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
            accountId: '',
            cart: [],
            cartTotal: 0,
            cartQuantity: 0,
            username: '',
            password: '',
            address: '',
            fullName:'',
            telephone: '',
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        let cartArr = [];
        const cartString = localStorage.getItem('cart');
        cartArr = (cartString === '' || cartString == "undefined") ? [] : JSON.parse(cartString);
        // console.log('CART Array =', cartArr);
        let cartTotal = localStorage.getItem('cartTotal');
        cartTotal = (!cartTotal || cartTotal == 'undefined')? 0: parseFloat(cartTotal);
        let cartQuantity = localStorage.getItem('cartQuantity');
        cartQuantity = (!cartQuantity || cartQuantity == 'undefined')?0: parseInt(localStorage.getItem('cartQuantity'), 10);
        this.setState({ cart: cartArr });
        this.setState({ cartTotal: cartTotal });
        this.setState({ cartQuantity: cartQuantity });

        const accountString = localStorage.getItem('account');
        if (accountString && accountString != "undefined") {
            let account = JSON.parse(accountString);
            console.log("AAcount: ", account);
            // console.log('---Account parse = ---', account);
            const fullName = account.firstName + ' ' +account.lastName;
            let nextState = {
                fullName: fullName?fullName:this.state.fullName,
                telephone: account.telephone?account.telephone: this.state.telephone,
                address: account.address?account.address: this.state.address,
                accountId: account.accountId
            }
            this.setState(nextState);
        } else if (this.props.account) {
            let fullName = this.props.account.firstName + this.props.account.lastName;
            let nextState = {
                fullName: fullName?fullName:this.state.fullName,
                telephone: this.props.account.telephone?this.props.account.telephone: this.state.telephone,
                address: this.props.account.address?this.props.account.address:this.state.address,
                accountId: this.props.account.accountId
            }
            this.setState({nextState});
        }
        
        // console.log('---TuyenTN---', (this.state.cart));
    }
    componentWillUnmount(){
        if (this.props.resCreateOrder) {
            this.remove();
        }
    }
    componentWillReceiveProps(nextProps) {
        console.log("props: ", nextProps);
        if (nextProps.account) {
            const fullName = nextProps.account.firstName + ' ' +nextProps.account.lastName;
            let nextState = {
                fullName: fullName?fullName:this.state.fullName,
                telephone: nextProps.account.telephone?nextProps.account.telephone: this.state.telephone,
                address: nextProps.account.address?nextProps.account.address: this.state.address,
                accountId: nextProps.account.accountId
            }
            this.setState(...this.state, nextState);
        }
        if (nextProps.order_failed) {
            this.setState({error: "Không thể khởi tạo đơn hàng, kiểm tra lại thông tin!"});
        }
    }
    change = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    createOrder = () => {
        if (!this.state.address || !this.state.telephone || !this.state.fullName) {
            this.setState({...this.state, error: "Hãy nhập đầy đủ thông tin!"});
            return;
        }
        const arrProducts = [];
        this.state.cart.map((product, indx) => {
            const obj = {
                productId: product.productId,
                orderQuantity: product.quantity,
            }
            arrProducts.push(obj);
        })
        const order = {
            address: this.state.address,
            telephone: this.state.telephone,
            Products: arrProducts,
            total: this.state.cartTotal,
        };
        if (this.state.accountId){
            order.accountId = this.state.accountId;
        }
        this.props.createOrder(order);
        
    }
    remove = () => {
        localStorage.setItem("cart", "");
        localStorage.setItem("cartTotal", "");
        localStorage.setItem("cartQuantity", "");
        this.props.removeOrder();
        this.props.updateCart(0, 0); 
    }

    render() {
        return (
            <div className="span9">
                <ul className="breadcrumb">
                    <li><Link to="/home">Trang chủ</Link> <span className="divider">/</span></li>
                    <li className="active">ĐƠN HÀNG</li>
                </ul>
                <h3>   XÁC NHẬN ĐƠN HÀNG
                <Link className="btn btn-large pull-right" to="/home"><i className="icon-arrow-left"></i> Mua Thêm </Link></h3>
                {(this.props.resCreateOrder) ? (
                    <div className="well">
                        <div className="alert alert-success">
                            <strong>Đã đặt đơn hàng tới:</strong> {this.props.resCreateOrder.data.order.address}
                        </div>
                        <div className="alert alert-success">
                            <strong>Số điện thoại:</strong> {this.props.resCreateOrder.data.order.telephone}
                        </div>
                        <div className="alert alert-success">
                            <strong>Trạng thái:</strong> {this.props.resCreateOrder.data.order.state}
                        </div>
                        {window.scrollTo(0, 0)}
                    </div>) :
                (
                <div>
                <hr className="soft" />
                
                <table className="table table-bordered">
                    <tbody>
                        <tr><th> Thông tin đơn hàng <span style={{color: "red"}}>{this.state.error?"* " + this.state.error: ""}</span></th></tr>
                        <tr>
                            <td>
                                <form className="form-horizontal">
                                    <div className="control-group">
                                        <label className="control-label" htmlFor="cusotmer">Khách hàng:</label>
                                        <div className="controls">
                                            <input type="text" id="cusotmer" value={this.state.fullName} name="fullName" onChange={this.change} placeholder="Tên người nhận" />
                                        </div>
                                    </div>
                                    <div className="control-group">
                                        <label className="control-label" htmlFor="inputAddress">Địa chỉ</label>
                                        <div className="controls">
                                            <input type="text" id="inputAddress" value={this.state.address} name="address" onChange={this.change} placeholder="Số nhà, phường, thành phố,..." />
                                        </div>
                                    </div>
                                    <div className="control-group">
                                        <label className="control-label" htmlFor="telephone">Số điện thoại:</label>
                                        <div className="controls">
                                            <input type="text" id="telephone" value={this.state.telephone} name="telephone" onChange={this.change} placeholder="" />
                                        </div>
                                    </div>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th> STT </th>
                            <th> Tên sản phẩm </th>
                            <th> Hình ảnh </th>
                            <th> Số lượng </th>
                            <th> Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.cart.map((item, index) => (
                            <tr key={item.productId}>
                                <td>{index}</td>
                                <td>{item.productName} </td>
                                <td> <img width="60" src={item.image} alt="" /></td>
                                <td> {item.quantity}</td>
                                <td>{Number((item.price * item.quantity).toFixed(2)).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td>
                            </tr>
                        ))}
                        <tr>
                            <td> </td>
                            <td></td>
                            <td></td>
                            <td>Tổng</td>
                            <td>{this.state.cartTotal.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")}</td>
                        </tr>
                    </tbody>
                </table>

                <hr className="soft" />
                <div>
                    <Link className="btn btn-large" to="/product_summary"><i className="icon-arrow-left"></i> Sửa giỏ hàng </Link>
                    <button type="button" onClick={this.createOrder} className="btn btn-large pull-right"> Đồng ý <i className="icon-arrow-right"></i></button>
                </div>
                </div>
                )}
                
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    account: state.appReducer.account,
    resCreateOrder: state.appReducer.resCreateOrder,
    order_failed: state.appReducer.order_failed
});

const mapDispatchToProps = ({
    createOrder,
    removeOrder,
    updateCart
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);