import React from 'react';
import {
  AppBar, Toolbar, Typography, 
} from '@material-ui/core';
import './TopBar.css';
import { HashRouter, Route, Switch } from 'react-router-dom';
import axios from 'axios';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      version: 0,
    };
  }
  componentDidMount() {
    if (this.props.userId !== undefined){
      axios.get(`/user/${this.props.userId}`).then((res) => {
        this.setState({
          user: res.data,
        });
      }).catch((error) => {
        console.log(error);
      });
    }
    axios.get('/test/info').then((res) => {
      this.setState({
        version: res.data.__v,
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId && this.props.userId !== undefined) {
      axios.get(`/user/${this.props.userId}`).then((res) => {
        this.setState({
          user: res.data,
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }
  render() {
    return (
      <HashRouter>
        <AppBar className="cs142-topbar-appBar" position="absolute">
          <Toolbar className="toolbar">
            <Typography variant="h5" color="inherit">
              Yubin Jee
            </Typography>
            <Typography variant="h5" color="inherit">
              Version: {this.state.version}
            </Typography>
            <Typography variant="h5" color="inherit">
              <Switch>
                <Route path="/users/:userId">
                  {`${this.state.user.first_name} ${this.state.user.last_name}`}
                </Route>
                <Route path="/photos/:userId">
                  Photos of {`${this.state.user.first_name} ${this.state.user.last_name}`}
                </Route>
              </Switch>
            </Typography>
          </Toolbar>
        </AppBar>
      </HashRouter>
    );
  }
}

export default TopBar;
