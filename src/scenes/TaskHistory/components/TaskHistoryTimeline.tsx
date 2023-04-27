import React from "react";
import Linkify from "react-linkify";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import Moment from "react-moment";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { Task } from "../../../API";
import { TimelineOppositeContent } from "@mui/lab";
import CommentCard from "../../Comments/components/CommentCard";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import UserChip from "../../../components/UserChip";
import DeliverableChip from "../../../components/DeliverableChip";
import { encodeUUID } from "../../../utilities";
import DateStampDivider from "../../../components/DateStampDivider";

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

const getHumanReadableTimeLabel = (key: string) => {
    switch (key) {
        case "timePickedUp":
            return "Picked up";
        case "timeDroppedOff":
            return "Delivered";
        case "timeRiderHome":
            return "Rider home";
        case "timeCancelled":
            return "Cancelled";
        case "timeRejected":
            return "Rejected";
        default:
            return "";
    }
};

const getColor = (key: string) => {
    switch (key) {
        case "timePickedUp":
            return "taskStatus.PICKED_UP";
        case "timeDroppedOff":
            return "taskStatus.DROPPED_OFF";
        case "timeRiderHome":
            return "taskStatus.COMPLETED";
        case "timeCancelled":
            return "taskStatus.CANCELLED";
        case "timeRejected":
            return "taskStatus.REJECTED";
        default:
            return "secondary.main";
    }
};

