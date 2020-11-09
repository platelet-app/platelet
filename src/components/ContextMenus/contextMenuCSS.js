import {makeStyles} from "@material-ui/core/styles";
import React from "react";

export const deleteButtonStyles = makeStyles(theme => ({
    deleteButton: {
        display: "inherit",
        color: "rgb(235, 86, 75)"
    },
    deleteButtonDisabled: {
        display: "none",
    }
}));

