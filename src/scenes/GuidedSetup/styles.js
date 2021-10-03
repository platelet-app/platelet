import { makeStyles } from '@material-ui/core/styles';

export const Styles = makeStyles(({
    wrapper: {
        marginTop: "30px",
        marginBottom: "30px",
    },
    columnWrapper: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        marginTop: "30px",
        marginBottom: "30px",
    },
    rowWrapper: {
        display: "flex",
        alignItems: "self-start",
        justifyContent: "space-evenly",
    },
    block: {
        marginBottom: "60px",
    }
}));
