import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import PropTypes from "prop-types";
import ClearIcon from "@mui/icons-material/Clear";
import { makeStyles } from "tss-react/mui";
import ClickableTextField from "./ClickableTextField";

function IncreaseDecreaseCounter(props) {
    const [state, setState] = useState(props.value);
    const useStyles = makeStyles()((theme) => ({
        button: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
        iconButton: {
            width: theme.spacing(4),
            height: theme.spacing(4),
        },
    }));
    const { classes } = useStyles();

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
                        props.onChange(state + 1);
                        setState(state + 1);
                    }}
                    size="large"
                >
                    <AddIcon className={classes.button} />
                </IconButton>
            </Grid>
            <Grid item>
                <ClickableTextField
                    textFieldProps={{ sx: { width: 40 } }}
                    value={state}
                    onChange={(v) => {
                        const result = parseInt(v);
                        setState(result);
                        props.onChange(result);
                    }}
                />
            </Grid>
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    aria-label="decrement"
                    disabled={props.disabled || state < 2}
                    onClick={() => {
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
    onChange: () => {},
    onDelete: () => {},
    disabled: false,
    value: 0,
};

IncreaseDecreaseCounter.propTypes = {
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.number,
};

export default IncreaseDecreaseCounter;
