import React from 'react';
import {
  Card,
  CardMedia,
  Typography
} from '@material-ui/core';
import './userPhotos.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import AddComments from './addComments';
import StateManager from '../../lib/stateManager';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
    };
    this.props.stateManager.register(this, "photoupload");
  }
  componentDidMount() {
    this.reloadData();
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      this.reloadData();
    }
  }
  notifyEvent(eventType) {
    this.reloadData();
  }
  reloadData() {
    axios.get(`/photosOfUser/${this.props.match.params.userId}`).then((res) => {
      this.setState({
        photos: res.data,
      });
    }).catch((error) => {
      console.log(error);
    });
  }
  render() {
    return (
        <React.Fragment>
          {this.state.photos.map(photo => (
            <React.Fragment key={photo._id}>
              {/*image display */}
              <Card>
                  <CardMedia  
                    sx={{ maxWidth: 100 }}
                    component="img"
                    image={"/images/".concat(photo.file_name)}
                  />
              </Card>
              {/*date/time of photo display */}
              <Typography variant = "body1">
                Photo was Posted: {photo.date_time}
              </Typography>
              {photo.comments && (
                <Typography variant="body2">
                  Comments:
                </Typography>
              )}
              {/*comment display */}
              {photo.comments && photo.comments.map(commentObject => (
                  <div key={commentObject._id} className="comment">
                    <Typography variant="body2">
                      <strong>Comment:</strong> {commentObject.comment}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Comment Posted:</strong> {commentObject.date_time}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Comment By:</strong> <Link to={`/users/${commentObject.user._id}`}>{`${commentObject.user.first_name} ${commentObject.user.last_name}`}</Link> 
                    </Typography>
                  </div>
              ))}
              <AddComments photoID={photo._id} reloadData={() => this.reloadData()} />
            </React.Fragment>
          ))}
        </React.Fragment>
    );
  }
}

export default UserPhotos;
