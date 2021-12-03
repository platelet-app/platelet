import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TaskCard from "./TaskCardsColoured";
import {
    convertListDataToObject,
    determineTaskStatus,
    encodeUUID,
} from "../../../utilities";
import PropTypes from "prop-types";
import { Grow, Skeleton } from "@mui/material";
import { makeStyles } from "@mui/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { commentVisibility, userRoles } from "../../../apiConsts";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import useOnScreen from "../../../hooks/useOnScreen";
import { useSelector } from "react-redux";
import {
    dataStoreReadyStatusSelector,
    getRoleView,
    getWhoami,
} from "../../../redux/Selectors";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        "&:hover": {
            "& $dots": {
                display: "inline",
            },
        },
    },
    dots: () => {
        const background =
            theme.palette.mode === "dark"
                ? "radial-gradient(circle, rgba(64,64,64,1) 30%, rgba(0,0,0,0) 100%)"
                : `radial-gradient(circle, ${theme.palette.background.paper} 30%, rgba(0,0,0,0) 100%)`;
        return {
            background: background,
            borderRadius: "1em",
            position: "absolute",
            bottom: 4,
            right: 4,
            display: "none",
            zIndex: 90,
        };
    },
}));

function TaskItem(props) {
    const classes = useStyles();
    const whoami = useSelector(getWhoami);
    const { task } = props;
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [assignees, setAssignees] = useState([]);
    const [assignedRiders, setAssignedRiders] = useState([]);
    const ref = React.useRef();
    const isVisible = useOnScreen(ref);
    const [visibility, setVisibility] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const roleView = useSelector(getRoleView);

    useEffect(() => {
        if (isVisible && !visibility) {
            setVisibility(true);
        }
    }, [isVisible]);

    async function getAssignees() {
        if ((visibility && !dataStoreReadyStatus) || !props.task) return;
        // inefficient method of getting assignees
        /*const allAssignments = (
            await DataStore.query(models.TaskAssignee)
        ).filter(
            (assignment) => assignment.task && assignment.task.id === task.id
        );
        */
        debugger;
        const assignmentsNotMe =
            props.task && props.task.assignees
                ? Object.values(props.task.assignees).filter((assignment) => {
                      const actualRole =
                          roleView.toLowerCase() === "all"
                              ? userRoles.coordinator
                              : roleView;
                      if (
                          assignment.role.toLowerCase() !==
                              actualRole.toLowerCase() ||
                          assignment.assignee.id !== whoami.id
                      ) {
                          return true;
                      }
                      return false;
                  })
                : [];
        const assignees = assignmentsNotMe.map((a) => a.assignee);
        setAssignees(assignees);
        const riders =
            props.task && props.task.assignees
                ? Object.values(props.task.assignees)
                      .filter((a) => a.role === userRoles.rider)
                      .map((a) => a.assignee)
                : [];
        setAssignedRiders(riders);
    }
    useEffect(() => {
        getAssignees();
    }, [visibility, props.task, dataStoreReadyStatus]);

    async function calculateCommentCount() {
        if ((visibility && !dataStoreReadyStatus) || !props.task) return;
        const commentsResult = (
            await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", props.task.id)
            )
        ).filter(
            (c) =>
                c.visibility === commentVisibility.everyone ||
                (c.visibility === commentVisibility.me &&
                    c.author.id === whoami.id)
        );
        setCommentCount(commentsResult.length);
    }
    useEffect(() => {
        calculateCommentCount();
    }, [visibility, props.task, dataStoreReadyStatus]);

    async function setTimeValue(value, key) {
        const result = await DataStore.query(models.Task, props.taskUUID);
        const assignees = (await DataStore.query(models.TaskAssignee)).filter(
            (a) => a.task.id === props.taskUUID
        );
        const status = determineTaskStatus({
            ...result,
            [key]: value,
            assignees: convertListDataToObject(assignees),
        });
        await DataStore.save(
            models.Task.copyOf(result, (updated) => {
                updated[key] = value;
                updated.status = status;
            })
        );
    }

    const location = useLocation();

    const contents = visibility ? (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <div
                className={classes.root}
                style={{ cursor: "context-menu", position: "relative" }}
            >
                <Link
                    style={{ textDecoration: "none" }}
                    to={{
                        pathname: `/task/${encodeUUID(props.taskUUID)}`,
                        state: { background: location },
                    }}
                >
                    <TaskCard
                        title={"Task"}
                        status={task.status}
                        timeOfCall={task.timeOfCall}
                        priority={task.priority}
                        pickUpLocation={task.pickUpLocation}
                        riderResponsibility={
                            task.riderResponsibility
                                ? task.riderResponsibility.label
                                : ""
                        }
                        dropOffLocation={task.dropOffLocation}
                        assignees={assignees}
                        assigneeDisplayString={assignees
                            .map((a) => a.displayName)
                            .join(", ")}
                        commentCount={commentCount}
                    />
                </Link>
                <div className={classes.dots}>
                    <TaskContextMenu
                        disableDeleted={props.deleteDisabled}
                        disableRelay={!!props.relayNext}
                        onSetTimePickedUp={(value) =>
                            setTimeValue(value, "timePickedUp")
                        }
                        onSetTimeDroppedOff={(value) =>
                            setTimeValue(value, "timeDroppedOff")
                        }
                        onSetTimeCancelled={(value) =>
                            setTimeValue(value, "timeCancelled")
                        }
                        onSetTimeRejected={(value) =>
                            setTimeValue(value, "timeRejected")
                        }
                        assignedRiders={assignedRiders}
                        task={task}
                    />
                </div>
            </div>
        </Grow>
    ) : (
        <Skeleton variant="rectangle" width="100%" height={200} />
    );
    return <div ref={ref}>{contents}</div>;
}

TaskItem.defaultProps = {
    animate: true,
};

TaskItem.propTypes = {
    task: PropTypes.object,
    taskUUID: PropTypes.string,
    view: PropTypes.string,
    deleteDisabled: PropTypes.bool,
    animate: PropTypes.bool,
};

export default TaskItem;
