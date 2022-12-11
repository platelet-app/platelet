import React, { useEffect, useRef, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha } from "@mui/material";
import { Link, useHistory, useLocation } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import TaskCard from "./TaskCardsColoured";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import { encodeUUID } from "../../../utilities";
import PropTypes from "prop-types";
import { Box, Grow, Skeleton, ToggleButton } from "@mui/material";
import { makeStyles, useTheme } from "@mui/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { commentVisibility, userRoles } from "../../../apiConsts";
import * as models from "../../../models/index";
import { DataStore } from "aws-amplify";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardTabIndexSelector,
    dataStoreModelSyncedStatusSelector,
    getRoleView,
    getWhoami,
    selectedItemsSelector,
    taskAssigneesSelector,
} from "../../../redux/Selectors";
import { useInView } from "react-intersection-observer";
import useLongPressEventContextMenu from "../../../hooks/useLongPressEventContextMenu";

const useStyles = (isSelected) =>
    makeStyles((theme) => ({
        root: {
            position: "relative",
            "&:hover": {
                "& $dots": {
                    display: isSelected ? "none" : "inline",
                },
                "& $select": {
                    display: "inline",
                },
                "& $overlay": {
                    display: "inline",
                    [theme.breakpoints.down("sm")]: {
                        display: isSelected ? "inline" : "none",
                    },
                },
            },
            padding: 1,
            width: "100%",
            cursor: "context-menu",
        },
        overlay: {
            position: "absolute",
            borderRadius: "0.8em",
            display: isSelected ? "inline" : "none",
            top: 0,
            left: 0,
            pointerEvents: "none",
            background: isSelected
                ? alpha(theme.palette.primary.main, 0.3)
                : alpha(theme.palette.background.paper, 0.3),
            width: "100%",
            height: "100%",
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
        select: () => {
            const background =
                theme.palette.mode === "dark"
                    ? "radial-gradient(circle, rgba(64,64,64,1) 30%, rgba(0,0,0,0) 100%)"
                    : `radial-gradient(circle, ${theme.palette.background.paper} 30%, rgba(0,0,0,0) 100%)`;
            return {
                background: isSelected
                    ? theme.palette.background.paper
                    : background,
                margin: 2,
                borderRadius: "1em",
                position: "absolute",
                bottom: 4,
                left: 4,
                display: isSelected ? "inline" : "none",
                zIndex: 90,
            };
        },
    }));

const ItemWrapper = ({
    children,
    isSm,
    location,
    taskId,
    handleSelectItem,
}) => {
    const handleCtrlClick = (e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            handleSelectItem();
        }
    };

    const history = useHistory();
    const boxRef = useLongPressEventContextMenu(handleSelectItem, true);
    function handleClick(e) {
        history.push({
            pathname: `/task/${encodeUUID(taskId)}`,
            state: { background: location },
        });
    }

    // if it's a small screen or installed with cordova
    // we want to use the long press event to select the item
    if (isSm || window.cordova)
        return (
            <Box ref={boxRef} onClick={handleClick}>
                {children}
            </Box>
        );
    else
        return (
            <Link
                onClick={handleCtrlClick}
                style={{ textDecoration: "none" }}
                to={{
                    pathname: `/task/${encodeUUID(taskId)}`,
                    state: { background: location },
                }}
            >
                {children}
            </Link>
        );
};

function TaskItemWrapper(props) {
    const location = useLocation();
    return <TaskItem {...props} location={location} />;
}

