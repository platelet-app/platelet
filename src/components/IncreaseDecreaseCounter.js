import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import ClearIcon from "@mui/icons-material/Clear";
import makeStyles from "@mui/styles/makeStyles";

function IncreaseDecreaseCounter(props) {
    const [state, setState] = useState(props.value);
    const useStyles = makeStyles((theme) => ({
        button: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        iconButton: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
    }));
    const classes = useStyles();

    return (
        <Grid
            container
            direction={"row-reverse"}
            spacing={1}
            alignItems={"center"}
            justifyContent={"center"}
        >
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    disabled={props.disabled}
                    onClick={props.onDelete}
                    aria-label="delete"
                    size={"large"}
                >
                    <ClearIcon className={classes.button} />
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    aria-label="increment"
                    disabled={props.disabled}
                    onClick={() => {
                        props.onIncrease();
                        props.onChange(state + 1);
                        setState(state + 1);
                    }}
                    size="large"
                >
                    <AddIcon className={classes.button} />
                </IconButton>
            </Grid>
            <Grid item>
                <Typography>{state}</Typography>
            </Grid>
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    aria-label="decrement"
                    disabled={props.disabled || state < 2}
                    onClick={() => {
                        props.onDecrease();
                        props.onChange(state - 1);
                        setState(state - 1);
                    }}
                    size="large"
                >
                    <RemoveIcon className={classes.button} />
                </IconButton>
            </Grid>
        </Grid>
    );
}

IncreaseDecreaseCounter.defaultProps = {
    onIncrease: () => {},
    onDecrease: () => {},
    onChange: () => {},
    onDelete: () => {},
    disabled: false,
    value: 0,
};

IncreaseDecreaseCounter.propTypes = {
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.number,
};

export default IncreaseDecreaseCounter;
