import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import React from "react";
import PropTypes from "prop-types"

function LabelItemPair(props) {
    return (
        <Grid container direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
            <Grid item>
                <Typography>{props.label ? `${props.label}:` : ""}</Typography>
            </Grid>
            <Grid item>
                {props.children}
            </Grid>
        </Grid>
    );
}

LabelItemPair.propTypes = {
    label: PropTypes.string
}

LabelItemPair.defaultProps = {
    label: ""
}

export default LabelItemPair;
