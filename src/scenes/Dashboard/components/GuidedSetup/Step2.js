import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
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

export const Step2 = ({ values, onChange }) => {
    const classes = useStyles();
    const [location, setLocation] = React.useState('EUR');

    const handleChange = (event) => {
        setLocation(event.target.value);
    };

    return (
        <div>
            <Typography>{"Where is it being picked up from?"}</Typography>
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
            <Typography>{"Sender Contact:"}</Typography>
            <ContactForm values={values['sender']} onChange={onChange} />
        </div>
    )
}
