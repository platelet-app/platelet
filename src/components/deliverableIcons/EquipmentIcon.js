import React from "react";
import { Avatar } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import BuildIcon from "@mui/icons-material/Build";
import { blue } from "@mui/material/colors";
import PropTypes from "prop-types";

const useStyles = makeStyles()((theme, { size }) => ({
    root: {
        color: theme.palette.getContrastText(blue[500]),
        backgroundColor: blue[500],
        width: theme.spacing(size),
        height: theme.spacing(size),
    },
    icon: {
        width: "100%",
        height: "100%",
    },
}));

function EquipmentIcon({ size }) {
    const { classes } = useStyles({ size });
    return (
        <Avatar
            aria-label="Equipment icon"
            variant={"rounded"}
            className={classes.root}
        >
            <BuildIcon className={classes.icon} />
        </Avatar>
    );
}

EquipmentIcon.propTypes = {
    size: PropTypes.number,
};
EquipmentIcon.defaultProps = {
    size: 6,
};

export default EquipmentIcon;
