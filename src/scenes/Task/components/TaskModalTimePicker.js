import ToggleTimeStamp from "./ToggleTimeStamp";
import {DateAndTimePicker} from "../../../components/DateTimePickers";
import Grid from "@material-ui/core/Grid";
import React, {useState} from "react";

export default function TaskModalTimePicker(props) {
    const [dateTime, setDateTime] = useState(props.time);
    return (
        <Grid container spacing={2} direction={"column"} alignItems={"flex-start"} justify={"center"}>
            <Grid item>
            <ToggleTimeStamp label={props.label} status={dateTime !== null}
                             onSelect={() => {
                                 if (dateTime === null) {
                                     const time = new Date();
                                     setDateTime(time)
                                     props.onChange(time);
                                 } else {
                                     setDateTime(null)
                                     props.onChange(null);
                                 }
                             }
                             } disabled={props.disabled}/>
            </Grid>
            <Grid item>
            <DateAndTimePicker visible={!!dateTime} value={dateTime} label={props.label}
                               onChange={(value) => {
                                   props.onChange(value);
                                   setDateTime(value);
                               }} disabled={props.disabled}/>
            </Grid>
    </Grid>
    )
}
