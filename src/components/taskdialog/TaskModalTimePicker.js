import Box from "@material-ui/core/Box";
import ToggleTimeStamp from "../ToggleTimeStamp";
import {DateAndTimePicker} from "../DateTimePickers";
import {updateTaskPickupTime} from "../../redux/tasks/Actions";
import DialogContentText from "@material-ui/core/DialogContentText";
import Grid from "@material-ui/core/Grid";
import React from "react";

export default function TaskModalTimePicker(props) {
    return (<>
        <ToggleTimeStamp label={props.label} status={!!props.time}
                         onSelect={props.onToggle}/>
        <DateAndTimePicker visible={!!props.time} value={props.time} label={"Pickup Time"}
                           onChange={props.onChange}/>
        </>
)
}