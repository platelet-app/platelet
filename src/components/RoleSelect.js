import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function RoleSelect(props) {
    const [value, setValue] = React.useState(props.value || null);
    const myRoles = useSelector(state => state.whoami.user.roles);

    const handleChange = event => {
        let result = myRoles.find(item => item === event.target.value);
        if (result) {
            props.onSelect(event.target.value);
            setValue(result)
        }
    };

    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label="role" name="role" value={value} onChange={handleChange}>
                {myRoles.map((role) =>
                    (<FormControlLabel key={role} value={role} control={<Radio/>} label={role}/>)
                )}
            </RadioGroup>
        </FormControl>
    )

}
