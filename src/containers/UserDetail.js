import React, {useEffect} from "react";
import {decodeUUID} from "../utilities";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../redux/users/UsersActions";
import UserProfile from "../components/UserProfile";
import {createLoadingSelector} from "../redux/selectors";
import DetailSkeleton from "../loadingComponents/DetailSkeleton";
import {withRouter} from "react-router"
import Grid from "@material-ui/core/Grid";
import {PaddedPaper} from "../css/common";
import CommentsSection from "./CommentsSection";

export default function UserDetail (props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const user = useSelector(state => state.user.user);
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
            <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"} spacing={4}>
                <Grid item>
                    <PaddedPaper width={"600px"}>
                        <UserProfile user={user}/>
                    </PaddedPaper>
                </Grid>
                <Grid item>
                    <PaddedPaper width={"400px"}>
                        <CommentsSection parentUUID={user.uuid}/>
                    </PaddedPaper>
                </Grid>
            </Grid>
        )
    }
}
