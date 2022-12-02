import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import Collapse from "@mui/material/Collapse";
import * as models from "../../../models";
import { DataStore } from "aws-amplify";
import React from "react";
import TaskHandoverCard from "./TaskHandoverCard";
import { useSelector } from "react-redux";
import { tenantIdSelector } from "../../../redux/Selectors";
import _ from "lodash";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import { Timeline } from "@mui/lab";
import TimelineItem, { timelineItemClasses } from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import TaskHandoverHeaderFooter from "./TaskHandoverHeaderFooter";

type TaskHandoversListProps = {
    taskId: string;
};

type TaskHandoverState = {
    [key: string]: models.Handover;
};

function convertListDataToObject(list: models.Handover[]) {
    const result: TaskHandoverState = {};
    for (const item of list) {
        result[item.id] = item;
    }
    return result;
}

type LocationStateType = {
    pickUpLocation: models.Location | null;
    dropOffLocation: models.Location | null;
};

const TaskHandoversList: React.FC<TaskHandoversListProps> = ({ taskId }) => {
    const [handovers, setHandovers] = React.useState<TaskHandoverState>({});
    const [locationsState, setLocationsState] =
        React.useState<LocationStateType>({
            pickUpLocation: null,
            dropOffLocation: null,
        });

    const [errorState, setErrorState] = React.useState<any | null>(null);
    const tenantId = useSelector(tenantIdSelector);
    const handoverSubscription = React.useRef({ unsubscribe: () => {} });
    const taskSubscription = React.useRef({ unsubscribe: () => {} });
    const transitionEnabled = React.useRef(false);

    const getTask = React.useCallback(async () => {
        try {
            const task = await DataStore.query(models.Task, taskId);
            if (task) {
                setLocationsState({
                    pickUpLocation: task.pickUpLocation || null,
                    dropOffLocation: task.dropOffLocation || null,
                });
                taskSubscription.current = DataStore.observe(
                    models.Task,
                    taskId
                ).subscribe(({ element }) => {
                    if (element)
                        DataStore.query(models.Task, taskId).then((t) => {
                            if (t) {
                                setLocationsState({
                                    pickUpLocation: t.pickUpLocation || null,
                                    dropOffLocation: t.dropOffLocation || null,
                                });
                            }
                        });
                });
            }
        } catch (error) {
            setErrorState(error);
        }
    }, [taskId]);

    React.useEffect(() => {
        getTask();
        return () => {
            taskSubscription.current.unsubscribe();
        };
    });

    const getHandovers = React.useCallback(async () => {
        try {
            const result = (await DataStore.query(models.Handover)).filter(
                (h) => h.task?.id === taskId
            );
            const handoverState = convertListDataToObject(result);

            setHandovers(handoverState);
            setTimeout(() => {
                if (!transitionEnabled.current) {
                    transitionEnabled.current = true;
                }
            }, 2000);
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
        return () => {
            handoverSubscription.current.unsubscribe();
        };
    }, [getHandovers]);

    const moveHandoverUp = async (handover: models.Handover) => {
        const handoverIndex = handover.orderInGrid;
        const handoverAbove = Object.values(handovers).find(
            (h) => h.orderInGrid === handoverIndex - 1
        );
        if (handoverAbove) {
            await DataStore.save(
                models.Handover.copyOf(handover, (updated) => {
                    updated.orderInGrid = handover.orderInGrid - 1;
                })
            );
            await DataStore.save(
                models.Handover.copyOf(handoverAbove, (updated) => {
                    updated.orderInGrid = handover.orderInGrid;
                })
            );
        }
    };

    const moveHandoverDown = async (handover: models.Handover) => {
        const handoverIndex = handover.orderInGrid;
        const handoverBelow = Object.values(handovers).find(
            (h) => h.orderInGrid === handoverIndex + 1
        );
        if (handoverBelow) {
            await DataStore.save(
                models.Handover.copyOf(handover, (updated) => {
                    updated.orderInGrid = handover.orderInGrid + 1;
                })
            );
            await DataStore.save(
                models.Handover.copyOf(handoverBelow, (updated) => {
                    updated.orderInGrid = handover.orderInGrid;
                })
            );
        }
    };

    const saveHandover = React.useCallback(async () => {
        // get the current highest orderInGrid from handovers
        const highestOrderInGrid = Object.values(handovers).reduce(
            (acc, curr) => (curr.orderInGrid > acc ? curr.orderInGrid : acc),
            0
        );
        const currentTask = await DataStore.query(models.Task, taskId);
        if (currentTask && tenantId) {
            await DataStore.save(
                new models.Handover({
                    task: currentTask,
                    tenantId,
                    orderInGrid: highestOrderInGrid + 1,
                })
            );
        }
    }, [taskId, tenantId, handovers]);

    const handleDelete = async (handover: models.Handover) => {
        const allCurrentHandovers = (
            await DataStore.query(models.Handover)
        ).filter((h) => h.task?.id === taskId);
        const filtered = allCurrentHandovers.filter(
            (h) => h.id !== handover.id
        );
        const sorted = filtered.sort((a, b) => a.orderInGrid - b.orderInGrid);
        await Promise.all(
            sorted.map((h, index) => {
                return DataStore.save(
                    models.Handover.copyOf(h, (updated) => {
                        updated.orderInGrid = index + 1;
                    })
                );
            })
        );
        await DataStore.delete(handover);
    };

    if (errorState) {
        return <Typography>Something went wrong.</Typography>;
    }

    return (
        <Paper
            sx={{
                borderRadius: "1em",
                padding: 1,
                margin: 2,
                maxWidth: "90%",
            }}
        >
            <TaskHandoverHeaderFooter
                header
                location={locationsState.pickUpLocation}
            />
            {Object.values(handovers).length === 0 && (
                <Typography sx={{ padding: 1 }} variant="h5">
                    No handovers
                </Typography>
            )}
            <Stack
                alignItems="flex-end"
                justifyContent="space-between"
                direction="column"
            >
                <Timeline
                    sx={{
                        width: "100%",
                        [`& .${timelineItemClasses.root}:before`]: {
                            flex: 0,
                            padding: 1,
                        },
                    }}
                >
                    <TransitionGroup>
                        {Object.values(handovers)
                            .sort((a, b) => a.orderInGrid - b.orderInGrid)
                            .map((h) => {
                                // check if it is the first or last item
                                const isFirst = h.orderInGrid === 1;
                                const isLast =
                                    h.orderInGrid ===
                                    Object.values(handovers).length;

                                return (
                                    <Collapse key={h.id}>
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot />
                                                {!isLast && (
                                                    <TimelineConnector />
                                                )}
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                <TaskHandoverCard
                                                    onClear={() =>
                                                        handleDelete(h)
                                                    }
                                                    onMoveUp={() =>
                                                        moveHandoverUp(h)
                                                    }
                                                    onMoveDown={() =>
                                                        moveHandoverDown(h)
                                                    }
                                                    key={h.id}
                                                    handover={h}
                                                    disableUp={isFirst}
                                                    disableDown={isLast}
                                                />
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Collapse>
                                );
                            })}
                    </TransitionGroup>
                </Timeline>
                <Stack alignItems="center" direction="row">
                    <Typography
                        onClick={saveHandover}
                        sx={{ cursor: "pointer" }}
                        variant="h5"
                    >
                        Add Handover
                    </Typography>
                    <IconButton
                        aria-label="Add handover"
                        onClick={saveHandover}
                    >
                        <AddCircleOutline fontSize="large" />
                    </IconButton>
                </Stack>
            </Stack>
            <TaskHandoverHeaderFooter
                footer
                location={locationsState.dropOffLocation}
            />
        </Paper>
    );
};

export default TaskHandoversList;
