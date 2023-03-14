import React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import Moment from "react-moment";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Task } from "../../../API";

function orderByOldestFirst(
    obj: Record<string, string>
): Record<string, string> {
    const keys = Object.keys(obj);
    keys.sort(
        (a, b) => new Date(obj[a]).getTime() - new Date(obj[b]).getTime()
    );

    const result: Record<string, string> = {};
    for (const key of keys) {
        result[key] = obj[key];
    }

    return result;
}

const generateTimelineContent = (task: Task) => {
    const {
        createdAt,
        timePickedUp,
        timeDroppedOff,
        timeRejected,
        timeCancelled,
        timeRiderHome,
    } = task;
    const comments = task?.comments?.items || [];
    const deliverables = task?.deliverables?.items || [];
    const assignees = task?.assignees?.items || [];

    const keyTimes = {
        createdAt,
        timePickedUp,
        timeDroppedOff,
        timeRejected,
        timeCancelled,
        timeRiderHome,
    };
    const commentTimes = comments.reduce((acc, comment) => {
        if (comment) {
            return {
                ...acc,
                [comment.id]: comment.createdAt,
            };
        } else {
            return acc;
        }
    }, {});
    const deliverableTimes = deliverables.reduce((acc, deliverable) => {
        if (deliverable) {
            return {
                ...acc,
                [deliverable.id]: deliverable.createdAt,
            };
        } else {
            return acc;
        }
    }, {});
    const assigneeTimes = assignees.reduce((acc, assignee) => {
        if (assignee) {
            return {
                ...acc,
                [assignee.id]: assignee.createdAt,
            };
        } else {
            return acc;
        }
    }, {});
    const everything = {
        ...keyTimes,
        ...commentTimes,
        ...deliverableTimes,
        ...assigneeTimes,
    };
    // filter out anything that is null or undefined from everything
    const filtered = Object.keys(everything).reduce((acc, key) => {
        if (everything[key as keyof typeof everything]) {
            return {
                ...acc,
                [key]: everything[key as keyof typeof everything],
            };
        } else {
            return acc;
        }
    }, {});
    // sort everything by value
    // but keep it as an object with original keys
    const sorted = orderByOldestFirst(filtered);
    const result = Object.keys(sorted).map((key) => {
        const isLastItem =
            Object.keys(sorted).indexOf(key) === Object.keys(sorted).length - 1;
        const separator = isLastItem ? (
            <TimelineSeparator>
                <TimelineDot />
            </TimelineSeparator>
        ) : (
            <TimelineSeparator>
                <TimelineDot />
                <TimelineConnector />
            </TimelineSeparator>
        );
        if (assigneeTimes[key as keyof typeof assigneeTimes]) {
            const assignee = assignees.find((assignee) => assignee?.id === key);
            console.log(assignee?.assignee);
            return (
                <TimelineItem key={assignee?.id}>
                    {separator}
                    <TimelineContent>
                        Assignee: {assignee?.assignee?.displayName}{" "}
                        <Moment format="HH:mm">{assignee?.createdAt}</Moment>
                    </TimelineContent>
                </TimelineItem>
            );
        } else if (deliverableTimes[key as keyof typeof deliverableTimes]) {
            const deliverable = deliverables.find(
                (deliverable) => deliverable?.id === key
            );
            return (
                <TimelineItem key={deliverable?.id}>
                    {separator}
                    <TimelineContent>
                        Deliverable: {deliverable?.deliverableType?.label}{" "}
                        <Moment format="HH:mm">{deliverable?.createdAt}</Moment>
                    </TimelineContent>
                </TimelineItem>
            );
        } else if (commentTimes[key as keyof typeof commentTimes]) {
            const comment = comments.find((comment) => comment?.id === key);
            return (
                <TimelineItem key={comment?.id}>
                    {separator}
                    <TimelineContent>
                        Comment: {comment?.body}{" "}
                        <Moment format="HH:mm">{comment?.createdAt}</Moment>
                    </TimelineContent>
                </TimelineItem>
            );
        } else if (keyTimes[key as keyof typeof keyTimes]) {
            const time = keyTimes[key as keyof typeof keyTimes];
            return (
                <TimelineItem key={key}>
                    {separator}
                    <TimelineContent>
                        {key}: <Moment format="HH:mm">{time || ""}</Moment>
                    </TimelineContent>
                </TimelineItem>
            );
        } else {
            return null;
        }
    });
    return result;
};

type TaskHistoryTimelineProps = {
    task?: Task | null;
};

const TaskHistoryTimeline: React.FC<TaskHistoryTimelineProps> = ({ task }) => {
    if (task) {
        const items = generateTimelineContent(task);
        return (
            <Timeline
                sx={{
                    minWidth: 500,
                    maxWidth: 1200,
                    "& .MuiTimelineItem-root:before": {
                        flex: 0,
                    },
                }}
            >
                {items.map((item) => item)}
            </Timeline>
        );
    } else {
        return null;
    }
};

export default TaskHistoryTimeline;
