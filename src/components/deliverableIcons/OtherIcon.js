import React from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import { lightGreen, green } from "@material-ui/core/colors";
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
