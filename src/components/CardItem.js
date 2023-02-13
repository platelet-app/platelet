import { makeStyles } from 'tss-react/mui';
import { Stack, Typography } from "@mui/material";
import React from "react";
import PropTypes from "prop-types";

const useStyles = makeStyles()({
    titleText: {
        fontSize: 14,
    },
    cardText: {
        fontWeight: "bold",
        fontSize: 14,
        maxWidth: 220,
    },
});

function CardItem(props) {
    const { classes } = useStyles();
    return (
        <Stack
            sx={{ width: props.width }}
            direction={"row"}
            alignItems={"center"}
            spacing={2}
            justifyContent={props.fullWidth ? "space-between" : "flex-start"}
        >
            {!!props.label && (
                <Typography className={classes.titleText}>
                    {props.label}:
                </Typography>
            )}
            <Typography noWrap className={classes.cardText}>
                {props.children}
            </Typography>
        </Stack>
    );
}

CardItem.propTypes = {
    label: PropTypes.string,
    width: PropTypes.string,
    fullWidth: PropTypes.bool,
};

CardItem.defaultProps = {
    label: "",
    width: "100%",
    fullWidth: false,
};

export default CardItem;
