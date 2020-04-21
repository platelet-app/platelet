import React, {useState} from "react";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {TextFieldUncontrolled} from "../components/TextFieldControlled";
import Button from "@material-ui/core/Button";
import {PaddedPaper} from "../css/common";

export default function ApiConfig(props) {
    const [URL, setURL] = useState("");
    return (
        <PaddedPaper>
            <Grid container spacing={3} direction={"column"}>
                <Grid item>
                    <Typography>Enter your organisation's URL.</Typography>
                </Grid>
                <Grid item>
                    <TextFieldUncontrolled
                        label={"Here"}
                        value={URL}
                        onChange={(e) => setURL(e.target.value)}
                        onPressEnter={() => props.onSelect(URL)}
                    />
                </Grid>
                <Grid item>
                    <Button disabled={(!URL.length)} onClick={() => props.onSelect(URL)}>Save</Button>
                </Grid>
            </Grid>
        </PaddedPaper>
    )
}
