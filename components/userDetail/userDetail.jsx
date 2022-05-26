import React from 'react';
import {
  Typography,
} from '@material-ui/core';
import './userDetail.css';
import { Link } from "react-router-dom";
import axios from 'axios';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
    };
  }
  componentDidMount() {
    axios.get(`/user/${this.props.match.params.userId}`).then((res) => {
      this.setState({
        user: res.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      axios.get(`/user/${this.props.match.params.userId}`).then((res) => {
        this.setState({
          user: res.data,
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  render() {
    const user = this.state.user;
    return (
      <React.Fragment>
        <Typography variant="h2" className="name">
          {`${user.first_name} ${user.last_name}`}
        </Typography>
        
        <Typography variant="body1" className="location">
        <strong>Location: </strong>{`${user.location}`}
        </Typography>

        <Typography variant="body1" className="occupation">
        <strong>Occupation: </strong>{`${user.occupation}`}
        </Typography>

        <Typography variant="subtitle1" className="photos">
        <strong>Description: </strong>{`${user.description}`}
        </Typography>
        <Link to={`/photos/${user._id}`}>Photos of User</Link>
      </React.Fragment>
    );
  }
}

export default UserDetail;
