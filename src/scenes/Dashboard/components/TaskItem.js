import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import TaskCard from "./TaskCardsColoured";
import { encodeUUID } from "../../../utilities";
import PropTypes from "prop-types";
import { Box, Grow, Skeleton } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { commentVisibility, userRoles } from "../../../apiConsts";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import { useSelector } from "react-redux";
import {
    dataStoreModelSyncedStatusSelector,
    getRoleView,
    getWhoami,
    taskAssigneesSelector,
} from "../../../redux/Selectors";
import { useInView } from "react-intersection-observer";

const useStyles = makeStyles((theme) => ({
    root: {
        position: "relative",
        "&:hover": {
            "& $dots": {
                display: "inline",
            },
        },
        padding: 1,
        width: "100%",
        cursor: "context-menu",
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
    const [assignees, setAssignees] = useState([]);
    const [assignedRiders, setAssignedRiders] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const commentObserver = useRef({ unsubscribe: () => {} });
    const roleView = useSelector(getRoleView);
    const allAssignees = useSelector(taskAssigneesSelector);
    const commentModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Comment;

    const { ref, inView, entry } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        if (inView && !visibility) {
            setVisibility(true);
        }
    }, [inView]);

    async function getAssignees() {
        if (!visibility || !roleView || !props.task) return;
        // inefficient method of getting assignees
        /*const allAssignments = (
            await DataStore.query(models.TaskAssignee)
        ).filter(
            (assignment) => assignment.task && assignment.task.id === task.id
        );
        */
        const taskAssignees =
            allAssignees && allAssignees.items
                ? allAssignees.items.filter(
                      (assignment) =>
                          assignment.task && assignment.task.id === task.id
                  )
                : [];
        const assignmentsNotMe = allAssignees
            ? Object.values(taskAssignees).filter((assignment) => {
                  const actualRole =
                      roleView === "ALL" ? userRoles.coordinator : roleView;
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
    }, [visibility, props.task, allAssignees.items]);

    async function getCommentCount() {
        if (!props.task || !props.task.id) return 0;
        const commentsResult = (
            await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", props.task.id)
            )
        ).filter(
            (c) =>
                c.visibility === commentVisibility.everyone ||
                (c.visibility === commentVisibility.me &&
                    c.author &&
                    c.author.id === whoami.id)
        );
        return commentsResult.length;
    }

    async function calculateCommentCount() {
        if (!visibility || !props.task) return;
        const commentCount = await getCommentCount();
        setCommentCount(commentCount);
        // TODO: change this to observeQuery when the bug is fixed
        commentObserver.current.unsubscribe();
        commentObserver.current = DataStore.observe(models.Comment, (c) =>
            c.parentId("eq", props.task.id)
        ).subscribe(async () => {
            getCommentCount().then((count) => {
                setCommentCount(count);
            });
        });
    }
    useEffect(() => {
        calculateCommentCount();
    }, [visibility, props.task, commentModelSynced]);

    useEffect(() => () => commentObserver.current.unsubscribe(), []);

    const location = useLocation();

    const contents = visibility ? (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <Box className={classes.root}>
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
                        riderResponsibility={task.riderResponsibility || ""}
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
                        assignedRiders={assignedRiders}
                        task={task}
                    />
                </div>
            </Box>
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
