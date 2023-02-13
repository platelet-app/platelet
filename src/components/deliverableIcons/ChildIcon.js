import React from "react";
import { Avatar } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import { pink } from "@mui/material/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles()((theme, { size }) => ({
    root: {
        color: theme.palette.getContrastText(pink[400]),
        backgroundColor: pink[400],
        width: theme.spacing(size),
        height: theme.spacing(size),
    },
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function ChildIcon({ size }) {
    const { classes } = useStyles({ size });
    return (
        <Avatar
            aria-label="Child icon"
            variant={"rounded"}
            className={classes.root}
        >
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
