import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getComments} from "../redux/comments/Actions";

export default function CommentsSection(props) {
    const dispatch = useDispatch();
    const comments = useSelector(state => state.comments);
    function componentDidMount() {
        dispatch(getComments(props.parentUUID));
    }
    useEffect(componentDidMount, []);

    return (
        comments.map((comment) => (comment.body))
    )
}