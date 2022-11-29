import { Divider, IconButton, Paper, Stack, Typography } from "@mui/material";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import React from "react";
import TaskHandoverCard from "./TaskHandoverCard";
import { dialogCardStyles } from "../styles/DialogCompactStyles";
import { useSelector } from "react-redux";
import { tenantIdSelector } from "../../../redux/Selectors";
import { convertListDataToObject } from "../../../utilities";
import _ from "lodash";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";

type TaskHandoversListProps = {
    taskId: string;
};

type TaskHandoverState = {
    [key: string]: models.Handover;
};

const TaskHandoversList: React.FC<TaskHandoversListProps> = ({ taskId }) => {
    const [handovers, setHandovers] = React.useState<TaskHandoverState>({});
    const [errorState, setErrorState] = React.useState<any | null>(null);
    const cardClasses = dialogCardStyles();
    const tenantId = useSelector(tenantIdSelector);
    const handoverSubscription = React.useRef({ unsubscribe: () => {} });

    const getHandovers = React.useCallback(async () => {
        try {
            const result = (await DataStore.query(models.Handover)).filter(
                (h) => h.task?.id === taskId
            );
            const handoverState = convertListDataToObject(
                result
            ) as TaskHandoverState;

            setHandovers(handoverState);
            handoverSubscription.current = DataStore.observe(
                models.Handover
            ).subscribe(async ({ opType, element }) => {
                // These ignores are in here because of DataStore not properly resolving relations
                // this can be removed once DataStore is upgraded
                // and the condition removed
                //
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                if (element.task || element.taskHandoversId) {
                    if (
                        element.task?.id === taskId ||
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        element.taskHandoversId === taskId
                    ) {
                        if (opType === "DELETE") {
                            setHandovers((prevState) =>
                                _.omit(prevState, element.id)
                            );
                        } else {
                            const newElement = await DataStore.query(
                                models.Handover,
                                element.id
                            );
                            if (newElement) {
                                setHandovers((prevState) => ({
                                    ...prevState,
                                    [newElement.id]: newElement,
                                }));
                            }
                        }
                    }
                }
            });
        } catch (error: any) {
            console.log(error);
            setErrorState(error);
        }
    }, [taskId]);

    React.useEffect(() => {
        getHandovers();
    }, [getHandovers]);

    const saveHandover = async () => {
        const currentTask = await DataStore.query(models.Task, taskId);
        if (currentTask && tenantId) {
            await DataStore.save(
                new models.Handover({
                    task: currentTask,
                    tenantId,
                })
            );
        }
    };

    const handleDelete = async (handover: models.Handover) => {
        await DataStore.delete(handover);
    };

    if (errorState) {
        return <Typography>Something went wrong.</Typography>;
    }

    return (
        <Paper className={cardClasses.root}>
            <Stack divider={<Divider />} direction="column">
                {Object.values(handovers).map((h) => (
                    <TaskHandoverCard
                        onClear={() => handleDelete(h)}
                        key={h.id}
                        handover={h}
                    />
                ))}
            </Stack>
            <IconButton aria-label="Add handover" onClick={saveHandover}>
                <AddCircleOutline />
            </IconButton>
        </Paper>
    );
};

export default TaskHandoversList;
