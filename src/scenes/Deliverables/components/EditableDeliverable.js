import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import DeliverableCard from "./DeliverableCard";
import IncreaseDecreaseCounter from "../../../components/IncreaseDecreaseCounter";
import UnitSelector from "../../../components/UnitSelector";
import _ from "lodash";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { makeStyles } from 'tss-react/mui';
import ArchitectureIcon from "@mui/icons-material/Architecture";

const useStyles = makeStyles()((theme) => ({
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
    const [showUnit, setShowUnit] = useState(false);
    const { classes } = useStyles();

    function handleCloseUnit() {
        setShowUnit((prevState) => !prevState);
    }

    const handleChange = useRef(
        _.debounce((deliverableId, count) => {
            props.onChangeCount(deliverableId, count);
        }, 500),
        []
    );

    return (
        <>
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
                            disabled={props.disabled}
                            onChange={(count) =>
                                handleChange.current(deliverable.id, count)
                            }
                            onDelete={() => props.onDelete(deliverable.id)}
                        />
                    </Stack>
                </Stack>
            </DeliverableCard>
            {showUnit && (
                <UnitSelector
                    value={deliverable.unit}
                    onChange={(unit) =>
                        props.onChangeUnit(deliverable.id, unit)
                    }
                />
            )}
        </>
    );
}

EditableDeliverable.propTypes = {
    deliverable: PropTypes.object,
    onChangeCount: PropTypes.func,
    disabled: PropTypes.bool,
    onDelete: PropTypes.func,
};

EditableDeliverable.defaultProps = {
    onChangeCount: () => {},
    disabled: false,
    deliverable: { id: "", label: "None", deliverableType: { icon: "" } },
    onDelete: () => {},
};

export default EditableDeliverable;