const TaskItem = React.memo((props) => {
    const whoami = useSelector(getWhoami);
    const { task } = props;
    const [assignees, setAssignees] = useState([]);
    const [assignedRiders, setAssignedRiders] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [commentCount, setCommentCount] = useState(0);
    const [isSelected, setIsSelected] = useState(false);
    const commentObserver = useRef({ unsubscribe: () => {} });
    const roleView = useSelector(getRoleView);
    const allAssignees = useSelector(taskAssigneesSelector);
    const commentModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).Comment;
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const selectedItems = useSelector(selectedItemsSelector);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const classes = useStyles(isSelected)();

    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        setVisibility((prevState) => {
            if (inView && !prevState) {
                return true;
            } else {
                return prevState;
            }
        });
    }, [inView]);

    function calculateIsSelected() {
        const itemsTab = selectedItems[tabIndex];
        let result = false;
        if (itemsTab) {
            result = Object.values(itemsTab)
                .map((t) => t.id)
                .includes(task.id);
        }
        setIsSelected(result);
    }
    useEffect(calculateIsSelected, [selectedItems, tabIndex, task.id]);

    function handleSelectItem() {
        if (isSelected) {
            dispatch(selectionActions.unselectItem(task.id, tabIndex));
        } else {
            dispatch(selectionActions.selectItem(task, tabIndex));
        }
    }

    const addItemToAvailableSelection = React.useCallback(() => {
        dispatch(selectionActions.addToAvailableItems(task));
        return () =>
            dispatch(selectionActions.removeFromAvailableItems(task.id));
    }, [dispatch, task]);

    useEffect(addItemToAvailableSelection, [task, addItemToAvailableSelection]);

    const getAssignees = React.useCallback(
        (visibility, roleView, task, allAssignees) => {
            if (!visibility || !roleView || !task) return;
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
                          assignment.role?.toLowerCase() !==
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
                task && task.assignees
                    ? Object.values(task.assignees)
                          .filter((a) => a.role === userRoles.rider)
                          .map((a) => a.assignee)
                    : [];
            setAssignedRiders(riders);
        },
        [whoami.id]
    );

    useEffect(
        () => getAssignees(visibility, roleView, task, allAssignees),
        [visibility, task, allAssignees, getAssignees, roleView]
    );

    const getCommentCount = React.useCallback(async () => {
        if (!task || !task.id) return 0;
        const commentsResult = (
            await DataStore.query(models.Comment, (c) =>
                c.parentId("eq", task.id)
            )
        ).filter(
            (c) =>
                c.visibility === commentVisibility.everyone ||
                (c.visibility === commentVisibility.me &&
                    c.author &&
                    c.author.id === whoami.id)
        );
        return commentsResult.length;
    }, [task, whoami.id]);

    const calculateCommentCount = React.useCallback(async () => {
        if (!visibility || !task) return;
        const commentCount = await getCommentCount();
        setCommentCount(commentCount);
        // TODO: change this to observeQuery when the bug is fixed
        commentObserver.current.unsubscribe();
        commentObserver.current = DataStore.observe(models.Comment, (c) =>
            c.parentId("eq", task.id)
        ).subscribe(async () => {
            getCommentCount().then((count) => {
                setCommentCount(count);
            });
        });
    }, [task, getCommentCount, visibility]);
    useEffect(() => {
        calculateCommentCount();
    }, [visibility, task, commentModelSynced, calculateCommentCount]);

    useEffect(() => () => commentObserver.current.unsubscribe(), []);

    const contents = visibility ? (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <Box data-testid="task-item-parent" className={classes.root}>
                <ItemWrapper
                    isSm={isSm}
                    location={props.location}
                    taskId={task.id}
                    handleSelectItem={handleSelectItem}
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
                </ItemWrapper>
                {!isSm && (
                    <>
                        <div className={classes.dots}>
                            <TaskContextMenu
                                disableDeleted={props.deleteDisabled}
                                disableRelay={!!props.relayNext}
                                assignedRiders={assignedRiders}
                                task={task}
                            />
                        </div>
                        <div className={classes.select}>
                            <ToggleButton
                                data-testid="task-item-select"
                                aria-label="select task"
                                sx={{ border: 0 }}
                                size="small"
                                onClick={handleSelectItem}
                            >
                                {isSelected ? (
                                    <CheckBoxIcon />
                                ) : (
                                    <CheckBoxOutlineBlankIcon />
                                )}
                            </ToggleButton>
                        </div>
                    </>
                )}
                <div className={classes.overlay} />
            </Box>
        </Grow>
    ) : (
        <Skeleton variant="rectangle" width="100%" height={200} />
    );
    return <div ref={ref}>{contents}</div>;
});

TaskItem.defaultProps = {
    animate: true,
};

TaskItem.propTypes = {
    task: PropTypes.object,
    view: PropTypes.string,
    deleteDisabled: PropTypes.bool,
    animate: PropTypes.bool,
};

export default TaskItemWrapper;
