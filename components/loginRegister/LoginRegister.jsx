import React from 'react';
import axios from 'axios';
import './LoginRegister.css';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            failed: false,
            loginName: '',
            password: '',
            registerName: '',
            registerPassword: '',
            registerPassword2: '',
            firstName: '',
            lastName: '',
            location: '',
            description: '',
            occupation: '',
            registrationError: '',
        };
        this.tellStatus = props.tellStatus;
    }

    handleChange(event) { //keep track of whatever text in loginName 
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    handleLogin(event) {
        event.preventDefault();
        axios.post("/admin/login", {
            login_name: this.state.loginName,
            password: this.state.password,
        }).then((response) => {
            this.tellStatus(true, response.data._id, response.data.first_name);
        }).catch((error) => {
            this.setState({
                failed: true,
            });
        });
    }

    handleRegister(event) {
        event.preventDefault();
        axios.post("user", {
            registerName: this.state.registerName,
            registerPassword: this.state.registerPassword,
            registerPassword2: this.state.registerPassword2,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            location: this.state.location,
            description: this.state.description,
            occupation: this.state.occupation,
        }).then((response) => {
            this.setState({
                registrationError: response.data,
                registerName: '',
                registerPassword: '',
                registerPassword2: '',
                firstName: '',
                lastName: '',
                location: '',
                description: '',
                occupation: '',
            });
        }).catch((error) => {
            if (error.response) {
                this.setState({
                    registrationError: error.response.data,
                });
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <h1>
                    Login Here:
                </h1>
                <form className="login-form" onSubmit={e => this.handleLogin(e)}>
                    <label>
                        Login Name: <input type="text" 
                                        value={this.state.loginName} 
                                        onChange={e => this.handleChange(e)}
                                        name="loginName"/>   
                    </label>
                    <label>
                        Password: <input type="password" 
                                        value={this.state.password} 
                                        onChange={e => this.handleChange(e)}
                                        name="password"/>  
                    </label>
                    <input type="submit" value="Submit" />
                    <p>
                        {this.state.failed ? "Failed Login attempt. Try again.": ""}
                    </p>
                </form>
                <h1>
                    Register Here:
                </h1>
                <form className="register-form" onSubmit={e => this.handleRegister(e)}>
                    <label> 
                    Register Name: <input type="text" 
                                        value={this.state.registerName} 
                                        onChange={e => this.handleChange(e)}
                                        name="registerName"/>
                    </label>
                    <label> 
                    Register Password: <input type="password" 
                                        value={this.state.registerPassword} 
                                        onChange={e => this.handleChange(e)}
                                        name="registerPassword"/>
                    </label>
                    <label> 
                    Re-enter your Password: <input type="password" 
                                        value={this.state.registerPassword2} 
                                        onChange={e => this.handleChange(e)}
                                        name="registerPassword2"/>
                    </label>
                    <label> 
                    First Name: <input type="text" 
                                        value={this.state.firstName} 
                                        onChange={e => this.handleChange(e)}
                                        name="firstName"/>
                    </label>
                    <label> 
                    Last Name: <input type="text" 
                                        value={this.state.lastName} 
                                        onChange={e => this.handleChange(e)}
                                        name="lastName"/>
                    </label>
                    <label> 
                    Location: <input type="text" 
                                        value={this.state.location} 
                                        onChange={e => this.handleChange(e)}
                                        name="location"/>
                    </label>
                    <label> 
                    Description: <input type="text" 
                                        value={this.state.description} 
                                        onChange={e => this.handleChange(e)}
                                        name="description"/>
                    </label>
                    <label> 
                    Occupation: <input type="text" 
                                        value={this.state.occupation} 
                                        onChange={e => this.handleChange(e)}
                                        name="occupation"/>
                    </label>
                    <input type="submit" value="Register Me" />
                    <p>
                        {this.state.registrationError}
                    </p>
                </form>
            </React.Fragment>

        )
    }
}

export default LoginRegister;