import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { ContactForm } from '../../../../components/ContactForm'
import MenuItem from '@material-ui/core/MenuItem';  
import TextField from '@material-ui/core/TextField';

const locations = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

const useStyles = makeStyles((theme) => ({
    root: {
       display: 'flex',
       justifyContent: 'center',
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '30ch',
      },
    },
  }));

export const Step2 = () => {
    const classes = useStyles();
    const [location, setLocation] = React.useState('EUR');

    const handleChange = (event) => {
        setLocation(event.target.value);
    };

    return (
        <div>
            <Box p={1}>
                <Typography>{"Where is it being picked up from?"}</Typography>
            </Box>
            <form className={classes.root} noValidate autoComplete="off">
                <TextField
                    id="outlined-select-location"
                    select
                    label="Locations"
                    value={location}
                    onChange={handleChange}
                    variant="outlined"
                    >
                {locations.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                    {option.label}
                    </MenuItem>
                ))}
                </TextField>
            </form>
            <Box p={1}>
                <Typography>{"Sender Contact:"}</Typography>
            </Box>
            <ContactForm />
        </div>
    )
}
