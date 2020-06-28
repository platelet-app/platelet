import Grid from "@material-ui/core/Grid";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Button from "@material-ui/core/Button";
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
                        if (props.onHitEnter)
                            props.onHitEnter(ev);
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
                        >
                            {showPassword ? <Visibility/> : <VisibilityOff/>}
                        </IconButton>
                    </InputAdornment>
                }
                labelWidth={70}
            />
        </FormControl>
    )
}