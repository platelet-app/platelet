import React, { useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateTimePicker from "@mui/lab/DateTimePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";

import { ManualAddress } from "./ManualAddress";

import { Styles } from "../styles";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";

export const PickUpAndDeliverDetails = ({
    values,
    onSelectPickupLocation,
    onSelectPickupTime,
}) => {
    const classes = Styles();

    const [showPickUpDropdown, setShowPickUpDropdown] = useState(true);

    const handleSelectLocation = (location) => {
        onSelectPickupLocation(location);
    };

    return (
        <Scrollbars autoHide autoHeight autoHeightMin={450} autoHeightMax={350}>
            <div className={classes.columnWrapper}>
                <div className={classes.block}>
                    <Typography variant="h6" gutterBottom>
                        Where from?
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
                            <FavouriteLocationsSelect
                                onSelect={handleSelectLocation}
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
            </div>
        </Scrollbars>
    );
};
