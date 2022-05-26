import React from 'react';
import {
    TextField, Button
} from '@material-ui/core';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {loginName: ""};
    }

    handleChange(event) { //keep track of whatever text in loginName 
        this.setState({loginName: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        axios.post("/admin/login", {
            login_name: this.state.loginName,
        }).then(function(response) {
            console.log(response);    
        })
    }

    render() {
        return (
            <form onSubmit={e => this.handleSubmit(e)}>
                <label>
                    Login Name: <input type = "text" 
                                       value={this.state.loginName} 
                                       onChange={e => this.handleChange(e)}/>   
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

export default LoginRegister;