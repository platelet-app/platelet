import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React from "react";
import PropTypes from "prop-types"

function LabelItemPair(props) {
    return (
        <Grid container direction={"row"} justify={"space-between"} alignItems={"center"}>
            <Grid item>
                <Typography>{props.label}:</Typography>
            </Grid>
            <Grid item>
                {props.children}
            </Grid>
        </Grid>
    )
}

LabelItemPair.propTypes = {
    label: PropTypes.string
}

LabelItemPair.defaultProps = {
    label: ""
}

export default LabelItemPair;
