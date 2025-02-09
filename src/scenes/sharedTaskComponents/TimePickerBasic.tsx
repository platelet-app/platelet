import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { styled } from "@mui/styles";

type TimePickerBasicProps = {
    value: string;
    onChange: (value: string) => void;
    isValid?: boolean;
    showOnlyTodayTimes?: boolean;
    startValue?: string;
    showPlusOneDay?: boolean;
    label?: string;
};

const CustomTextField = styled(TextField)({
    "& .MuiFormHelperText-root": {
        position: "absolute",
        top: "100%",
    },
});

const TimePickerBasic: React.FC<TimePickerBasicProps> = ({
    value,
    onChange,
    isValid,
    showOnlyTodayTimes = false,
    startValue,
    showPlusOneDay = false,
    label = "Time",
}) => {
    const timeOptions = generateTimeOptions(startValue, showOnlyTodayTimes);

    const handleInputChange = (_: any, newInputValue: string) => {
        // Regular expression to allow only numbers and colons, with a maximum length of 5
        const validInput = newInputValue.replace(/[^0-9:]/g, "").slice(0, 5);
        onChange(validInput);
    };

    let helperText = "";
    if (showPlusOneDay) {
        helperText = "+1 day";
    } else if (!isValid) {
        helperText = "Invalid time";
    }

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
                <CustomTextField
                    {...params}
                    helperText={helperText}
                    error={!isValid}
                    label={label}
                    variant="outlined"
                    sx={{
                        helperText: {
                            "& .MuiFormHelperText-root": {
                                height: "0",
                                marginTop: "0",
                            },
                        },
                    }}
                />
            )}
        />
    );
};

function generateTimeOptions(startTime?: string, onlyToday?: boolean) {
    const options = [];
    let currentHour = 0;
    if (startTime) {
        currentHour = parseInt(startTime.split(":")[0]);
    } else if (onlyToday) {
        currentHour = new Date().getHours();
    }
    for (let hour = currentHour; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            options.push(timeString);
        }
    }
    if (onlyToday) return options;
    for (let hour = 0; hour < 24 - (24 - currentHour); hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`;
            options.push(timeString);
        }
    }
    console.log("options", options);
    return options;
}

export default TimePickerBasic;
