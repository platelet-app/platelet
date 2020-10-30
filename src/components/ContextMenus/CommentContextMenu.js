import React, {useEffect} from 'react';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {
    deleteCommentRequest, deleteSidebarCommentRequest,
    restoreCommentRequest, restoreSidebarCommentRequest
} from "../../redux/comments/CommentsActions";
import {useDispatch, useSelector} from "react-redux";
import MoreVertIcon from '@material-ui/icons/MoreVert';
import IconButton from '@material-ui/core/IconButton';
import {createPostingSelector} from "../../redux/selectors";


const initialState = {
    mouseX: null,
    mouseY: null,
};


export default function CommentContextMenu(props) {
    const whoami = useSelector(state => state.whoami.user);
    const [state, setState] = React.useState(initialState);
    const postingSelector = createPostingSelector(props.sidebar ?  ["DELETE_SIDEBAR_COMMENT", "RESTORE_SIDEBAR_COMMENT"] : ["DELETE_COMMENT", "RESTORE_COMMENT"]);
    const isPosting = useSelector(state => postingSelector(state));

    const dispatch = useDispatch();

    const handleClick = event => {
        setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };


    function onDelete() {
        handleClose();
        if (props.sidebar)
            dispatch(deleteSidebarCommentRequest(props.comment.uuid));
        else
            dispatch(deleteCommentRequest(props.comment.uuid));
    }

    const handleClose = () => {
        setState(initialState);
    };

    return (
        <>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
                disabled={isPosting}
            >
                <MoreVertIcon />
            </IconButton>
            <Menu
                keepMounted
                open={state.mouseY !== null}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    state.mouseY !== null && state.mouseX !== null
                        ? { top: state.mouseY, left: state.mouseX }
                        : undefined
                }
            >
                <MenuItem
                    style={{display: (whoami.roles.includes("admin") || whoami.uuid !== props.comment.author_uuid) ? "inherit" : "none", color: "rgb(235, 86, 75)"}}
                    onClick={onDelete}>Delete</MenuItem>
            </Menu>
        </>
    );
}
