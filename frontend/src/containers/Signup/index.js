import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { signup } from './actions';
import { error } from 'util';
import PropTypes from 'prop-types';

class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            repassword: '',
            firstName: '',
            lastName: '',
            gender: 'khac',
            dob: '',
            email: '',
            telephone: '',
            address: '',
            error: '',
            showError: 'hide',
        }
    }
    static contextTypes = {
        router: PropTypes.object
    }

    componentDidMount() {
        window.scrollTo(0, 0);
    }
    closeError = () => {
        this.setState({ showError: 'hide' });
    }

    change = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    submit = () => {
        let errorObj = null;
        let re = /^\w+$/;
        if(this.state.username === '') {
            errorObj = { error: 'Username cannot blank', password: '' };
        } 
        else if (!re.test(this.state.username)) {
            errorObj = { error: 'Username must contain only letters, numbers and underscores!' };
        }
        else if (this.state.email === '') {
            errorObj = { error: 'Vui lòng nhập email!' };
        }
        else if (this.state.firstName === '' || this.state.lastName === '') {
            errorObj = { error: 'Vui lòng nhập đầy đủ họ và tên' };
        }
        else if(this.state.password === '') {
            errorObj = { error: 'Password cannot blank' };
        }
        else if (this.state.password !== this.state.repassword) {
            errorObj = { error: 'Please check that you\'ve entered and confirmed your password!' };
        }
        else if(this.state.password === this.state.repassword) {
            if(this.state.password.length < 4) {
              errorObj = { error: 'Password must contain at least six characters!', password: '' };
            }
            if(this.state.password === this.state.username) {
              errorObj = { error: 'Password must be different from Username!' };
            }
            re = /[0-9]/;
            if(!re.test(this.state.password)) {
              errorObj = { error: 'password must contain at least one number (0-9)!' };
            }
            re = /[a-z]/;
            if(!re.test(this.state.password)) {
              errorObj = { error: 'password must contain at least one lowercase letter (a-z)!' };
            }
        }
        if (!errorObj) {
            this.setState({ showError: 'hide' });
            this.props.signup(this.state);
        } else {
            this.setState({...errorObj,  showError: 'show' });
        }

    };

    render() {
        if (this.props.account) {
            return (<div>{this.context.router.history.push("/")}</div>);
        } else {
            return (
                <div className="span9">
                    <ul className="breadcrumb">
                        <li><Link to="/home">Trang chủ</Link> <span className="divider">/</span></li>
                        <li className="active">Đăng ký tài khoản </li>
                    </ul>
                    <h3> Đăng ký tài khoản </h3>
                    <div className="well">
    
                        <form className="form-horizontal" >
                            <h4> Thông tin tài khoản </h4>
                            <div className="control-group">
                                <label className="control-label" htmlFor="input_username">Tên đăng nhập <sup>*</sup></label>
                                <div className="controls">
                                    <input type="text" id="input_username" autoComplete="false" name="username" onChange={this.change} value={this.state.username} placeholder="Username" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="inputPassword1">Mật khẩu <sup>*</sup></label>
                                <div className="controls">
                                    <input type="password" id="inputPassword1" name="password" onChange={this.change} value={this.state.password} placeholder="Password" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="inputPassword2">Nhập lại mật khẩu <sup>*</sup></label>
                                <div className="controls">
                                    <input type="password" id="inputPassword2" name="repassword" onChange={this.change} value={this.state.repassword} placeholder="Retype Password" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="email">Email <sup>*</sup></label>
                                <div className="controls">
                                    <input type="text" id="email" autoComplete="false" name="email" onChange={this.change} value={this.state.email} placeholder="Email" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="firstName">Tên<sup>*</sup></label>
                                <div className="controls">
                                    <input type="text" id="firstName" name="firstName" onChange={this.change} value={this.state.firstName} placeholder="Ho" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="lastName">Họ <sup>*</sup></label>
                                <div className="controls">
                                    <input type="text" id="lastName" name="lastName" onChange={this.change} value={this.state.lastName} placeholder="Ten" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="gender">Giới tính</label>
                                <div className="controls">
                                    <input type="radio" id="nam" name="gender" checked={this.state.gender === "nam"} onChange={this.change} value="nam" /><label htmlFor="nam" style={{ display: 'inline' }}>Nam</label>
                                    <input type="radio" id="nu" name="gender" checked={this.state.gender === "nu"} onChange={this.change} value="nu" /><label htmlFor="nu" style={{ display: 'inline' }}>Nữ</label>
                                    <input type="radio" id="khac" name="gender" checked={this.state.gender === "khac"} onChange={this.change} value="khac" /><label htmlFor="khac" style={{ display: 'inline' }}>Khác</label>
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="telephone">Số điện thoại</label>
                                <div className="controls">
                                    <input type="text" id="telephone" name="telephone" onChange={this.change} value={this.state.telephone} placeholder="+84" />
                                </div>
                            </div>
    
                            <div className="control-group">
                                <label className="control-label" htmlFor="address">Địa chỉ</label>
                                <div className="controls">
                                    <input type="text" id="address" name="address" onChange={this.change} value={this.state.address} placeholder="Dia chi" />
                                </div>
                            </div>
                            <div className={ "alert alert-block alert-error fade in " + (this.state.showError=="show"?"show":(this.props.signup_failed?"show":"hide"))}>
                                <button type="button" className="close" onClick={this.closeError} data-dismiss="alert">×</button>
                                <strong>{this.props.signup_failed?this.props.signup_failed:this.state.error}</strong>
                            </div>
    
                            <p><sup>*</sup>Bắt buộc	</p>
                        </form>
                        <div className="control-group">
                            <div className="controls">
                                <button className="btn btn-large btn-success" onClick={this.submit}>Đăng ký</button>
                            </div>
                        </div>
                    </div>
    
                </div>
            );
        }
        
        
    }
}

const mapStateToProps = (state) => ({
    signup_failed: state.appReducer.signup_failed,
    account: state.appReducer.account
});

const mapDispatchToProps = ({
    signup,
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);