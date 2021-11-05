import React from "react";
import DeliverableGridSelect from "../../Deliverables/DeliverableGridSelect";
import PropTypes from "prop-types";
import { Divider, Paper, Stack, Typography } from "@mui/material";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { EditModeToggleButton } from "../../../components/EditModeToggleButton";

function DeliverableDetails(props) {
    const cardClasses = dialogCardStyles();
    const [collapsed, setCollapsed] = React.useState(true);

    const contents = collapsed ? (
        props.deliverables && props.deliverables.length === 0 ? (
            <Typography>No items.</Typography>
        ) : (
            props.deliverables.map((deliverable) => {
                const countString = `${deliverable.count} x ${deliverable.unit}`;
                return (
                    <Stack direction={"row"} justifyContent={"space-between"}>
                        <Typography>
                            {deliverable &&
                            deliverable.deliverableType &&
                            deliverable.deliverableType.label
                                ? deliverable.deliverableType.label
                                : "Unknown"}
                        </Typography>
                        <Typography>{countString}</Typography>
                    </Stack>
                );
            })
        )
    ) : (
        <DeliverableGridSelect
            deliverables={props.deliverables}
            taskUUID={props.taskUUID}
            onChange={props.onChange}
            onDelete={props.onDelete}
        />
    );
    return (
        <Paper className={cardClasses.root}>
            <Stack direction={"column"} justifyContent={"center"} spacing={1}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    <Typography variant={"h6"}>Inventory</Typography>
                    <EditModeToggleButton
                        value={!collapsed}
                        onChange={() => setCollapsed((prevState) => !prevState)}
                    />
                </Stack>
                <Divider />
                {contents}
            </Stack>
        </Paper>
    );
}

DeliverableDetails.propTypes = {
    deliverables: PropTypes.arrayOf(PropTypes.object),
    taskUUID: PropTypes.string,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
};

DeliverableDetails.defaultProps = {
    deliverables: [],
    taskUUID: "",
    onChange: () => {},
    onDelete: () => {},
};

export default DeliverableDetails;
