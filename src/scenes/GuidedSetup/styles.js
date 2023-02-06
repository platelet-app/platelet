import { makeStyles } from "tss-react/mui";

export const Styles = makeStyles()({
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
    },
    flexWrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
    },
});
