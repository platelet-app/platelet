import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

type TimePickerBasicProps = {
    value: string;
    onChange: (value: string) => void;
    isValid: boolean;
};

const TimePickerBasic: React.FC<TimePickerBasicProps> = ({
    value,
    onChange,
    isValid,
}) => {
    // Generate time options (same as before)
    const timeOptions = generateTimeOptions();

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
            inputValue={value} // Make sure inputValue is controlled
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

// Helper function to generate time options
function generateTimeOptions() {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            options.push(timeString); //  Store time strings directly in the array
        }
    }
    return options;
}

export default TimePickerBasic;
