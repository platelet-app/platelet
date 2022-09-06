import makeStyles from "@mui/styles/makeStyles";

export const dialogCardStyles = makeStyles((theme) => ({
    root: {
        padding: 15,
        width: "100%",
        maxWidth: 400,
        borderRadius: "1em",
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
        },
    },
}));