const generateTimelineContent = (task: Task) => {
    const {
        createdAt,
        timePickedUp,
        timeDroppedOff,
        timeRejected,
        timeCancelled,
        timeRiderHome,
        createdBy,
        timePickedUpSenderName,
        timeDroppedOffRecipientName,
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
    let lastTime = new Date("2100-1-30");
    let timeDivider = <></>;
    const result = Object.entries(sorted).map(([key, value]) => {
        const sxDeleted = {
            "&::before": {
                content: "''",
                borderRadius: "1em",
                position: "absolute",
                paddingBottom: 9,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: 1,
            },
            "&::after": {
                content: "'deleted'",
                color: "red",
                fontStyle: "italic",
                position: "absolute",
                bottom: 10,
                right: 20,
            },
        };

        const isLastItem =
            Object.keys(sorted).indexOf(key) === Object.keys(sorted).length - 1;
        const timeComparison = new Date(value);
        // if timeComparison is the day before lastTime
        // then we need to add a divider
        if (timeComparison.getDate() !== lastTime.getDate()) {
            lastTime = timeComparison;
            timeDivider = (
                <DateStampDivider date={timeComparison.toISOString()} />
            );
        } else {
            timeDivider = <></>;
        }
        const Separator: React.FC<{
            color: string;
        }> = ({ color }) => (
            <TimelineSeparator>
                <TimelineDot sx={{ backgroundColor: color }} />
                {!isLastItem && <TimelineConnector />}
            </TimelineSeparator>
        );
        let color = "secondary.main";
        if (assigneeTimes[key as keyof typeof assigneeTimes]) {
            const assignee = assignees.find((assignee) => assignee?.id === key);
            if (!assignee) return null;
            const deleted = assignee?._deleted;
            const role = assignee?.role?.toLowerCase();
            color = role === "rider" ? "taskStatus.ACTIVE" : "taskStatus.NEW";
            if (assignee?.assignee) {
                const encodedId = encodeUUID(assignee.assignee.id);
                return (
                    <Box key={key}>
                        {timeDivider}
                        <TimelineItem sx={deleted ? sxDeleted : {}}>
                            <TimelineOppositeContent sx={{ flex: 0 }}>
                                <Moment format="HH:mm">
                                    {assignee.createdAt}
                                </Moment>
                            </TimelineOppositeContent>
                            <Separator color={color} />
                            <TimelineContent>
                                Assigned to {role}{" "}
                                <Link
                                    style={{ textDecoration: "none" }}
                                    to={`/user/${encodedId}`}
                                >
                                    <UserChip
                                        onClick={() => {}}
                                        user={assignee.assignee}
                                    />
                                </Link>
                            </TimelineContent>
                        </TimelineItem>
                    </Box>
                );
            } else {
                return null;
            }
        } else if (deliverableTimes[key as keyof typeof deliverableTimes]) {
            const deliverable = deliverables.find(
                (deliverable) => deliverable?.id === key
            );
            if (!deliverable) return null;
            const deleted = deliverable?._deleted;
            return (
                <Box key={key}>
                    {timeDivider}
                    <TimelineItem sx={deleted ? sxDeleted : {}}>
                        <TimelineOppositeContent sx={{ flex: 0 }}>
                            <Moment format="HH:mm">
                                {deliverable?.createdAt}
                            </Moment>
                        </TimelineOppositeContent>
                        <Separator color={color} />
                        <TimelineContent>
                            Added item{" "}
                            <DeliverableChip
                                showIcon
                                deliverable={deliverable}
                            />
                        </TimelineContent>
                    </TimelineItem>
                </Box>
            );
        } else if (commentTimes[key as keyof typeof commentTimes]) {
            const comment = comments.find((comment) => comment?.id === key);
            if (!comment || comment?._deleted) return null;
            return (
                <Box key={key}>
                    {timeDivider}
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ flex: 0 }}>
                            <Moment format="HH:mm">{comment?.createdAt}</Moment>
                        </TimelineOppositeContent>
                        <Separator color={color} />
                        <TimelineContent>
                            <CommentCard
                                numEdits={comment ? comment?._version - 1 : 0}
                                author={comment?.author}
                                visibility={comment?.visibility}
                                showAuthor
                                noAlign
                            >
                                <Typography
                                    sx={{
                                        padding: 2,
                                        whiteSpace: "pre-line",
                                    }}
                                    align={"justify"}
                                >
                                    <Linkify>{comment?.body}</Linkify>
                                </Typography>
                            </CommentCard>
                        </TimelineContent>
                    </TimelineItem>
                </Box>
            );
        } else if (key === "createdAt") {
            color = "taskStatus.NEW";
            const content = createdBy ? (
                <TimelineContent>
                    Created by{" "}
                    <Link
                        style={{ textDecoration: "none" }}
                        to={`/user/${encodeUUID(createdBy.id)}`}
                    >
                        <UserChip onClick={() => {}} user={createdBy} />
                    </Link>
                </TimelineContent>
            ) : (
                <>Created</>
            );

            return (
                <Box key={key}>
                    {timeDivider}
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ flex: 0 }}>
                            <Moment format="HH:mm">
                                {keyTimes[key as keyof typeof keyTimes] || ""}
                            </Moment>
                        </TimelineOppositeContent>
                        <Separator color={color} />
                        {content}
                    </TimelineItem>
                </Box>
            );
        } else if (key === "timePickedUp") {
            const time = keyTimes[key as keyof typeof keyTimes];
            color = getColor(key);
            const content = timePickedUpSenderName
                ? `Picked up from ${timePickedUpSenderName}`
                : "Picked up";
            return (
                <Box key={key}>
                    {timeDivider}
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ flex: 0 }}>
                            <Moment format="HH:mm">{time || ""}</Moment>
                        </TimelineOppositeContent>
                        <Separator color={color} />
                        <TimelineContent>{content}</TimelineContent>
                    </TimelineItem>
                </Box>
            );
        } else if (key === "timeDroppedOff") {
            const time = keyTimes[key as keyof typeof keyTimes];
            color = getColor(key);
            const content = timeDroppedOffRecipientName
                ? `Delivered to ${timeDroppedOffRecipientName}`
                : "Delivered";
            return (
                <Box key={key}>
                    {timeDivider}
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ flex: 0 }}>
                            <Moment format="HH:mm">{time || ""}</Moment>
                        </TimelineOppositeContent>
                        <Separator color={color} />
                        <TimelineContent>{content}</TimelineContent>
                    </TimelineItem>
                </Box>
            );
        } else if (keyTimes[key as keyof typeof keyTimes]) {
            const time = keyTimes[key as keyof typeof keyTimes];
            color = getColor(key);
            return (
                <Box key={key}>
                    {timeDivider}
                    <TimelineItem>
                        <TimelineOppositeContent sx={{ flex: 0 }}>
                            <Moment format="HH:mm">{time || ""}</Moment>
                        </TimelineOppositeContent>
                        <Separator color={color} />
                        <TimelineContent>
                            {getHumanReadableTimeLabel(key)}
                        </TimelineContent>
                    </TimelineItem>
                </Box>
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
