import { Divider, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { makeStyles } from "tss-react/mui";

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

type DateStampDividerProps = {
    date: string;
    calendar?: boolean;
};

const DateStampDivider: React.FC<DateStampDividerProps> = ({
    date,
    calendar = false,
}) => {
    const { classes } = useStyles();
    const dateString = calendar
        ? moment(date).calendar(null, {
              lastDay: "[Yesterday]",
              sameDay: "[Today]",
              nextDay: "[Tomorrow]",
              lastWeek: "[last] dddd",
              nextWeek: "dddd",
              sameElse: "L",
          })
        : moment(date).format("L");
    return (
        <Divider className={classes.date} orientation="horizontal">
            <Typography>{dateString}</Typography>
        </Divider>
    );
};
export default DateStampDivider;
