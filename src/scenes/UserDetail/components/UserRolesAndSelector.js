import { Chip } from "@mui/material";
import React from "react";
import { userRoles } from "../../../apiConsts";

function UserRolesAndSelector(props) {
    if (props.selectMode) {
        return Object.values(userRoles).map((role) => {
            return (
                <Chip
                    variant={
                        props.value.includes(role) ? "default" : "outlined"
                    }
                    disabled={[userRoles.user].includes(role)}
                    color={props.value.includes(role) ? "primary" : "default"}
                    key={role}
                    label={role}
                    onClick={() => props.onSelect(role)}
                />
            );
        });
    } else {
        return props.value.map((role) => <Chip key={role} label={role} />);
    }
}

export default UserRolesAndSelector;
