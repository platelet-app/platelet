import React from "react";
import PropTypes from "prop-types";
import LabelItemPair from "../../../components/LabelItemPair";
import {
    Stack,
    IconButton,
    Typography,
    Tooltip,
    Button,
    TextField,
    useMediaQuery,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import FavouriteLocationsSelect from "../../../components/FavouriteLocationsSelect";
import * as models from "../../../models";
import { useTheme } from "@mui/styles";

function TaskDetailsEstablishment({ value, onChange }) {
    const [editMode, setEditMode] = React.useState(false);
    const [notListedName, setNotListedName] = React.useState("");
    const [editValue, setEditValue] = React.useState(null);
    const [notListedMode, setNotListedMode] = React.useState(false);
    const theme = useTheme();

    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    const handleConfirm = () => {
        if (notListedMode) {
            const newEstablishment = new models.Location({
                name: notListedName,
                listed: 0,
            });
            onChange(newEstablishment);
        } else {
            onChange(editValue);
        }
        setEditMode(false);
        setEditValue(null);
        setNotListedMode(false);
        setNotListedName("");
    };

    const handleCancel = () => {
        setEditMode(false);
        setEditValue(null);
        setNotListedMode(false);
        setNotListedName("");
    };

    const onSelect = (newValue) => {
        setEditValue(newValue);
    };

    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={1}
        >
            <LabelItemPair label={"Establishment"}>
                <Typography
                    sx={{
                        fontStyle: value ? "normal" : "italic",
                    }}
                >
                    {value && value.name ? value.name : "Unset"}
                </Typography>
            </LabelItemPair>
            <Tooltip title={"Edit"}>
                <IconButton
                    onClick={() => setEditMode((prevState) => !prevState)}
                    aria-label="edit establishment"
                    size={"small"}
                >
                    <EditIcon />
                </IconButton>
            </Tooltip>
            <ConfirmationDialog
                onCancel={handleCancel}
                fullScreen={isSm}
                onConfirmation={handleConfirm}
                open={editMode}
                disabled={
                    (!notListedMode && !editValue) ||
                    (notListedMode && !notListedName)
                }
            >
                <Stack
                    sx={{ marginTop: 1, minWidth: isSm ? 240 : 340 }}
                    alignItems="flex-end"
                    direction="column"
                    spacing={1}
                >
                    {!notListedMode && (
                        <FavouriteLocationsSelect
                            label="Select establishment"
                            size="large"
                            onSelect={onSelect}
                        />
                    )}
                    {notListedMode && (
                        <TextField
                            fullWidth
                            label="Name"
                            inputProps={{
                                "aria-label": "establishment name",
                            }}
                            value={notListedName}
                            onChange={(e) => setNotListedName(e.target.value)}
                        />
                    )}
                    <Button
                        onClick={() =>
                            setNotListedMode((prevState) => !prevState)
                        }
                        aria-label="establishment not listed?"
                    >
                        {notListedMode ? "Back" : "Not listed?"}
                    </Button>
                </Stack>
            </ConfirmationDialog>
        </Stack>
    );
}

TaskDetailsEstablishment.propTypes = {
    value: PropTypes.object,
    onChange: PropTypes.func,
};

TaskDetailsEstablishment.defaultProps = {
    value: null,
    onChange: () => {},
};

export default TaskDetailsEstablishment;
