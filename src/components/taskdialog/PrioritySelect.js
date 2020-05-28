import React from 'react';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from '@material-ui/core/FormControl';
import RadioGroup from "@material-ui/core/RadioGroup";
import Radio from "@material-ui/core/Radio"
import {useSelector} from "react-redux";
import {useEffect} from 'react'

export default function PrioritySelect(props) {
    const [value, setValue] = React.useState(props.priority || null);
    const availablePriorities = useSelector(state => state.availablePriorities.priorities);

    const handleChange = event => {
        let result = availablePriorities.filter(item => item.id == event.target.value);
        if (result.length === 1) {
            props.onSelect(event.target.value, result[0].label);
            setValue(result[0].id)
        }
    };
    useEffect(() => {
        if (props.priority)
                setValue(parseInt(props.priority))
    }, [props.priority])

    return (
        <FormControl component="fieldset">
            <RadioGroup aria-label="priority" name="priority" value={value} onChange={handleChange}>
                {availablePriorities.map((priority) =>
                    (<FormControlLabel value={priority.id} control={<Radio/>} label={priority.label}/>)
                )}
            </RadioGroup>
        </FormControl>
        )

        //<form className={classes.root} autoComplete="off">
        //    <FormControl variant="outlined" className={classes.formControl}>
        //        <InputLabel ref={inputLabel} htmlFor="outlined-age-simple">
        //            Priority
        //        </InputLabel>
        //        <Select
        //            value={value || ""}
        //            onChange={handleChange}
        //            labelWidth={labelWidth}
        //            inputProps={{
        //                name: 'priority',
        //                id: 'outlined-priority',
        //            }}
        //        >
        //            <MenuItem value="">
        //                <em>None</em>
        //            </MenuItem>
        //            {menuItems}
        //        </Select>
        //    </FormControl>
        //</form>
}