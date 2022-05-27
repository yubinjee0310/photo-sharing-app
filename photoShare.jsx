import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Redirect, Route, Switch,
} from 'react-router-dom';
import {
  Grid, Typography, Paper
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import LoginRegister from './components/loginRegister/LoginRegister';
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/userDetail';
import UserList from './components/userList/userList';
import UserPhotos from './components/userPhotos/userPhotos';

class PhotoShare extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      userID: '',
      firstName: '',
    };
  }
  
  tellStatus(loggedStatus, userID, firstName) {
    this.setState({
      isLoggedIn: loggedStatus,
      userID: userID,
      firstName: firstName,
    });
  }
 
  render() {
    return (
      <HashRouter>
      <div>
      <Grid container spacing={8}>
        <Grid item xs={12}>
          <Switch>
              <Route exact path="/">
                <TopBar firstName = {this.state.firstName} 
                        loginStatus={this.state.isLoggedIn} 
                        tellStatus={(loggedStatus, userID, firstName) => 
                          this.tellStatus(loggedStatus, userID, firstName)}/>
                
              </Route>
              <Route path="/users/:userId"
                  render={ props => <TopBar userId = {props.match.params.userId} 
                                            firstName = {this.state.firstName}
                                            loginStatus={this.state.isLoggedIn}
                                            tellStatus={(loggedStatus, userID, firstName) => 
                                               this.tellStatus(loggedStatus, userID, firstName)}/>}
              />
              <Route path="/photos/:userId"
                  render={ props => <TopBar userId = {props.match.params.userId}
                                            firstName = {this.state.firstName}
                                            loginStatus={this.state.isLoggedIn}
                                            tellStatus={(loggedStatus, userID, firstName) =>
                                               this.tellStatus(loggedStatus, userID, firstName)}/>}
                                            
              />
              <Route path="/users"> 
                <TopBar firstName = {this.state.firstName}
                        loginStatus={this.state.isLoggedIn}
                        tellStatus={(loggedStatus, userID, firstName) => 
                          this.tellStatus(loggedStatus, userID, firstName)}/>
              </Route>
              <Route path="/login-register"> 
                <TopBar loginStatus={this.state.isLoggedIn}
                        tellStatus={(loggedStatus, userID, firstName) => 
                          this.tellStatus(loggedStatus, userID, firstName)}/>
              </Route>
          </Switch>
        </Grid>
        <div className="cs142-main-topbar-buffer"/>
        <Grid item sm={3}>
          <Paper className="cs142-main-grid-item">
            <UserList loginStatus={this.state.isLoggedIn} />
          </Paper>
        </Grid>
        <Grid item sm={9}> 
          <Paper className="cs142-main-grid-item">
            <Switch>
              {
                this.state.isLoggedIn ?
                <Route exact path="/" />
                  :
                <Redirect exact path="/" to="/login-register" />
              }
              {
                  this.state.isLoggedIn ?
                  <Route path="/users/:userId"
                  render={ props => <UserDetail {...props} /> }
                />
                  :
                  <Redirect path="/users/:userId" to="/login-register" />
              }
              {
                  this.state.isLoggedIn ?
                  <Route path="/photos/:userId"
                  render ={ props => <UserPhotos {...props} /> }
                />
                  :
                  <Redirect path="/photos/:userId" to="/login-register" />
              }
              {
                this.state.isLoggedIn ?
                <Route path="/users" component={UserList}  />
                  :
                <Redirect path="/users" to="/login-register" />
              }
              {
                this.state.isLoggedIn ?
                <Redirect path="/login-register" to= {`/users/${this.state.userID}`}/>
                :
                <Route path="/login-register"
                  render={ props => 
                    <LoginRegister tellStatus={(loggedStatus, userID, firstName) => 
                                  this.tellStatus(loggedStatus, userID, firstName)}  />
                  } />
              }
            </Switch>
          </Paper>
        </Grid>
      </Grid>
      </div>
      </HashRouter>
    );
  }
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp'),
);
