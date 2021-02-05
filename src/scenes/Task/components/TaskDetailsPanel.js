import React from "react";
import Typography from "@material-ui/core/Typography";
import Moment from "react-moment";
import LabelItemPair from "../../../components/LabelItemPair";
import PropTypes from "prop-types"
import Grid from "@material-ui/core/Grid";

function TaskDetailsPanel(props) {
    const {
        reference,
        time_of_call,
        contact,
        priority,
        patch,
        assigned_riders_display_string
    } = props.task;
    const {name, telephone_number} = props.task.contact ? props.task.contact : {name: "", telephone_number: ""}
    return (
        <Grid container spacing={3}>
            <Grid item>
                <LabelItemPair label={"Reference"}>
                    <Typography>{reference}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"TOC"}>
                    <Typography><Moment local calendar>{time_of_call}</Moment></Typography>
                </LabelItemPair>
                <Typography>{name}</Typography>
                <Typography>{telephone_number}</Typography>
                <LabelItemPair label={"Priority"}>
                    <Typography>{priority}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"Patch"}>
                    <Typography>{patch}</Typography>
                </LabelItemPair>
                <LabelItemPair label={"Assigned rider"}>
                    <Typography>{assigned_riders_display_string}</Typography>
                </LabelItemPair>
            </Grid>
            <Grid item>

            </Grid>
        </Grid>
    )
}

TaskDetailsPanel.propTypes = {
    task: PropTypes.object
};

export default TaskDetailsPanel;
