import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { DateTimePicker } from "@mui/lab";

function isValidDate(d: Date | number | null) {
    return d instanceof Date && !isNaN(d as any);
}

type MultipleSelectionActionsSetTimeProps = {
    onChange?: (...args: any[]) => any;
};

const MultipleSelectionActionsSetTime: React.SFC<MultipleSelectionActionsSetTimeProps> =
    ({ onChange = () => {} }) => {
        const [time, setTime] = React.useState<Date | null>(new Date());

        function handleTimeChange(value: Date | null) {
            setTime(value);
        }

        useEffect(() => {
            if (!isValidDate(time)) onChange(null);
            else onChange(time);
        }, [onChange, time]);

        return (
            <DateTimePicker
                value={time}
                inputFormat={"dd/MM/yyyy HH:mm"}
                openTo="hours"
                onChange={handleTimeChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
            />
        );
    };

export default MultipleSelectionActionsSetTime;
