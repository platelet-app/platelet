import React from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio"
import {useSelector} from "react-redux";
import {useEffect} from 'react'
import PropTypes from "prop-types"
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
    label: {
        fontSize: 14
    }
});


function PrioritySelect(props) {
    const [value, setValue] = React.useState(props.priorityID || null);
    const classes = useStyles();
    const availablePriorities = useSelector(state => state.availablePriorities.priorities);

    const handleChange = event => {
        let result = availablePriorities.find(item => item.id == event.target.value);
        if (result) {
            props.onSelect(event.target.value, result.label);
            setValue(result.id)
        }
    };
    useEffect(() => {
        if (props.priorityID)
                setValue(parseInt(props.priorityID))
    }, [props.priorityID])

    return (
        <FormControl component="fieldset">
            <RadioGroup row aria-label="priority" name="priority" value={value} onChange={handleChange}>
                {availablePriorities.map((priority) =>
                    (
                        <FormControlLabel
                            key={priority.id}
                            value={priority.id}
                            control={<Radio/>}
                            label={<Typography className={classes.label}>{priority.label}</Typography>}/>)
                )}
            </RadioGroup>
        </FormControl>
        )
}

PrioritySelect.propTypes = {
    priorityID: PropTypes.number,
    onSelect: PropTypes.func
};

PrioritySelect.defaultProps = {
    onSelect: () => {}
};

export default PrioritySelect;
