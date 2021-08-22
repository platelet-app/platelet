import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: '25ch',
  },
}));

export const ContactForm = () => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <TextField
                // label="Normal"
                defaultValue="Name"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                />

            <TextField
                // label="Normal"
                defaultValue="Tel"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                />
            <TextField
                // label="Normal"
                defaultValue="Email"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                />
        </div>
    )
}
