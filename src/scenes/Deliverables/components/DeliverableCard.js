import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import { Stack, Tooltip } from "@mui/material";
import { deliverableIcons } from "../../../apiConsts";
import { getDeliverableIconByEnum } from "../../../utilities";

const useStyles = makeStyles(() => ({
    root: (props) => ({
        width: "100%",
        backgroundColor: "rgba(180, 180, 180, 0.1)",
    }),
    label: {
        maxWidth: 120,
    },
}));

function DeliverableCard(props) {
    const classes = useStyles(props);
    return (
        <Stack
            className={classes.root}
            sx={{ padding: 1 }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={2}
        >
            <Stack
                spacing={2}
                justifyContent={"center"}
                alignItems={"center"}
                direction={"row"}
            >
                {getDeliverableIconByEnum(props.icon, 4)}
                <Tooltip
                    title={
                        props.label && props.label.length > 14
                            ? props.label
                            : ""
                    }
                >
                    <Typography noWrap className={classes.label}>
                        {props.label}
                    </Typography>
                </Tooltip>
            </Stack>
            {props.children}
        </Stack>
    );
}

DeliverableCard.propTypes = {
    icon: PropTypes.string,
    label: PropTypes.string,
    onDelete: PropTypes.func,
    compact: PropTypes.bool,
};

DeliverableCard.defaultProps = {
    icon: deliverableIcons.other,
    onDelete: () => {},
    compact: false,
    label: "Unknown",
};

export default DeliverableCard;
