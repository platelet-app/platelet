import React, { useEffect, useState } from "react";
import { Chip, Stack } from "@mui/material";
import * as models from "../models";

type PrioritySelectProps = {
    priority?: models.Priority | null;
    onSelect: (value: models.Priority | null) => void;
    disabled?: boolean;
};

const PrioritySelect: React.FC<PrioritySelectProps> = ({
    priority = null,
    onSelect,
    disabled = false,
}) => {
    const [state, setState] = useState<models.Priority | null>(null);

    const handleChange = (value: models.Priority | null) => {
        const result = value === state ? null : value;
        setState(result);
        onSelect(result);
    };

    useEffect(() => setState(priority), [priority]);
    return (
        <Stack direction="row-reverse" spacing={1}>
            {Object.values(models.Priority).map((priority) => (
                <Chip
                    key={priority}
                    disabled={disabled}
                    data-cy={`new-task-priority-${priority}`}
                    variant={state === priority ? "filled" : "outlined"}
                    label={priority}
                    onClick={() => handleChange(priority)}
                    color={state === priority ? "primary" : "default"}
                />
            ))}
        </Stack>
    );
};
PrioritySelect.defaultProps = {
    priority: null,
    onSelect: () => {},
    disabled: false,
};
export default PrioritySelect;
