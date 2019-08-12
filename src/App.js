import React from 'react';
import Main from './components/Main'
import Menu from './components/Menu'
import './App.css';
import SessionsList from './components/SessionList';
import 'typeface-roboto'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


class App extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <div className="App">
                    <Menu></Menu>
                    <Main api_control={this.props.api_control}></Main>
                    <header className="App-header">
                        <meta
                            name="viewport"
                            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
                        />
                    </header>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
