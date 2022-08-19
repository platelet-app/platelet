import React from "react";
import PropTypes from "prop-types";
import { Stack, TextField } from "@mui/material";
import DeliverableIconPicker from "./DeliverableIconPicker";
import UnitSelector from "../../../components/UnitSelector";
import DeliverableTypeTagger from "./DeliverableTypeTagger";

function AdminEditDeliverableType({ deliverableType, onChange }) {
    const [state, setState] = React.useState(deliverableType);
    const addTag = (tag) => {
        const result = { ...state, tags: [...state.tags, tag] };
        setState(result);
        onChange(result);
    };

    const removeTag = (tag) => {
        const result = { ...state, tags: state.tags.filter((t) => t !== tag) };
        setState(result);
        onChange(result);
    };

    if (!state) {
        return null;
    }
    return (
        <Stack spacing={3}>
            <TextField
                label="Label"
                inputProps={{
                    "aria-label": "edit label",
                }}
                value={state.label}
                onChange={(e) => {
                    setState({ ...state, label: e.target.value });
                    onChange({ ...state, label: e.target.value });
                }}
            />
            <DeliverableIconPicker
                value={state.icon}
                onChange={(icon) => {
                    setState((prevState) => ({
                        ...prevState,
                        icon,
                    }));
                    onChange({ ...state, icon });
                }}
            />
            <UnitSelector
                value={state.defaultUnit}
                label={"Default unit"}
                onChange={(value) => {
                    setState((prevState) => ({
                        ...prevState,
                        defaultUnit: value,
                    }));
                    onChange({ ...state, defaultUnit: value });
                }}
            />
            <DeliverableTypeTagger
                onAdd={addTag}
                onDelete={removeTag}
                value={state.tags}
            />
        </Stack>
    );
}

AdminEditDeliverableType.propTypes = {
    deliverableType: PropTypes.object,
    onChange: PropTypes.func,
};

AdminEditDeliverableType.defaultProps = {
    deliverableType: null,
    onChange: () => {},
};

export default AdminEditDeliverableType;
