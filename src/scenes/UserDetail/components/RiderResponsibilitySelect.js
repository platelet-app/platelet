import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataStore } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as models from "../../../models/index";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";
import PropTypes from "prop-types";

function RiderResponsibilitySelect(props) {
    const [responsibilities, setResponsibilities] = useState([]);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    async function getResponsibilities() {
        if (!dataStoreReadyStatus) return;
        const responsibilities = await DataStore.query(
            models.RiderResponsibility
        );
        setResponsibilities(responsibilities);
    }
    useEffect(() => getResponsibilities(), [dataStoreReadyStatus]);

    const handleChange = (event) => {
        props.onSelect(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 160 }}>
            <FormControl fullWidth>
                <InputLabel id="select-rider-responsibilities-label">
                    Responsibility
                </InputLabel>
                <Select
                    disabled={props.disabled}
                    labelId="select-rider-responsibilities-label"
                    id="select-rider-responsibilities"
                    value={props.value}
                    label="Responsibility"
                    onChange={handleChange}
                >
                    <MenuItem key={"none"} value={null}>
                        None
                    </MenuItem>
                    {responsibilities
                        .filter((value) => !props.exclude.includes(value.id))
                        .map((value) => (
                            <MenuItem key={value.id} value={value.id}>
                                {value.label}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Box>
    );
}

RiderResponsibilitySelect.propTypes = {
    exclude: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func,
    value: PropTypes.string,
    disabled: PropTypes.bool,
};

RiderResponsibilitySelect.defaultProps = {
    exclude: [],
    onSelect: () => {},
    value: null,
    disabled: false,
};

export default RiderResponsibilitySelect;
