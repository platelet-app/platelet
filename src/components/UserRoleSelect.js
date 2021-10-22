import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { userRoles } from "../apiConsts";
import PropTypes from "prop-types";

function UserRoleSelect(props) {
    const handleChange = (event) => {
        props.onSelect(event.target.value);
    };

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="select-user-roles-label">Role</InputLabel>
                <Select
                    labelId="select-user-roles-label"
                    id="select-user-roles"
                    value={props.value}
                    label="Role"
                    onChange={handleChange}
                >
                    {Object.entries(userRoles)
                        .filter(
                            ([key, value]) => !props.exclude.includes(value)
                        )
                        .map(([key, value]) => (
                            <MenuItem value={value}>
                                {key.toUpperCase()}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>
        </Box>
    );
}

UserRoleSelect.propTypes = {
    value: PropTypes.oneOf(Object.values(userRoles)),
    exclude: PropTypes.arrayOf(PropTypes.oneOf(Object.values(userRoles))),
    onSelect: PropTypes.func,
};

UserRoleSelect.defaultProps = {
    value: null,
    exclude: [],
    onSelect: () => {},
};

export default UserRoleSelect;
