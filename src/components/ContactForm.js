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

const initialValues = {
  name: "",
  phone: "",
  email: "",
}

export const ContactForm = ({ onChange }) => {
    const classes = useStyles();

    const [value, setValue] = useState(initialValues)

    const handleChange = (e) => {
      if(e.currentTarget.id) {
        value[e.currentTarget.id] = e.target.value
        setValue(value)
        onChange(e, value, "caller")
      }
    }

    return (
      <form className={classes.root} noValidate autoComplete="off">
        <TextField
            defaultValue="Name"
            id="name"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            />

        <TextField
            defaultValue="Tel"
            id="phone"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            />
        <TextField
            defaultValue="Email"
            id="email"
            className={classes.textField}
            margin="normal"
            variant="outlined"
            onChange={handleChange}
            />
      </form>
    )
}
