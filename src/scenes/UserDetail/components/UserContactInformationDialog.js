import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useState } from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";
import { userContactFields } from "./UserProfile";

function UserContactInformationDialog({ values, onChange }) {
    const [state, setState] = useState(values);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    function onChangeValues(data) {
        onChange({ ...state, ...data });
    }

    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            <TextField
                key={"name"}
                value={state.name}
                inputProps={{
                    "aria-label": "Name",
                }}
                fullWidth
                label={"Name"}
                onChange={(e) => {
                    const { value } = e.target;
                    setState((prevState) => ({
                        ...prevState,
                        name: value,
                    }));
                    onChangeValues({ ...state, name: value });
                }}
            />
            {Object.entries(userContactFields).map(([key, value]) => {
                return (
                    <TextFieldUncontrolled
                        key={key}
                        tel={
                            key === "telephoneNumber" || key === "mobileNumber"
                        }
                        value={state.contact[key]}
                        fullWidth
                        label={value}
                        inputProps={{
                            "aria-label": value,
                        }}
                        onChange={(e) => {
                            const { value } = e.target;
                            setState((prevState) => ({
                                ...prevState,
                                contact: { ...prevState.contact, [key]: value },
                            }));
                            onChangeValues({
                                contact: { ...state.contact, [key]: value },
                            });
                        }}
                    />
                );
            })}
        </Stack>
    );
}

export default UserContactInformationDialog;
