import {makeStyles} from "@material-ui/core/styles";

const contextMenuStyles = makeStyles(theme => ({
    deleteButton: {
        display: "inherit",
        color: "rgb(235, 86, 75)"
    },
    deleteButtonDisabled: {
        display: "none",
    }
}));

export default contextMenuStyles;
