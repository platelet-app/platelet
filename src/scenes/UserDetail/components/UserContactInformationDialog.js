import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import React, { useEffect, useState } from "react";
import { TextFieldUncontrolled } from "../../../components/TextFields";

const fields = {
    name: "Name",
    emailAddress: "Email Address",
    telephoneNumber: "Telephone",
    mobileNumber: "Mobile",
};

function UserContactInformationDialog({ values, onChange }) {
    const [state, setState] = useState(values);

    useEffect(() => {
        onChange({
            contact: {
                emailAddress: state.emailAddress,
                telephoneNumber: state.telephoneNumber,
                mobileNumber: state.mobileNumber,
            },
            name: state.name,
        });
    }, [state, onChange]);

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Stack sx={{ width: "100%", minWidth: isSm ? 0 : 400 }} spacing={1}>
            {Object.entries(fields).map(([key, value]) => {
                return (
                    <TextFieldUncontrolled
                        key={key}
                        tel={
                            key === "telephoneNumber" || key === "mobileNumber"
                        }
                        value={state[key]}
                        fullWidth
                        label={value}
                        id={key}
                        onChange={(e) => {
                            setState((prevState) => ({
                                ...prevState,
                                [key]: e.target.value,
                            }));
                        }}
                    />
                );
            })}
        </Stack>
    );
}

export default UserContactInformationDialog;
