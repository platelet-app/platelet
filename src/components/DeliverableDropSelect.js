import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

export default function DeliverableDropSelect(props) {
    const classes = useStyles();
    let result = props.availableDeliverables.filter(item => item.name === props.deliverableType);
    const [values, setValues] = React.useState({
        deliverable: result.length === 1 ? result[0].id : null
    });


    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    const handleChange = event => {
        setValues(oldValues => ({
            ...oldValues,
            [event.target.name]: event.target.value,
        }));
        props.onSelect(props.uuid, event.target.value);
    };

    let menuItems = [];
    for (const item of props.availableDeliverables) {
        menuItems.push(<MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)
    }

    return (
        <form className={classes.root} autoComplete="off">
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} htmlFor="outlined-deliverable">
                    Deliverable
                </InputLabel>
                <Grid spacing={8} container direction={"row"} justify={"space-between"} alignItems={"center"}>
                    <Grid item>
                        <Select
                            value={values.deliverable}
                            onChange={handleChange}
                            labelWidth={labelWidth}
                            inputProps={{
                                name: 'deliverable',
                                id: 'outlined-deliverable',
                            }}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {menuItems}
                        </Select>
                    </Grid>
                    <Grid item>
                        <TextField label={"Description"}/>
                    </Grid>
                </Grid>
            </FormControl>
        </form>
    );
}