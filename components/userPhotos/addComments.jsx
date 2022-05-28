import React from 'react';
import axios from 'axios';

class AddComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
        };
    }

    handleChange(event) { //keep track of whatever text in loginName 
        this.setState({comment: event.target.value});
    }
    handleComment(event) {
        event.preventDefault();
        axios.post(`/commentsOfPhoto/${this.props.photoID}`, {
            comment: this.state.comment,
        }).then(() => {
            //rerender the whole page 
            this.props.reloadData();
        }).catch((err) => {
            console.log(err);
        });
    }

    render() {
        return (
            <form onSubmit={e => this.handleComment(e)}>
                <label>
                    Type your comment here: <input type="text" 
                                            value={this.state.comment} 
                                            onChange={e => this.handleChange(e)}/>   
                </label>
                <input type="submit" value="Submit" />
            </form>
        )
    }
}

export default AddComments;