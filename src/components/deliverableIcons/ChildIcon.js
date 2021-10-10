import React from "react";
import { Avatar, makeStyles } from "@material-ui/core";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { pink } from "@material-ui/core/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
    root: (size) => ({
        color: theme.palette.getContrastText(pink[400]),
        backgroundColor: pink[400],
        width: theme.spacing(size),
        height: theme.spacing(size),
    }),
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function ChildIcon({ size }) {
    const classes = useStyles(size);
    return (
        <Avatar variant={"rounded"} className={classes.root}>
            <ChildCareIcon className={classes.icon} />
        </Avatar>
    );
}

ChildIcon.propTypes = {
    size: PropTypes.number,
};
ChildIcon.defaultProps = {
    size: 6,
};

export default ChildIcon;
