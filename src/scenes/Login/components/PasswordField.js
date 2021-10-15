import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import React, {useState} from "react";

export default function PasswordField(props) {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">{props.label || "Password"}</InputLabel>
            <OutlinedInput
                id="outlined-adornment-password"
                onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                        if (props.onPressEnter)
                            props.onPressEnter(ev);
                        ev.preventDefault();
                    }
                }}
                type={showPassword ? 'text' : 'password'}
                value={props.password}
                disabled={props.disabled}
                onChange={(e) => {
                    props.onChange(e);
                }}
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                            size="large">
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
            />
        </FormControl>
    );
}
