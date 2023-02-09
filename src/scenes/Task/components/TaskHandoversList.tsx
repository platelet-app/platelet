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
import { useTaskHandovers } from "../../../hooks/useTaskHandovers";
import useTask from "../../../hooks/useTask";

type TaskHandoversListProps = {
    taskId: string;
};

const TaskHandoversList: React.FC<TaskHandoversListProps> = ({ taskId }) => {
    const tenantId = useSelector(tenantIdSelector);
    const { state, error } = useTaskHandovers(taskId);
    const taskState = useTask(taskId);
    const task = taskState.state;
    const moveHandoverUp = async (handover: models.Handover) => {
        const handoverIndex = handover.orderInGrid;
        const handoverAbove = Object.values(state).find(
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
        const handoverBelow = Object.values(state).find(
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
        const highestOrderInGrid = Object.values(state).reduce(
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
    }, [taskId, tenantId, state]);

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

    if (error) {
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
            <TaskHandoverHeaderFooter header location={task?.pickUpLocation} />
            {Object.values(state).length === 0 && (
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
                        {Object.values(state)
                            .sort((a, b) => a.orderInGrid - b.orderInGrid)
                            .map((h) => {
                                // check if it is the first or last item
                                const isFirst = h.orderInGrid === 1;
                                const isLast =
                                    h.orderInGrid ===
                                    Object.values(state).length;

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
            <TaskHandoverHeaderFooter footer location={task?.dropOffLocation} />
        </Paper>
    );
};

export default TaskHandoversList;
