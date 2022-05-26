import React from 'react';
import {
    TextField, Button
} from '@material-ui/core';
import axios from 'axios';

class LoginRegister extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginName: '',
            failed: false,
        };
        this.tellStatus = props.tellStatus;
    }

    handleChange(event) { //keep track of whatever text in loginName 
        this.setState({loginName: event.target.value});
    }
    handleSubmit(event) {
        event.preventDefault();
        axios.post("/admin/login", {
            login_name: this.state.loginName,
        }).then((response) => {
            console.log(response);
            this.tellStatus(true, response.data._id);
        }).catch((error) => {
            this.setState({
                failed: true,
            });
        });
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
                <p>
                    {this.state.failed ? "Failed Login attempt. Try again.": ""}
                </p>
            </form>
        )
    }
}

export default LoginRegister;