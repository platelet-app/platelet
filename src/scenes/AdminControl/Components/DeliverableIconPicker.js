import { Grid, IconButton } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import React from "react";
import { deliverableIcons } from "../../../apiConsts";
import { getDeliverableIconByEnum } from "../../../utilities";
import PropTypes from "prop-types";

const useStyles = makeStyles()((theme) => ({
    selection: {
        background: theme.palette.background.default,
        borderRadius: 6,
    },
}));
function DeliverableIconPicker(props) {
    const { classes } = useStyles();
    return (
        <Grid container>
            {Object.values(deliverableIcons).map((icon) => {
                return (
                    <Grid
                        key={icon}
                        className={
                            props.value === icon ? classes.selection : ""
                        }
                        item
                    >
                        <IconButton
                            disabled={props.value === icon}
                            onClick={() => props.onChange(icon)}
                            size="large"
                        >
                            {getDeliverableIconByEnum(icon, 6)}
                        </IconButton>
                    </Grid>
                );
            })}
        </Grid>
    );
}

DeliverableIconPicker.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.string,
};

DeliverableIconPicker.defaultProps = {
    onChange: () => {},
    value: null,
};

export default DeliverableIconPicker;
