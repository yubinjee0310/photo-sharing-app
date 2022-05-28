import React from 'react';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            failed: false,
            loginName: '',
            password: '',
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
    render() {
        return (
            <div>
                <form onSubmit={e => this.handleLogin(e)}>
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
                <form onSubmit={e => this.handleRegister(e)}>
                    <label> 

                    </label>
                </form>
            </div>

        )
    }
}

export default LoginRegister;