import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"
import React from "react";
import {red, lightGreen, pink, deepPurple, deepOrange} from "@material-ui/core/colors"
import {makeStyles} from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import BugReportIcon from "@material-ui/icons/BugReport"
import ChildCareIcon from "@material-ui/icons/ChildCare"
import DescriptionIcon from "@material-ui/icons/Description"
import AcUnitIcon from "@material-ui/icons/AcUnit"
import ClearIcon from "@material-ui/icons/Clear"
import IconButton from "@material-ui/core/IconButton"
import PropTypes from "prop-types";


function getIcon(typeID) {
    switch (typeID) {
        case 1:
            return <BugReportIcon/>
        case 2:
            return <DescriptionIcon/>
        case 3:
            return <ChildCareIcon/>
        default:
            return <AcUnitIcon/>
    }
}

function DeliverableCard(props) {
    const spacingValue = props.size === "compact" ? 3 : 6;
    const useStyles = makeStyles((theme) => ({
        sample: {
            color: theme.palette.getContrastText(red[500]),
            backgroundColor: red[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue)
        },
        milk: {
            color: theme.palette.getContrastText(pink[500]),
            backgroundColor: pink[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue)
        },
        document: {
            color: theme.palette.getContrastText(deepPurple[500]),
            backgroundColor: deepPurple[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue)
        },
        other: {
            color: theme.palette.getContrastText(deepOrange[500]),
            backgroundColor: lightGreen[500],
            width: theme.spacing(spacingValue),
            height: theme.spacing(spacingValue)
        }
    }))

    const classes = useStyles();
    function getClass(typeID) {
        switch (typeID) {
            case 1:
                return classes.sample
            case 2:
                return classes.document
            case 3:
                return classes.milk
            default:
                return classes.other
        }
    }

    const height = props.size === "compact" ? "50px" : "100px"

    return (
            <Grid style={{height}} container spacing={1} justify={"space-between"} alignItems={"center"} direction={"row"}>
                <Grid item>
                    <Grid container spacing={2} justify={"flex-start"} alignItems={"center"} direction={"row"}>
                        <Grid item>
                            <Avatar className={getClass(props.typeID)}>
                                {getIcon(props.typeID)}
                            </Avatar>
                        </Grid>
                        <Grid item>
                            <Typography>
                                {props.label}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
    )
}

DeliverableCard.propTypes = {
    typeID: PropTypes.number,
    label: PropTypes.string,
    onDelete: PropTypes.func,
    size: PropTypes.oneOf(["normal", "compact"])
}

DeliverableCard.defaultProps = {
    onDelete: () => {},
    size: "normal",
    label: "Unknown"
}

export default DeliverableCard;
