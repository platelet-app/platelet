import React from "react";
import Typography from "@mui/material/Typography";

import { Styles } from "./styles";
import RiderPicker from "../../components/RiderPicker";

export const Step4 = () => {
    const classes = Styles();

    return (
        <div className={classes.wrapper}>
            <Typography variant="h6" gutterBottom>
                {"Potential Riders"}
            </Typography>
            <div>
                <RiderPicker />
            </div>
        </div>
    );
};
