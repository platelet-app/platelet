import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import {
    red,
    lightGreen,
    pink,
    deepPurple,
    deepOrange,
    blue,
} from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import BugReportIcon from "@material-ui/icons/BugReport";
import BuildIcon from "@material-ui/icons/Build";
import ChildCareIcon from "@material-ui/icons/ChildCare";
import DescriptionIcon from "@material-ui/icons/Description";
import AcUnitIcon from "@material-ui/icons/AcUnit";
import PropTypes from "prop-types";
import { Tooltip } from "@material-ui/core";
import { deliverableIcons } from "../../../apiConsts";

function getIcon(typeID) {
    switch (typeID) {
        case deliverableIcons.bug:
            return <BugReportIcon />;
        case deliverableIcons.document:
            return <DescriptionIcon />;
        case deliverableIcons.child:
            return <ChildCareIcon />;
        case deliverableIcons.equipment:
            return <BuildIcon />;
        default:
            return <AcUnitIcon />;
    }
}

function DeliverableCard(props) {
    const spacingValue = props.compact ? 3 : 6;
    const useStyles = makeStyles((theme) => ({
        root: {
            width: "100%",
            margin: props.compact ? 3 : 10,
        },
        label: {
            maxWidth: 120,
        },
        [deliverableIcons.bug]: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue),
        },
        [deliverableIcons.child]: {
            color: theme.palette.getContrastText(pink[400]),
            backgroundColor: pink[400],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue),
        },
        [deliverableIcons.document]: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue),
        },
        [deliverableIcons.equipment]: {
            color: theme.palette.getContrastText(blue[500]),
            backgroundColor: blue[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue),
        },
        [deliverableIcons.other]: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: lightGreen[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue),
        },
    }));

    const classes = useStyles();
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
                        <Avatar className={classes[props.icon]}>
                            {getIcon(props.icon)}
                        </Avatar>
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
