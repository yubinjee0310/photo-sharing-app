import React from 'react';
import {
  Typography, Card, CardMedia, Button,
} from '@material-ui/core';
import axios from 'axios';
import './Favorites.css';

class Favorites extends React.Component {
  constructor(props) {
      super(props);
      this.state={
        favoritePhotos: [],
        isModalOpen: false, 
        photoInModal: {},
      };
  }
  componentDidMount(){
    this.reloadData();
  }
  reloadData() {
    axios.get('/favorites').then((res) => {
      this.setState({
        favoritePhotos: res.data, 
      });
    });
  }
  removePhoto = (e, currPhotoID) => {
    e.stopPropagation();
    axios.post(`/favorites`, {
      photo_id: currPhotoID,
      isFavorite: false,
    }).then(() => {
       this.reloadData();
    }).catch(error => {
      console.log(error);
    });
 };
 openModal(currPhoto) {
    this.setState({
      isModalOpen: true, 
      photoInModal: currPhoto,
    });
 }
  render() {
    return(
      <React.Fragment>
      <Typography variant="h4">Your Favorite Photos</Typography>
      {this.state.favoritePhotos.map(photo => (
          <Card className="favorited-photo" key={photo._id} 
                onClick={() => this.openModal(photo)}
          >
              <CardMedia 
                sx={{ maxWidth: 100 }}
                component="img"
                image={"/images/".concat(photo.file_name)}
              />
              <button onClick={(e) => {this.removePhoto(e, photo._id)}}>
                ❌
              </button>
          </Card>
        ))}
      {this.state.isModalOpen ?
        (
        <div className="background-blur">
          <dialog className="modal-dialog" open>
            <figure>
              <img src={"/images/".concat(this.state.photoInModal.file_name)}/> 
              <figcaption className="date-caption">Date: {this.state.photoInModal.date_time}</figcaption>   
            </figure> 
            <Button variant="contained" onClick={() => this.setState({isModalOpen: false})}>
                Return to Favorites 
            </Button>
          </dialog>
        </div>
        )
      : null}
      </React.Fragment>
    )
  }
}

export default Favorites;
