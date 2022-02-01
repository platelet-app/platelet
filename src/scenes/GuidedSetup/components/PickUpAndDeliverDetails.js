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
import LocationDetailAndSelector from "../../Task/components/LocationDetailAndSelector";
import { Stack } from "@mui/material";

export const PickUpAndDeliverDetails = ({
    values,
    onSelectPickupLocation,
    onSelectDropOffLocation,
    onSelectPickupTime,
}) => {
    const classes = Styles();

    const [showPickUpDropdown, setShowPickUpDropdown] = useState(true);

    const handleSelectLocation = (location) => {
        onSelectPickupLocation(location);
    };

    return (
        <Stack spacing={1}>
            <Typography variant="h6">Where from?</Typography>
            <FavouriteLocationsSelect onSelect={onSelectPickupLocation} />
            <Typography variant="h6">Where to?</Typography>
            <FavouriteLocationsSelect onSelect={onSelectDropOffLocation} />
        </Stack>
    );
};
