import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";

import { LocationDropdownSelector } from "./components/LocationDropdownSelector";
import { ManualAddress } from "./components/ManualAddress";

import { Styles } from "./styles";

export const Step3 = ({
    values,
    onSelectDropoffLocation,
    onSelectDropoffTime,
    onSelectPickupLocation,
    onSelectPickupTime,
}) => {
    const classes = Styles();

    const [showPickUpDropdown, setShowPickUpDropdown] = useState(true);
    const [showDropOffDropdown, setShowDropOffDropdown] = useState(true);

    return (
        <Scrollbars autoHide autoHeight autoHeightMin={450} autoHeightMax={350}>
            <div className={classes.columnWrapper}>
                <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>
                        {"Pick-up"}
                    </Typography>
                    <div className={classes.flexWrapper}>
                        <Button
                            style={{ marginBottom: "20px" }}
                            onClick={() =>
                                setShowPickUpDropdown((state) => !state)
                            }
                        >
                            {showPickUpDropdown
                                ? "Enter address manually"
                                : "Look up from the list"}
                        </Button>

                        {showPickUpDropdown ? (
                            <LocationDropdownSelector
                                onSelectLocation={onSelectPickupLocation}
                                location={values.pickUpLocation}
                                label="Location"
                            />
                        ) : (
                            <ManualAddress />
                        )}

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={"Time and date"}
                                value={values.pickUpTime}
                                onChange={(value) => onSelectPickupTime(value)}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                </div>

                <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>
                        {"Drop-off"}
                    </Typography>
                    <div className={classes.flexWrapper}>
                        <Button
                            style={{ marginBottom: "20px" }}
                            onClick={() =>
                                setShowDropOffDropdown((state) => !state)
                            }
                        >
                            {showDropOffDropdown
                                ? "Enter address manually"
                                : "Look up from the list"}
                        </Button>

                        {showDropOffDropdown ? (
                            <LocationDropdownSelector
                                onSelectLocation={onSelectDropoffLocation}
                                location={values.dropOffLocation}
                                label="Location"
                            />
                        ) : (
                            <ManualAddress />
                        )}

                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label={"Time and date"}
                                value={values.dropOffTime}
                                onChange={(value) => onSelectDropoffTime(value)}
                                renderInput={(params) => (
                                    <TextField {...params} />
                                )}
                            />
                        </LocalizationProvider>
                    </div>
                </div>
            </div>
        </Scrollbars>
    );
};
