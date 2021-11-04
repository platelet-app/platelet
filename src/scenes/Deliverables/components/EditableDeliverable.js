import React, { useState } from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import IncreaseDecreaseCounter from "../../../components/IncreaseDecreaseCounter";
import UnitSelector from "../../../components/UnitSelector";
import { IconButton, Stack, Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import ArchitectureIcon from "@mui/icons-material/Architecture";

const useStyles = makeStyles((theme) => ({
    button: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
    iconButton: {
        width: theme.spacing(4),
        height: theme.spacing(4),
    },
}));

function EditableDeliverable(props) {
    const deliverable = props.deliverable;
    console.log(deliverable.unit);
    const [showUnit, setShowUnit] = useState(false);
    const classes = useStyles();
    const unitSelect = showUnit ? (
        <UnitSelector
            value={deliverable.unit}
            onChange={(unit) =>
                props.onChangeUnit(deliverable.id, unit.target.value)
            }
        />
    ) : (
        <></>
    );
    function handleCloseUnit() {
        setShowUnit((prevState) => !prevState);
    }
    return (
        <DeliverableCard
            compact
            label={deliverable.label}
            icon={deliverable.icon}
        >
            <Stack direction={"column"}>
                <Stack direction={"row"}>
                    <Tooltip title={`${deliverable.unit}. Click to change`}>
                        <IconButton
                            onClick={handleCloseUnit}
                            className={classes.iconButton}
                            size="large"
                        >
                            <ArchitectureIcon className={classes.button} />
                        </IconButton>
                    </Tooltip>
                    <IncreaseDecreaseCounter
                        value={deliverable.count || 0}
                        disabled={props.isDeleting}
                        onChange={(count) =>
                            props.onChangeCount(deliverable.id, count)
                        }
                        onDelete={() => props.onDelete(deliverable.id)}
                    />
                </Stack>
                {unitSelect}
            </Stack>
        </DeliverableCard>
    );
}

EditableDeliverable.propTypes = {
    deliverable: PropTypes.object,
    onChangeCount: PropTypes.func,
    isDeleting: PropTypes.bool,
    isPosting: PropTypes.bool,
    onDelete: PropTypes.func,
};

EditableDeliverable.defaultProps = {
    onChangeCount: () => {},
    isDeleting: false,
    isPosting: false,
    deliverable: { id: "", label: "None", deliverableType: { icon: "" } },
    onDelete: () => {},
};

export default EditableDeliverable;
