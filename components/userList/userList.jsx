import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
}
from '@material-ui/core';
import './userList.css';
import { Link } from "react-router-dom";
import axios from 'axios';

/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
    };
  }

  componentDidMount() {
    axios.get(`/user/list`).then((res) => {
      this.setState({
        userList: res.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.loginStatus !== prevProps.loginStatus) {
      axios.get(`/user/list`).then((res) => {
        this.setState({
          userList: res.data,
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  render() {
    return (
      <div>
        <List component="nav">
        {this.state.userList.map(user => (
          <React.Fragment key={user._id}>
              <ListItem>
                <Link to={`/users/${user._id}`}>
                  <ListItemText>
                    {`${user.first_name} ${user.last_name}`}
                  </ListItemText>
                </Link>
              </ListItem>
            <Divider />
          </React.Fragment>
        ))}
        </List>
      </div>
    );
  }
}

export default UserList;
