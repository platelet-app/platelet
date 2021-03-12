import makeStyles from "@material-ui/core/styles/makeStyles";

export const dialogCardStyles = makeStyles(theme => ({
    root: {
        padding: 20,
        width: "100%",
        minWidth: 400,
        minHeight: 410,
        [theme.breakpoints.down("md")]: {
            padding: 10
        },
    }
}));
