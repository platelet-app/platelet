import React from "react";
import { Avatar } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import DescriptionIcon from "@mui/icons-material/Description";
import { deepPurple } from "@mui/material/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles()((theme, { size }) => ({
    root: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
        width: theme.spacing(size),
        height: theme.spacing(size),
    },
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function DocumentIcon({ size }) {
    const { classes } = useStyles({
        size,
    });
    return (
        <Avatar
            aria-label="Document icon"
            variant={"rounded"}
            className={classes.root}
        >
            <DescriptionIcon className={classes.icon} />
        </Avatar>
    );
}

DocumentIcon.propTypes = {
    size: PropTypes.number,
};
DocumentIcon.defaultProps = {
    size: 6,
};

export default DocumentIcon;
