import React from "react";
import { Avatar } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import BugReportIcon from "@mui/icons-material/BugReport";
import { red } from "@mui/material/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles()((theme, { size }) => ({
    root: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        width: theme.spacing(size),
        height: theme.spacing(size),
    },
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function BugIcon({ size }) {
    const { classes } = useStyles({ size });
    return (
        <Avatar
            aria-label="Bug icon"
            variant={"rounded"}
            className={classes.root}
        >
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
