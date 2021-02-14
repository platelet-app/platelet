import makeStyles from "@material-ui/core/styles/makeStyles";

export const dialogComponent = makeStyles(theme => ({
    fullWidth: {
        display: "flex",
        width: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
    },
    statusBar: {
        padding: "10px",
        display: "flex",
        width: "100%",
        paddingLeft: "15px",
        paddingRight: "15px",
        background: theme.palette.background.paper
    }
}));
