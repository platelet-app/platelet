import React from 'react'
import {Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
    },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 12,
    },
});

function convertDate(timestamp) {
    return new Date(timestamp).toString();

}

export default function Sessions(props) {
    const classes = useStyles();
    return (
        <div>
            <h1>Sessions</h1>
            {props.sessions.map((session) => (
                <Card className={classes.card} key={session.uuid}>
                    <CardContent>
                        <Typography className={classes.title}>Session {session.uuid}</Typography>
                        <Typography variant="body2" component="p">
                            {convertDate(session.timestamp)}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
