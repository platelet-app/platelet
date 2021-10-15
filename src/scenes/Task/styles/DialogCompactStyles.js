import makeStyles from '@mui/styles/makeStyles';

export const dialogCardStyles = makeStyles((theme) => ({
    root: {
        padding: 20,
        width: "100%",
        maxWidth: 400,
        [theme.breakpoints.down('lg')]: {
            padding: 5,
        },
    },
}));
