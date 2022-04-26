import { Chip, Grid } from "@mui/material";
import PropTypes from "prop-types";
import React from "react";

function CurrentRiderResponsibilitySelector(props) {
    const { available } = props;
    const { value } = props;

    function handleChange(newValue) {
        if (value === newValue) newValue = null;
        props.onChange(newValue);
    }

    return (
        <Grid container spacing={1}>
            {available.map((resp) => (
                <Grid item key={resp.id}>
                    <Chip
                        sx={{ maxWidth: 300, height: 40 }}
                        label={resp.label}
                        key={resp.id}
                        variant={value === resp.label ? "default" : "outlined"}
                        color={value === resp.label ? "primary" : "default"}
                        onClick={() => handleChange(resp.label)}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

CurrentRiderResponsibilitySelector.defaultProps = {
    available: [],
    value: null,
    onChange: () => {},
};

CurrentRiderResponsibilitySelector.propTypes = {
    available: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ),
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string,
};

export default CurrentRiderResponsibilitySelector;
