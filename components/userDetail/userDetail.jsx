import React from 'react';
import {
  Typography, Button, Avatar, Card
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
      mentionedPhotos: [],
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
    axios.get(`/mentionsInPhoto/${this.props.match.params.userId}`).then(res => {
      this.setState({
        mentionedPhotos: res.data, 
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
      axios.get(`/mentionsInPhoto/${this.props.match.params.userId}`).then(res => {
        this.setState({
          mentionedPhotos: res.data, 
        });
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  render() {
    const user = this.state.user;
    const mentionedPhotos = this.state.mentionedPhotos; 
    return (
    <React.Fragment>
        <Card>
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
          <Link to={`/photos/${user._id}`}>Photos of {`${this.state.user.first_name} 
                                                     ${this.state.user.last_name}`}</Link>
        </Card>
        <Card>
          {
            mentionedPhotos.length > 0 ?
              <React.Fragment>
                <Typography variant="h5" className="mentioned-photos-title">Mentioned photos</Typography>
                {
                  mentionedPhotos.map((photo) => {
                    return (
                      <React.Fragment key={photo._id}>
                        <div className="mentioned-photo">
                            <Link to={`/photos/${photo.user_id}?scrolled-photo-id=${photo._id}`} className="photo-thumbnail">
                              <Avatar alt={photo.file_name} src={`../../images/${photo.file_name}`}/>
                            </Link>
                            <Typography>
                              Posted By <Link to={`/users/${photo.user_id}`}>{`${photo.first_name} 
                                                      ${photo.last_name}`}</Link>
                            </Typography>
                        </div>
                      </React.Fragment>
                    );
                  })
                }
              </React.Fragment>
            :
              <Typography variant="subtitle1">
                This user has not been mentioned in any photo. 
              </Typography>
          }
        </Card>
      </React.Fragment>
    );
  }
}

export default UserDetail;
