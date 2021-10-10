import React, {useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';

export default function ToggleTimeStamp(props) {
    const [selected, setSelected] = useState(props.status);
        return (
            <div>
            <ToggleButton
                value="check"
                selected={selected}
                disabled={props.disabled}
                onChange={() => {
                    props.onSelect(!selected);
                    setSelected(!selected);
                }
                }
            >
                {selected ? "Undo" : props.label}
            </ToggleButton>
                </div>
        );

}