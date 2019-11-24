import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(0),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function PrioritySelect(props) {
    const classes = useStyles();
    const [values, setValues] = React.useState({
        priority: props.priority ? props.priority : null
    });


    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = event => {
        props.onSelect(event.target.value);
    };

    let menuItems = [];
    for (const item of props.availablePriorities) {
        menuItems.push(<MenuItem key={item.id} value={item.id}>{item.label}</MenuItem>)
    }

    return (
        <form className={classes.root} autoComplete="off">
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
                    Priority
                </InputLabel>
                <Select
                    value={props.priority}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                    inputProps={{
                        name: 'priority',
                        id: 'outlined-priority',
                    }}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {menuItems}
                </Select>
            </FormControl>
        </form>
    );
}