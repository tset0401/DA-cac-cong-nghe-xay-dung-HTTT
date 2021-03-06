import React, { Component } from 'react';
import { connect } from 'react-redux';
// import { Carousel } from 'react-responsive-carousel';
import { addToCart } from './../Cart/actions';
// import SliderTemp from '../../components/SliderTemp';
import { Link } from 'react-router-dom';
import defaultImage from '../../img/laptop-default.jpg';
import AlertContainer from 'react-alert'

class Result extends Component {
    constructor (props) {
        super(props);
        this.state = {
            attr: ""
        };
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }
    componentWillReceiveProps(nextProps) {
        console.log("Result recieve props: ", nextProps);
        this.setState({...this.props, nextProps});
    } 

    addCart = (product) => {
        let quantity = product.quantity;
        if (quantity == 0) {
            this.msg.show("Đã hết hàng, vui lòng chọn mặt hàng khác!", {
                time: 1000,
                type: 'info'
            });
        } else {
            const lightProduct = {
                productId: product.productId,
                productName: product.productName,
                image: product.image,
                price: product.price,
                quantity: 1,
            }
            product.quantity -= 1;
            this.props.addToCart(lightProduct);
            this.msg.show("Đã thêm sản phẩm vào giỏ hàng!", {
                time: 1000,
                type: 'success'
            });
        }
    }
    
    render() {
        //Ket qua search
        console.info("Result rendered");
        return (
            <div className="span9">
                <h4>Kết quả tìm kiếm</h4>
                <AlertContainer ref={a => this.msg = a} {...{offset: 14, position: 'bottom left', theme: 'dark', time: 5000, transition: 'scale'}} />
                {(this.props[this.state.attr]) ?
                (<ul className="thumbnails">
                    { this.props[this.state.attr].map((item, index) => {
                        return (
                        <li className="span3" key={index}>
                            <div className="thumbnail">
                                <Link to={`/product/${item.productId}`}>
                                <img src={(item.image === "/img/default.png")? defaultImage : item.image} alt="" />
                                </Link>
                                <div className="caption">
                                    <h5>{item.productName}</h5>
                                    <p className="pull-right">
                                        <i>Số lượng: {item.quantity}</i>
                                    </p>
                                    <h4>
                                        <Link className="btn" to={`/product/${item.productId}`}> <i className="icon-zoom-in"></i>
                                        </Link>
                                        <a className="btn" onClick={() => this.addCart(item)}>Mua <i className="icon-shopping-cart"></i></a>
                                        <span className="pull-right">{item.price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,")} &#8363;</span>                                        
                                        </h4>
                                </div>
                            </div>
                        </li>
                        )
                    })}
                </ul>):(
                    <div className="not-found">Không tìm thấy</div>
                )}
            </div>
        );
    }
}


const mapStateToProps = (state) => ({
    resProByCategory: state.appReducer.resProByCategory,
    resProBySupplier: state.appReducer.resProByCategory,
    resSearch: state.appReducer.resSearch,
});

const mapDispatchToProps = ({
    addToCart
});

export default connect(mapStateToProps, mapDispatchToProps)(Result);
