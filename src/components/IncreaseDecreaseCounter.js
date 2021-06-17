import React, {useEffect, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";

function IncreaseDecreaseCounter(props) {
    const [state, setState] = useState(props.value);

    //useEffect(() => setState(props.value), [props.value]);

    return (
        <Grid container direction={"row-reverse"} spacing={1} alignItems={"center"} justify={"center"}>
            <Grid item>
                <IconButton
                    disabled={props.disabled}
                    onClick={
                    () => {
                        props.onIncrease();
                        props.onChange(state + 1);
                        setState(state + 1);
                    }
                }>
                    <AddIcon/>
                </IconButton>
            </Grid>
            <Grid item>
                <Typography>{state}</Typography>
            </Grid>
            <Grid item>
                <IconButton
                    disabled={props.disabled}
                    onClick={
                    () => {
                        props.onDecrease();
                        props.onChange(state - 1);
                        setState(state - 1);
                    }
                }>
                    <RemoveIcon/>
                </IconButton>
                <Grid/>
            </Grid>
        </Grid>
    )
}

IncreaseDecreaseCounter.defaultProps = {
    onIncrease: () => {},
    onDecrease: () => {},
    onChange: () => {},
    disabled: false,
    value: 0
}

IncreaseDecreaseCounter.propTypes = {
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.number
}

export default IncreaseDecreaseCounter;
