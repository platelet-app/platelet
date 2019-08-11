import React from 'react'
import {Typography} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const useStyles = makeStyles({
    card: {
        minWidth: 275,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 20,
    },
    pos: {
        marginBottom: 12,
    },
});

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
                            Session on {session.timestamp}
                        </Typography>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

