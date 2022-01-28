import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { Styles } from "./styles";
import { Button, TextField } from "@mui/material";
import { ManualAddress } from "./components/ManualAddress";
import { LocationDropdownSelector } from "./components/LocationDropdownSelector";
import DateTimePicker from "@mui/lab/DateTimePicker";

export const Step4 = ({
    onSelectDropOffLocation,
    onSelectDropOffTime,
    values,
}) => {
    const classes = Styles();
    const [showDropOffDropdown, setShowDropOffDropdown] = useState(true);

    return (
        <div className={classes.block}>
            <Typography variant="h6" gutterBottom>
                {"Where to?"}
            </Typography>
            <div className={classes.flexWrapper}>
                <Button
                    style={{ marginBottom: "20px" }}
                    onClick={() => setShowDropOffDropdown((state) => !state)}
                >
                    {showDropOffDropdown
                        ? "Enter address manually"
                        : "Look up from the list"}
                </Button>

                {showDropOffDropdown ? (
                    <LocationDropdownSelector
                        onSelectLocation={onSelectDropOffLocation}
                        location={values.dropOffLocation}
                        label="Location"
                    />
                ) : (
                    <ManualAddress />
                )}

                <DateTimePicker
                    label={"Time and date"}
                    value={values.dropOffTime}
                    onChange={(value) => onSelectDropOffTime(value)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </div>
        </div>
    );
};
