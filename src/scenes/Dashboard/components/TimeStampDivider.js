import { Divider, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from 'tss-react/mui';

const useStyles = makeStyles()((theme) => ({
    date: {
        fontStyle: "italic",
        maxWidth: "100%",
        width: "90%",
        color: "gray",
        "&:hover": {
            color: theme.palette.mode === "dark" ? "white" : "black",
        },
    },
}));

function DateStampDivider(props) {
    const { classes } = useStyles();
    return (
        <Divider className={classes.date} orientation="horizontal">
            <Typography>
                {moment(props.date).calendar(null, {
                    lastDay: "[Yesterday]",
                    sameDay: "[Today]",
                    nextDay: "[Tomorrow]",
                    lastWeek: "[last] dddd",
                    nextWeek: "dddd",
                    sameElse: "L",
                })}
            </Typography>
        </Divider>
    );
}

DateStampDivider.propTypes = {
    date: PropTypes.string.isRequired,
};

export default DateStampDivider;
