import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

type TimePickerBasicProps = {
    value: string;
    onChange: (value: string) => void;
    isValid: boolean;
    showOnlyTodayTimes?: boolean;
    startDate?: Date;
};

const TimePickerBasic: React.FC<TimePickerBasicProps> = ({
    value,
    onChange,
    isValid,
    showOnlyTodayTimes = false,
    startDate,
}) => {
    const timeOptions = generateTimeOptions(startDate, showOnlyTodayTimes);

    const handleInputChange = (_: any, newInputValue: string) => {
        // Regular expression to allow only numbers and colons, with a maximum length of 5
        const validInput = newInputValue.replace(/[^0-9:]/g, "").slice(0, 5);
        onChange(validInput);
    };

    return (
        <Autocomplete
            fullWidth
            freeSolo
            id="time-picker-basic"
            options={timeOptions}
            getOptionLabel={(option) => option}
            value={value}
            inputValue={value}
            onInputChange={handleInputChange}
            onChange={(_, newValue) => {
                if (typeof newValue === "string") {
                    onChange(newValue);
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    helperText={!isValid ? "Invalid time" : ""}
                    error={!isValid}
                    label="Time"
                    variant="outlined"
                />
            )}
        />
    );
};

function generateTimeOptions(startTime?: Date, onlyToday?: boolean) {
    const options = [];
    let currentHour = 0;
    if (startTime) currentHour = new Date(startTime).getHours();
    for (let hour = currentHour; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            options.push(timeString);
        }
    }
    if (onlyToday) return options;
    for (let hour = 0; hour < 24 - currentHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            options.push(timeString);
        }
    }
    return options;
}

export default TimePickerBasic;
