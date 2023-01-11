import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Chip, Stack } from "@mui/material";
import * as models from "../../../models";

function PrioritySelect(props) {
    const [state, setState] = useState(null);

    const handleChange = (value) => {
        const result = value === state ? null : value;
        setState(result);
        props.onSelect(result);
    };

    useEffect(() => setState(props.priority), [props.priority]);

    return (
        <Stack direction="row-reverse" spacing={1}>
            {Object.values(models.Priority).map((priority) => (
                <Chip
                    key={priority}
                    disabled={props.disabled}
                    data-cy={`new-task-priority-${priority}`}
                    variant={state === priority ? "default" : "outlined"}
                    label={priority}
                    onClick={() => handleChange(priority)}
                    color={state === priority ? "primary" : "default"}
                />
            ))}
        </Stack>
    );
}

PrioritySelect.propTypes = {
    priority: PropTypes.string,
    onSelect: PropTypes.func,
    disabled: PropTypes.bool,
};

PrioritySelect.defaultProps = {
    priority: null,
    onSelect: () => {},
    disabled: false,
};

export default PrioritySelect;
