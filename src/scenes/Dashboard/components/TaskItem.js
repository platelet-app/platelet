import React, { useEffect, useState } from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { alpha } from "@mui/material";
import { Link, useHistory, useLocation } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import TaskCard from "./TaskCard";
import * as selectionActions from "../../../redux/selectionMode/selectionModeActions";
import { encodeUUID } from "../../../utilities";
import PropTypes from "prop-types";
import { Box, Grow, Skeleton, ToggleButton } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { useTheme } from "@mui/styles";
import TaskContextMenu from "../../../components/ContextMenus/TaskContextMenu";
import { useDispatch, useSelector } from "react-redux";
import {
    dashboardTabIndexSelector,
    selectedItemsSelector,
} from "../../../redux/Selectors";
import { useInView } from "react-intersection-observer";
import useLongPressEventContextMenu from "../../../hooks/useLongPressEventContextMenu";

const useStyles = makeStyles()((theme, { isSelected }, classes) => {
    const background =
        theme.palette.mode === "dark"
            ? "radial-gradient(circle, rgba(64,64,64,1) 30%, rgba(0,0,0,0) 100%)"
            : `radial-gradient(circle, ${theme.palette.background.paper} 30%, rgba(0,0,0,0) 100%)`;
    return {
        root: {
            position: "relative",
            "&:hover": {
                [`& .${classes.dots}`]: {
                    display: isSelected ? "none" : "inline",
                },
                [`& .${classes.select}`]: {
                    display: "inline",
                },
                [`& .${classes.overlay}`]: {
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
        dots: {
            background,
            borderRadius: "1em",
            position: "absolute",
            bottom: 4,
            right: 4,
            display: "none",
            zIndex: 90,
        },
        select: {
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
        },
    };
});

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
    const { task } = props;
    const [visibility, setVisibility] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const tabIndex = useSelector(dashboardTabIndexSelector);
    const selectedItems = useSelector(selectedItemsSelector);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const { classes } = useStyles({
        isSelected,
    });

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

    const contents = visibility ? (
        <Grow in {...(!props.animate ? { timeout: 0 } : {})}>
            <Box data-testid="task-item-parent" className={classes.root}>
                <ItemWrapper
                    isSm={isSm}
                    location={props.location}
                    taskId={task.id}
                    handleSelectItem={handleSelectItem}
                >
                    <TaskCard task={task} />
                </ItemWrapper>
                {!isSm && (
                    <>
                        <div className={classes.dots}>
                            <TaskContextMenu task={task} />
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
        <Skeleton
            data-testid="task-item-skeleton"
            variant="rectangle"
            width="100%"
            height={200}
        />
    );
    return <div ref={ref}>{contents}</div>;
});

TaskItem.defaultProps = {
    animate: true,
};

TaskItem.propTypes = {
    task: PropTypes.object,
    view: PropTypes.string,
    animate: PropTypes.bool,
};

export default TaskItemWrapper;
