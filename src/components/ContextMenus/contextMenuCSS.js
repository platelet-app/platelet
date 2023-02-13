import { makeStyles } from "tss-react/mui";

export const deleteButtonStyles = makeStyles()((theme) => ({
    deleteButton: {
        display: "inherit",
        color: "rgb(235, 86, 75)",
    },
    deleteButtonDisabled: {
        display: "none",
    },
}));
