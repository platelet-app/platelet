import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function DeliverableDropSelect(props) {
    const classes = useStyles();
    const [type, setType] = React.useState(props.deliverable.type_id);


    let menuItems = [];
    for (const item of props.availableDeliverables) {
        menuItems.push(<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
    }


    const handleChange = event => {
        setType(event.target.value);
        props.onSelect(props.uuid, event.target.value);
    };

    return (
        <div>
            <FormControl variant="filled" className={classes.formControl}>
                <InputLabel id="demo-simple-select-filled-label">Deliverable</InputLabel>
                <Select
                    labelId="deliverable-label"
                    id="deliverable-dropdown"
                    value={type}
                    onChange={handleChange}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {menuItems}
                </Select>
            </FormControl>
        </div>
    );
}
