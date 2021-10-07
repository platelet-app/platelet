import React, { useEffect, useState } from "react";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio";
import PropTypes from "prop-types";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Typography from "@material-ui/core/Typography";
import { priorities } from "../../../apiConsts";

const useStyles = makeStyles({
    label: {
        fontSize: 14,
    },
});

function PrioritySelect(props) {
    const classes = useStyles();
    const [state, setState] = useState(null);

    const handleChange = (event) => {
        setState(event.target.value);
        props.onSelect(event.target.value);
    };

    useEffect(() => setState(props.priority), [props.priority]);

    return (
        <FormControl component="fieldset">
            <RadioGroup
                row
                aria-label="priority"
                name="priority"
                value={state}
                onChange={handleChange}
            >
                {Object.values(priorities).map((priority) => (
                    <FormControlLabel
                        key={priority}
                        value={priority}
                        control={<Radio />}
                        label={
                            <Typography className={classes.label}>
                                {priority}
                            </Typography>
                        }
                    />
                ))}
            </RadioGroup>
        </FormControl>
    );
}

PrioritySelect.propTypes = {
    priority: PropTypes.number,
    onSelect: PropTypes.func,
};

PrioritySelect.defaultProps = {
    priority: null,
    onSelect: () => {},
};

export default PrioritySelect;
