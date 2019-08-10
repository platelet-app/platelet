import React from 'react';
import './App.css';
import 'typeface-roboto'
import Sessions from './components/SessionsComponent'
import Control from './api_control'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';

class SessionsList extends React.Component {
    constructor(props) {
        super(props)
    }
    componentDidMount() {
        console.log(this.props.api_control.sessions)
        this.props.api_control.sessions.get_sessions("327a4f17-68a1-427c-82e1-add95d9cbdb0")
        .then((data) => {this.setState({sessions: data});
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
