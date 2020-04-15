import React, {useEffect} from "react";
import {decodeUUID} from "../utilities";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../redux/users/Actions";
import UserProfile from "../components/UserProfile";
import {createLoadingSelector} from "../redux/selectors";
import DetailSkeleton from "../loadingComponents/DetailSkeleton";
import {withRouter} from "react-router"

function UserDetail (props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const loadingSelector = createLoadingSelector(["GET_USER"]);
    const isFetching = useSelector(state => loadingSelector(state));

    function newUserProfile() {
        dispatch(getUser(userUUID));
    }
    useEffect(newUserProfile, [props.location.key]);

    if (isFetching) {
        return (
            <DetailSkeleton/>
        )
    } else {
        return (
            <UserProfile user={user}/>
        )
    }
}

export default withRouter(UserDetail)