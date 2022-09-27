import { Stack, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import EditModeToggleButton from "../../../components/EditModeToggleButton";
import RiderResponsibilitySelect from "./RiderResponsibilitySelect";

interface RiderResponsibilityDetailPropsInterface {
    value: string | null;
    onSelect: (value: string | null) => void;
}

const RiderResponsibilityDetail: React.FC<RiderResponsibilityDetailPropsInterface> =
    ({ value, onSelect }) => {
        const [editMode, setEditMode] = React.useState(false);
        const [selectValue, setSelectValue] = React.useState<string | null>(
            value
        );

        const handleSelect = (value: string | null) => {
            setSelectValue(value);
        };
        const theme = useTheme();
        const isSm = useMediaQuery(theme.breakpoints.down("sm"));

        return (
            <Stack direction="row" alignItems="center" spacing={1}>
                <Typography sx={{ fontStyle: value ? "normal" : "italic" }}>
                    {value || "Unset"}
                </Typography>
                <EditModeToggleButton
                    aria-label="edit rider role"
                    onChange={(v) => setEditMode(v)}
                    value={editMode}
                />
                <ConfirmationDialog
                    open={editMode}
                    dialogTitle="Set rider role"
                    fullScreen={isSm}
                    onConfirmation={() => onSelect(selectValue)}
                    onCancel={() => setEditMode(false)}
                >
                    <RiderResponsibilitySelect
                        value={selectValue}
                        onSelect={handleSelect}
                    />
                </ConfirmationDialog>
            </Stack>
        );
    };

export default RiderResponsibilityDetail;
