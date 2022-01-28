import React from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

import { Styles } from "./styles";
import DeliverableGridSelect from "../Deliverables/DeliverableGridSelect";

export const Step2 = ({ values, onChange, onSelect, taskUUID }) => {
    const classes = Styles();
    return (
        <Scrollbars autoHide autoHeight autoHeightMin={450} autoHeightMax={350}>
            <div className={classes.columnWrapper}>
                <div classes={classes.block}>
                    <DeliverableGridSelect />
                </div>
            </div>
        </Scrollbars>
    );
};
