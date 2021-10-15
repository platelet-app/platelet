import React from "react";
import { Avatar, makeStyles } from "@mui/material";
import BugReportIcon from "@mui/icons-material/BugReport";
import { red } from "@mui/material/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: (size) => ({
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        width: theme.spacing(size),
        height: theme.spacing(size),
    }),
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function BugIcon({ size }) {
    const classes = useStyles(size);
    return (
        <Avatar variant={"rounded"} className={classes.root}>
            <BugReportIcon className={classes.icon} />
        </Avatar>
    );
}

BugIcon.propTypes = {
    size: PropTypes.number,
};
BugIcon.defaultProps = {
    size: 6,
};

export default BugIcon;
