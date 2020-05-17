import {StyledSharpCard} from "../css/common";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography"
import React from "react";
import {red, yellow} from "@material-ui/core/colors"
import {makeStyles} from "@material-ui/core/styles"
import Avatar from "@material-ui/core/Avatar"
import BugReportIcon from "@material-ui/icons/BugReport"
import ChildCareIcon from "@material-ui/icons/ChildCare"
import DescriptionIcon from "@material-ui/icons/Description"
import AcUnitIcon from "@material-ui/icons/AcUnit"

const useStyles = makeStyles((theme) => ({
    sample: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500]
    },
    milk: {
        color: theme.palette.getContrastText(yellow[500]),
        backgroundColor: yellow[500]
    }
}))

function getIcon(typeID) {
    switch(typeID) {
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

export default function DeliverableCard(props) {
    const classes = useStyles();
    return (
        <StyledSharpCard style={{height: "100px"}}>
            <CardContent>
                <Grid container spacing={2} justify={"flex-start"} alignItems={"center"} direction={"row"}>
                    <Grid item>
                        <Avatar className={classes.milk}>
                            {getIcon(props.deliverable.type_id)}
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography>
                            {props.deliverable.type}
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </StyledSharpCard>
    )
}
