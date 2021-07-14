import React, {useEffect, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import ClearIcon from '@material-ui/icons/Clear';
import {makeStyles} from "@material-ui/core/styles";

function IncreaseDecreaseCounter(props) {
    const [state, setState] = useState(props.value);
    const useStyles = makeStyles((theme) => ({
        button: {
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
        iconButton: {
            width: theme.spacing(4),
            height: theme.spacing(4)
        },
    }));
    const classes = useStyles();

    return (
        <Grid container direction={"row-reverse"} spacing={1} alignItems={"center"} justify={"center"}>
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    disabled={props.disabled}
                    onClick={props.onDelete}
                >
                    <ClearIcon className={classes.button}/>
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    disabled={props.disabled}
                    onClick={
                        () => {
                            props.onIncrease();
                            props.onChange(state + 1);
                            setState(state + 1);
                        }
                    }>
                    <AddIcon className={classes.button}/>
                </IconButton>
            </Grid>
            <Grid item>
                <Typography>{state}</Typography>
            </Grid>
            <Grid item>
                <IconButton
                    className={classes.iconButton}
                    disabled={props.disabled || state < 2}
                    onClick={
                        () => {
                            props.onDecrease();
                            props.onChange(state - 1);
                            setState(state - 1);
                        }
                    }>
                    <RemoveIcon className={classes.button}/>
                </IconButton>
            </Grid>
        </Grid>
    )
}

IncreaseDecreaseCounter.defaultProps = {
    onIncrease: () => {
    },
    onDecrease: () => {
    },
    onChange: () => {
    },
    onDelete: () => {
    },
    disabled: false,
    value: 0
}

IncreaseDecreaseCounter.propTypes = {
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    disabled: PropTypes.bool,
    value: PropTypes.number
}

export default IncreaseDecreaseCounter;
