import ToggleTimeStamp from "../ToggleTimeStamp";
import {DateAndTimePicker} from "../DateTimePickers";
import React from "react";

export default function TaskModalTimePicker(props) {
    return (<>
            <ToggleTimeStamp label={props.label} status={!!props.time}
                             onSelect={props.onToggle} disabled={props.disabled}/>
            <DateAndTimePicker visible={!!props.time} value={props.time} label={props.label}
                               onChange={props.onChange} disabled={props.disabled}/>
        </>
    )
}