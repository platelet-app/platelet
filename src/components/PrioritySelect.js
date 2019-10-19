import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function PrioritySelect(props) {
    const classes = useStyles();
    let result = props.availablePriorities.filter(item => item.label === props.priority);
    console.log(result[0].id)
    const [values, setValues] = React.useState({
        priority: result[0].id
    });


    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = event => {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
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
                    value={values.priority}
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