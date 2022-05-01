import makeStyles from "@mui/styles/makeStyles";

export const dialogCardStyles = makeStyles((theme) => ({
    root: {
        padding: 15,
        width: "100%",
        maxWidth: 400,
        [theme.breakpoints.down("sm")]: {
            maxWidth: "100%",
        },
    },
}));
