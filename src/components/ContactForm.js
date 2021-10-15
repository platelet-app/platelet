import React, { useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TextField from '@mui/material/TextField';

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
            label="Name"
            id="name"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={(e) => onChange({name: e.target.value})}
            value={values.name}
            />

        <TextField
            label="Phone Number"
            id="phone"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={(e) => onChange({phone: e.target.value})}
            value={values.phone}
            />
        <TextField
            label="Email"
            id="email"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={(e) => onChange({email: e.target.value})}
            value={values.email}
            />
      </form>
    )
}
