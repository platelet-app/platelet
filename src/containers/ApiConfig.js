import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {TextFieldUncontrolled} from "../components/TextFieldControlled";
import Button from "@material-ui/core/Button";
import {useDispatch} from "react-redux";
import {setApiURL} from "../redux/login/Actions";

export default function ApiConfig(props) {
    const dispatch = useDispatch();
    const [URL, setURL] = useState("");
    return (
    <Grid container spacing={3}>
        <Grid item>
            <Typography>Enter your organisation's URL.</Typography>
        </Grid>
        <Grid item>
            <TextFieldUncontrolled
                value={URL}
                onChange={(e) => setURL(e.target.value)}
            />
        </Grid>
        <Grid item>
            <Button onClick={() => props.onSelect(URL)}>Save</Button>
        </Grid>
    </Grid>
    )
}
