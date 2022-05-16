import { Chip, Grid } from "@mui/material";
import { DataStore } from "aws-amplify";
import React, { useEffect, useRef, useState } from "react";
import * as models from "../../../models/index";
import PropTypes from "prop-types";

function RiderResponsibilitySelect(props) {
    const [responsibilities, setResponsibilities] = useState([]);
    const observer = useRef({ unsubscribe: () => {} });

    async function getResponsibilities() {
        observer.current = DataStore.observeQuery(
            models.RiderResponsibility
        ).subscribe(({ items }) => {
            setResponsibilities(items);
        });
        return () => observer.current.unsubscribe();
    }
    useEffect(() => getResponsibilities(), []);

    const valueIds = props.value.map((v) => v.id);

    const handleChange = (value) => {
        props.onSelect(value);
    };

    return (
        <Grid direction="row" spacing={1} container>
            {responsibilities
                .filter((value) => !props.exclude.includes(value.label))
                .map((value) => (
                    <Grid item key={value.label}>
                        <Chip
                            variant={
                                valueIds.includes(value.id)
                                    ? "default"
                                    : "outlined"
                            }
                            color={
                                valueIds.includes(value.id)
                                    ? "primary"
                                    : "default"
                            }
                            onClick={() => handleChange(value)}
                            label={value.label}
                        />
                    </Grid>
                ))}
        </Grid>
    );
}

RiderResponsibilitySelect.propTypes = {
    exclude: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func,
    value: PropTypes.array,
    disabled: PropTypes.bool,
};

RiderResponsibilitySelect.defaultProps = {
    exclude: [],
    onSelect: () => {},
    value: [],
    disabled: false,
};

export default RiderResponsibilitySelect;
