import React, { useState } from 'react';
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

export const ContactForm = ({ values, onChange }) => {
    const classes = useStyles();


    return (
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
            defaultValue="Name"
            id="name"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={(e) => onChange({name: e.target.value})}
            value={values.name}
            />

        <TextField
            defaultValue="Tel"
            id="phone"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={(e) => onChange({phone: e.target.value})}
            />
        <TextField
            defaultValue="Email"
            id="email"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={(e) => onChange({email: e.target.value})}
            />
      </form>
    )
}
