import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import RiderPicker from "../../../components/RiderPicker";
import {SmallCirclePlusButton} from "../../../components/Buttons";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
    typography: {
        padding: theme.spacing(2),
    },
    popover: {
        padding: "10px"
    }
}));

export default function AssignRiderPopover() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'assign-rider-popover' : undefined;

    return (
        <div>
            <SmallCirclePlusButton tooltip={"Assign a rider"} onClick={handleClick} colour={"black"}/>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.popover}>
                    <RiderPicker label={"Select rider"}/>
                </div>
            </Popover>
        </div>
    );
}
