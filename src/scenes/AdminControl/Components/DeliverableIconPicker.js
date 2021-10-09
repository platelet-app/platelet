import { Grid } from "@material-ui/core";
import React from "react";
import { deliverableIcons } from "../../../apiConsts";
import { getDeliverableIconByEnum } from "../../../utilities";

function DeliverableIconPicker(props) {
    return (
        <Grid spacing={1} container>
            {Object.values(deliverableIcons).map((icon) => {
                return <Grid item>{getDeliverableIconByEnum(icon, 6)}</Grid>;
            })}
        </Grid>
    );
}

export default DeliverableIconPicker;
