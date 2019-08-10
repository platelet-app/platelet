import React from 'react'
import {Typography} from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
const ExpansionPanel = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    expanded: {},
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .03)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        padding: theme.spacing(2),
    },
}))(MuiExpansionPanelDetails);
class Sessions extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>
                <center><h1>Sessions</h1></center>
                {this.props.sessions.map((session) => (
                    <div key={session.uuid}>
                        <ExpansionPanel square>
                            <ExpansionPanelSummary>
                                <Typography>{session.uuid}</Typography>
                            </ExpansionPanelSummary>
                        </ExpansionPanel>
                    </div>
                ))}
            </div>
        )
    }
}

export default Sessions;