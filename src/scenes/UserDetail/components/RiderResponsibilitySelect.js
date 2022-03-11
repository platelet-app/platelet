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
        try {
            const responsibilities = await DataStore.query(
                models.RiderResponsibility
            );
            setResponsibilities(responsibilities);
        } catch (error) {
            console.log(error);
        }
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
                    value={props.value || 0}
                    label="Responsibility"
                    onChange={handleChange}
                >
                    <MenuItem key={"none"} value={null}>
                        None
                    </MenuItem>
                    {responsibilities
                        .filter((value) => !props.exclude.includes(value.label))
                        .map((value) => (
                            <MenuItem key={value.label} value={value.label}>
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
    value: PropTypes.object,
    disabled: PropTypes.bool,
};

RiderResponsibilitySelect.defaultProps = {
    exclude: [],
    onSelect: () => {},
    value: { id: 0 },
    disabled: false,
};

export default RiderResponsibilitySelect;
