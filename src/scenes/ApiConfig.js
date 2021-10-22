import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import {TextFieldUncontrolled} from "../components/TextFields";
import Button from "@mui/material/Button";
import {PaddedPaper} from "../styles/common";

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
