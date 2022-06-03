import React from 'react';
import axios from 'axios';
import { MentionsInput, Mention } from 'react-mentions'
import './addComments.css';

class AddComments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: '',
            plainTextComment: '',
            userList: [],
            mentioned: [],
            
        };
    }
    componentDidMount() {
        axios.get(`/user/list`).then((res) => {
            this.setState({
                userList: res.data,
            });
        }).catch((error) => {
            this.setState({
                userList: [],
            });
            console.log(error);
        });
    }
    handleChange(event, newValue, newPlainTextValue, mentions) { //keep track of whatever text in loginName 
        this.setState({
            comment: newValue,
            plainTextComment: newPlainTextValue,
            mentioned: mentions.map(mention => mention.id), 
        });
        
    }
    handleComment(event) {
        event.preventDefault();
        axios.post(`/commentsOfPhoto/${this.props.photoID}`, {
            comment: this.state.plainTextComment,
            mentioned: JSON.stringify(this.state.mentioned), 
        }).then(() => {
            //rerender the whole page 
            this.props.reloadData();
        }).catch((err) => {
            console.log(err);
        });
        this.setState({
            comment: '',
        });
    }
    render() {
        return (
            <form onSubmit={e => this.handleComment(e)}>
                <label>
                    Type your comment here:  
                    <MentionsInput className="mention_textbox" value={this.state.comment} 
                                   onChange={(a, b, c, d) => this.handleChange(a, b, c, d)}
                                   style={{
                                       highlighter: {padding: 10},
                                       input: {padding: 10}
                                    }}>
                        <Mention className="mention_name"
                            trigger="@"
                            data= {this.state.userList.map((user) => {
                                return {
                                    display: `${user.first_name} ${user.last_name}`,
                                    id: user._id,
                                };
                            })}
                            displayTransform={(id, display) => {
                                return `@${display}`;
                            }}
                            appendSpaceOnAdd={true}
                        />

                    </MentionsInput>
                </label>
                <input type="submit" value="Submit" />
            </form>
            
        );
    }
}

export default AddComments;