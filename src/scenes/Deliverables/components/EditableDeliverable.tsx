import React, { useRef, useState } from "react";
import * as models from "../../../models";
import DeliverableCard from "./DeliverableCard";
import IncreaseDecreaseCounter from "../../../components/IncreaseDecreaseCounter";
import UnitSelector from "../../../components/UnitSelector";
import _ from "lodash";
import { IconButton, Stack, Tooltip } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import ArchitectureIcon from "@mui/icons-material/Architecture";
import { BasicDeliverableType } from "../DeliverableGridSelect";

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

type EditableDeliverableProps = {
    deliverable: BasicDeliverableType;
    onChangeCount?: (deliverableId: string, count: number) => void;
    onChangeUnit?: (
        deliverableId: string,
        unit: models.DeliverableUnit
    ) => void;
    disabled?: boolean;
    onDelete?: (deliverableId: string) => void;
};

const EditableDeliverable: React.FC<EditableDeliverableProps> = ({
    deliverable,
    onChangeCount,
    onChangeUnit,
    disabled,
    onDelete,
}) => {
    const [showUnit, setShowUnit] = useState(false);
    const { classes } = useStyles();

    function handleCloseUnit() {
        setShowUnit((prevState) => !prevState);
    }

    const handleChange = useRef(
        _.debounce((deliverableId, count) => {
            if (onChangeCount) onChangeCount(deliverableId, count);
        }, 500)
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
                            disabled={disabled}
                            onChange={(count) =>
                                handleChange.current(deliverable.id, count)
                            }
                            onDelete={() => {
                                if (onDelete) onDelete(deliverable.id);
                            }}
                        />
                    </Stack>
                </Stack>
            </DeliverableCard>
            {showUnit && (
                <UnitSelector
                    value={deliverable.unit}
                    onChange={(unit: models.DeliverableUnit) => {
                        if (onChangeUnit) onChangeUnit(deliverable.id, unit);
                    }}
                />
            )}
        </>
    );
};

export default EditableDeliverable;
