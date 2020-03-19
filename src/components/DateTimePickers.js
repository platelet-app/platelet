import React, { useState } from "react";
import { DateTimePicker, KeyboardDateTimePicker } from "@material-ui/pickers";

export function DateAndTimePicker(props) {

    function handleDateChange(value) {
        props.onChange(value)
    }
    if (props.visible) {

        return (
            <>
                <KeyboardDateTimePicker
                    variant="inline"
                    ampm={false}
                    label={props.label}
                    value={props.value}
                    onChange={handleDateChange}
                    onError={console.log}
                    format="yyyy/MM/dd HH:mm"
                />
            </>
        );
    }
    else {
        return <></>
    }
}


export function CustomDateTimePicker(props) {
    const [clearedDate, handleClearedDateChange] = useState(null);
    const [selectedDate, handleDateChange] = useState(new Date("2019-01-01T18:54"));

    return (
        <>

            <KeyboardDateTimePicker
                value={selectedDate}
                onChange={handleDateChange}
                label="Keyboard with error handler"
                onError={console.log}
                minDate={new Date("2018-01-01T00:00")}
                format="yyyy/MM/dd hh:mm a"
            />

            <DateTimePicker
                clearable
                value={clearedDate}
                onChange={handleClearedDateChange}
                helperText="Clear Initial State"
            />
        </>
    );
}

