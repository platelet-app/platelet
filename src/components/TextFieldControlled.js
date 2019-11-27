import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";

export default function TextFieldControlled(props) {
    const [currentValue, setCurrentValue] = useState(props.value);
    return (
        <TextField
            margin="dense"
            id={props.label}
            label={props.label}
            type="text"
            fullWidth
            value={currentValue || ''}
            onSelect={props.onSelect}
            onChange={e => {
                setCurrentValue(e.target.value);
            }}
        />
    )
}