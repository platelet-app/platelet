import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import { makeStyles } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import PropTypes from "prop-types";
import { Tooltip } from "@mui/material";
import { deliverableIcons } from "../../../apiConsts";
import { getDeliverableIconByEnum } from "../../../utilities";

const useStyles = makeStyles(() => ({
    root: (props) => ({
        width: "100%",
        margin: props.compact ? 3 : 10,
    }),
    label: {
        maxWidth: 120,
    },
}));

function DeliverableCard(props) {
    const spacingValue = props.compact ? 4 : 6;
    const classes = useStyles(props);
    return (
        <Grid
            className={classes.root}
            container
            spacing={1}
            justify={"space-between"}
            alignItems={"center"}
            direction={"row"}
        >
            <Grid item>
                <Grid
                    container
                    spacing={2}
                    justify={"flex-start"}
                    alignItems={"center"}
                    direction={"row"}
                >
                    <Grid item>
                        {getDeliverableIconByEnum(props.icon, spacingValue)}
                    </Grid>
                    <Grid item>
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
                    </Grid>
                </Grid>
            </Grid>
            <Grid item>{props.children}</Grid>
        </Grid>
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
