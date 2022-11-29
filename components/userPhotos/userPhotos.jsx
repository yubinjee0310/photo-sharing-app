import React from 'react';
import {
  Card,
  CardMedia,
  Typography,
  Button,
} from '@material-ui/core';
import './userPhotos.css';
import { Link } from "react-router-dom";
import axios from 'axios';
import AddComments from './addComments';

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      favorites: [],
    };
    this.didScroll = false; 
    this.props.stateManager.register(this, "photoupload");
  }
  tryScroll() {
    if (this.props.location && !this.didScroll) {
      const params = new URLSearchParams(this.props.location.search);
      const photo_id = params.get('scrolled-photo-id');
      if (photo_id !== null) {
        const elem = document.getElementById(photo_id);
        if (elem) {
          elem.scrollIntoView();
          this.didScroll = true; 
        }
      }
    }
  }
  componentDidMount() {
    this.reloadData();
    this.tryScroll();
  }
  componentDidUpdate(prevProps) {
    if (this.props.match.params.userId !== prevProps.match.params.userId) {
      this.reloadData();
    }
    this.tryScroll();
  }
  notifyEvent(eventType) {
    if (eventType === 'photoupload') {
      this.reloadData();
    }
  }
  reloadData() {
    axios.get(`/photosOfUser/${this.props.match.params.userId}`).then((res) => {
      this.setState({
        photos: res.data,
      });
    }).catch((error) => {
      console.log(error);  
    });
    axios.get(`/favorites`).then(res => {
      this.setState({
        favorites: res.data,
      });
    }).catch(error => {
      console.log(error.res.data);
    });
  }
  handleFavoriteButton(currPhotoID) {
    axios.post(`/favorites`, {
      photo_id: currPhotoID,
      isFavorite: true,
    }).then(() => {
       this.reloadData();
    }).catch(error => {
      console.log(error);
    });
 }
  render() {
    const favorited = this.state.favorites.map(photo => photo._id); 
    return (
        <React.Fragment>
          {this.state.photos.map(photo => (
            <div className="photo" key={photo._id} id={photo._id}>
              {/*image display */}
              <Card>
                  <CardMedia  
                    sx={{ maxWidth: 100 }}
                    component="img"
                    image={"/images/".concat(photo.file_name)}
                  />
              </Card>
              {/*date/time of photo display */}
              <div className="firstLine">
                <Typography variant="body1">
                  Photo was Posted: {photo.date_time}
                </Typography>
                {!favorited.includes(photo._id) ? 
                  (
                  <Button variant="contained" onClick={() => this.handleFavoriteButton(photo._id)}>
                    ❤️ Favorite  
                  </Button> 
                  )
                :
                (
                  <Typography>
                    ✅ Favorited 
                  </Typography>
                )}
              </div>
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
            </div>
          ))}
        </React.Fragment>
    );
  }
}

export default UserPhotos;
