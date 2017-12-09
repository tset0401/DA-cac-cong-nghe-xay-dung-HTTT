import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrder } from './actions';
import { getCookie, setCookie } from '../../globalFunc';

class Order extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
        let cartArr = [];
        const cartString = getCookie('cart');
        cartArr = (cartString === '') ? [] : JSON.parse(cartString);
        // console.log('CART Array =', cartArr);
        let cartTotal = parseFloat(getCookie('cartTotal'));
        let cartQuantity = parseInt(getCookie('cartQuantity'), 10);
        this.setState({ cart: cartArr });
        this.setState({ cartTotal: cartTotal });
        this.setState({ cartQuantity: cartQuantity });

        const accountString = getCookie('account');
        let account = (accountString === '')? '' : JSON.parse(accountString);
        // console.log('---Account parse = ---', account);
        const fullName = account.firstName + ' ' +account.lastName;

        this.setState({ fullName: fullName});
        this.setState({ telephone: account.telephone});
        this.setState({ address: account.address});
        // console.log('---TuyenTN---', (this.state.cart));
    }

    change = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }
    createOrder = () => {
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
            Products: arrProducts,
            total: this.state.cartTotal,
        };
        this.props.createOrder(order);
    }
    remove = () => {

    }
    componentWillMount() {
        this.setState({ fullName:  this.props.account.firstName + this.props.account.lastName});
        this.setState({ telephone: this.props.account.telephone});
        this.setState({ address: this.props.account.address});
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
                {(this.props.resCreateOrder !== '' && this.cartArr.length > 0) ? (<h5>Đã đặt đơn hàng tới {this.props.resCreateOrder.data.order.address}
                    <br/> Trạng thái {this.props.resCreateOrder.data.order.state}</h5>) : null}
                <hr className="soft" />

                <table className="table table-bordered">
                    <tbody>
                        <tr><th> Thông tin đơn hàng </th></tr>
                        <tr>
                            <td>
                                <form className="form-horizontal">
                                    {(this.props.account.userName) ? (
                                        <div className="control-group">
                                            <label className="control-label" htmlFor="inputUsername">Khách hàng:</label>
                                            <div className="controls">
                                                <input type="text" id="inputUsername" value={this.state.fullName} name="fullName" onChange={this.change} placeholder="Tên người nhận" />
                                            </div>
                                        </div>
                                    ) : null}
                                    <div className="control-group">
                                        <label className="control-label" htmlFor="inputAddress">Địa chỉ</label>
                                        <div className="controls">
                                            <input type="text" id="inputAddress" value={this.state.address} name="address" onChange={this.change} placeholder="Số nhà, phường, thành phố,..." />
                                        </div>
                                    </div>
                                    {(this.props.account.userName) ? (
                                        <div className="control-group">
                                            <label className="control-label" htmlFor="telephone">Số điện thoại:</label>
                                            <div className="controls">
                                                <input type="text" id="telephone" value={this.state.telephone} name="telephone" onChange={this.change} placeholder="" />
                                            </div>
                                        </div>
                                    ) : null}
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
        );
    }
}

const mapStateToProps = (state) => ({
    account: state.appReducer.account,
    resCreateOrder: state.appReducer.resCreateOrder,
});

const mapDispatchToProps = ({
    createOrder,
});

export default connect(mapStateToProps, mapDispatchToProps)(Order);