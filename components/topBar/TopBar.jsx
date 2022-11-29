import React from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import './TopBar.css';
import { Link, HashRouter, Route, Switch } from 'react-router-dom';
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
    this.tellStatus = props.tellStatus;
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

  handleLogout() {
    axios.post("/admin/logout", {}).then(() => {
      this.tellStatus(false, "", "");
    });
  }

  handleUploadButtonClicked = () => {
    if (this.uploadInput.files.length > 0) {
      // Create a DOM form and add the file to it under the name uploadedphoto
      const domForm = new FormData();
      domForm.append('uploadedphoto', this.uploadInput.files[0]);
      axios.post('/photos/new', domForm)
        .then((res) => {
            console.log(res);
            this.props.stateManager.notify("photoupload");
        })
        .catch(err => console.log(`POST ERR: ${err}`));
 }
};

  render() {
    return (
      <HashRouter>
        <AppBar className="cs142-topbar-appBar" position="absolute">
          <Toolbar className="toolbar">
            <Typography variant="h5" color="inherit">
              {this.props.loginStatus ?  "Hi " + this.props.firstName : ""}
            </Typography>
            <Typography variant="h5" color="inherit">
              Version: {this.state.version}
            </Typography>
            <Typography variant="h5" color="inherit">
              {this.props.loginStatus ? (
                <Switch>
                  <Route path="/users/:userId">
                    {`${this.state.user.first_name} ${this.state.user.last_name}`}
                  </Route>
                  <Route path="/photos/:userId">
                    Photos of {`${this.state.user.first_name} ${this.state.user.last_name}`}
                  </Route>
                </Switch>
              ) :
                "Please log in"}
            </Typography>
            {this.props.loginStatus ? (
              <Button variant="contained" onClick={() => this.handleLogout()}>
                Log Out
              </Button>
            ):
              null }
            {
              this.props.loginStatus && (
              <input 
                type="file" 
                accept="image/*" 
                ref={(domFileRef) => {
                   this.uploadInput = domFileRef; 
                }} 
              />
              )
            }
            {this.props.loginStatus ? (
              <Button variant="contained" onClick={() => this.handleUploadButtonClicked()}>
                Add Photo
              </Button>
            ):
              null}
            {this.props.loginStatus ? (
              <Link to="/favorites">
                <Button variant="contained">Favorites</Button>
              </Link>
            ):
              null}
          </Toolbar>
        </AppBar>
      </HashRouter>
    );
  }
}

export default TopBar;
