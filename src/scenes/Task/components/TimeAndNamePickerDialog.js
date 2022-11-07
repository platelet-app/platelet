import React from "react";
import PropTypes from "prop-types";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import { DateTimePicker } from "@mui/lab";
import { Stack, TextField, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";

function TimeAndNamePickerDialog({
    open,
    time,
    name,
    onConfirmation,
    onCancel,
    label,
    nameLabel,
    disableFuture,
    disabled,
}) {
    const [state, setState] = React.useState({
        time: new Date(time),
        name,
    });
    const [errorState, setErrorState] = React.useState(false);
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <ConfirmationDialog
            onCancel={onCancel}
            disabled={errorState || disabled}
            fullScreen={isSm}
            open={open}
            onConfirmation={() => onConfirmation(state)}
        >
            <Stack sx={{ minWidth: 300 }} spacing={3}>
                <DateTimePicker
                    label={label}
                    value={state.time}
                    onError={() => setErrorState(true)}
                    disableFuture={disableFuture}
                    inputFormat={"dd/MM/yyyy HH:mm"}
                    openTo="hours"
                    onChange={(value) => {
                        setState((prevState) => ({
                            ...prevState,
                            time: value,
                        }));
                        setErrorState(false);
                    }}
                    renderInput={(params) => (
                        <TextField fullWidth {...params} />
                    )}
                />
                <TextField
                    onChange={(e) => {
                        const { value } = e.target;
                        setState((prevState) => ({
                            ...prevState,
                            name: value,
                        }));
                    }}
                    inputProps={{
                        "aria-label": nameLabel,
                    }}
                    value={state.name}
                    label={nameLabel}
                />
            </Stack>
        </ConfirmationDialog>
    );
}

TimeAndNamePickerDialog.propTypes = {
    open: PropTypes.bool,
    time: PropTypes.string.isRequired,
    name: PropTypes.string,
    onConfirmation: PropTypes.func,
    onCancel: PropTypes.func,
    label: PropTypes.string,
    nameLabel: PropTypes.string,
    disableFuture: PropTypes.bool,
    disabled: PropTypes.bool,
};

TimeAndNamePickerDialog.defaultProps = {
    open: false,
    name: "",
    onConfirmation: () => {},
    onCancel: () => {},
    label: "",
    nameLabel: "",
    disableFuture: false,
    disabled: false,
};

export default TimeAndNamePickerDialog;
