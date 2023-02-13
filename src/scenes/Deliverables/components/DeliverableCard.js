import Typography from "@mui/material/Typography";
import React from "react";
import { makeStyles } from "tss-react/mui";
import PropTypes from "prop-types";
import { Stack, Tooltip } from "@mui/material";
import { deliverableIcons } from "../../../apiConsts";
import { getDeliverableIconByEnum } from "../../../utilities";

const useStyles = makeStyles()(({ compact }) => ({
    root: {
        width: "100%",
        backgroundColor: "rgba(180, 180, 180, 0.1)",
    },
    label: {
        maxWidth: compact ? 120 : 200,
    },
}));

function DeliverableCard(props) {
    const { classes } = useStyles({ compact: props.compact });
    const maxTextLength = props.compact ? 12 : 22;
    return (
        <Stack
            className={classes.root}
            sx={{
                paddingTop: 1,
                paddingBottom: 1,
                paddingLeft: 0.4,
                paddingRight: 0.4,
            }}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            spacing={0}
        >
            <Stack
                spacing={1}
                justifyContent={"center"}
                alignItems={"center"}
                direction={"row"}
            >
                {getDeliverableIconByEnum(props.icon, 4)}
                <Tooltip
                    title={
                        props.label && props.label.length > maxTextLength
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
