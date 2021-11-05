import React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { AppBar, Hidden, Stack } from "@mui/material";
import { ArrowButton } from "../../../components/Buttons";
import { showHide } from "../../../styles/common";
import { taskStatusHumanReadable } from "../../../utilities";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import IconButton from "@mui/material/IconButton";
import clsx from "clsx";

const colourBarPercent = "90%";

const generateClass = (theme, status) => {
    if (status) {
        return {
            padding: 2,
            display: "flex",
            width: "100%",
            paddingLeft: 15,
            paddingRight: 15,
            italic: {
                fontStyle: "italic",
            },
            background: `linear-gradient(0deg,
        ${theme.palette.background.paper}
        ${colourBarPercent},
        ${theme.palette.background.paper}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]}
        ${colourBarPercent},
        ${theme.palette.taskStatus[status]} 100%)`,
        };
    } else {
        return {
            padding: 2,
            display: "flex",
            width: "100%",
            paddingLeft: 15,
            paddingRight: 15,
            italic: {
                fontStyle: "italic",
            },
            background:
                theme.palette.mode === "dark"
                    ? theme.palette.background.paper
                    : theme.palette.primary.main,
        };
    }
};

const dialogComponent = (props) =>
    makeStyles((theme) => {
        return {
            root: generateClass(theme, props.status),
            text: {
                color: theme.palette.mode === "dark" ? "white" : "black",
            },
            items: {
                marginTop: 5,
            },
        };
    });

function StatusBar(props) {
    const classes = dialogComponent(props)();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const statusHumanReadable = taskStatusHumanReadable(props.status);
    return (
        <AppBar
            position={isSm ? "relative" : "sticky"}
            className={classes.root}
        >
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{ paddingTop: 1, width: "50%" }}
            >
                <Hidden mdDown>
                    <Button onClick={props.handleClose}>Close</Button>
                </Hidden>
                <Hidden smUp>
                    <IconButton size={"small"} onClick={props.handleClose}>
                        <ArrowButton size={3} direction={"back"} />
                    </IconButton>
                </Hidden>
                <Typography className={clsx(classes.italic, classes.text)}>
                    Status: {statusHumanReadable}
                </Typography>
            </Stack>
        </AppBar>
    );
}

StatusBar.propTypes = {
    handleClose: PropTypes.func,
    status: PropTypes.string,
    relayNext: PropTypes.string,
    relayPrevious: PropTypes.string,
    taskUUID: PropTypes.string.isRequired,
};

StatusBar.defaultProps = {
    status: null,
    handleClose: () => {},
};

export default StatusBar;
