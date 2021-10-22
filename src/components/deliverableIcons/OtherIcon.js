import React from "react";
import { Avatar } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import AcUnitIcon from "@mui/icons-material/AcUnit";
import { lightGreen, green } from "@mui/material/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: (size) => ({
        color: "white",
        backgroundColor: lightGreen[500],
        width: theme.spacing(size),
        height: theme.spacing(size),
    }),
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function OtherIcon({ size }) {
    const classes = useStyles(size);
    return (
        <Avatar variant={"rounded"} className={classes.root}>
            <AcUnitIcon className={classes.root} />
        </Avatar>
    );
}

OtherIcon.propTypes = {
    size: PropTypes.number,
};
OtherIcon.defaultProps = {
    size: 6,
};

export default OtherIcon;
