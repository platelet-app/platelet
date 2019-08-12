import React from 'react';
import '../App.css';
import 'typeface-roboto'
import Sessions from './Session'
import Control from '../api_control'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';

class SessionsList extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.props.api_control.users.whoami()
            .then((my_data) => {
                this.props.api_control.sessions.get_sessions(my_data.uuid)
                    .then((data) => {
                        this.setState({sessions: data});
                    })
            })
    }

    state = {
        sessions: []
    };

    render() {
        return <Sessions sessions={this.state.sessions}/>
    }
}

export default SessionsList;
