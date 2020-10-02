import React, {useEffect} from "react";
import {decodeUUID} from "../../utilities";
import {useDispatch, useSelector} from "react-redux";
import {getUserRequest} from "../../redux/users/UsersActions";
import UserProfile from "./components/UserProfile";
import {createLoadingSelector} from "../../redux/selectors";
import Grid from "@material-ui/core/Grid";
import {PaddedPaper} from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import DetailSkeleton from "./components/DetailSkeleton";
import Button from "@material-ui/core/Button";

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const user = useSelector(state => state.user.user);
    const whoami = useSelector(state => state.whoami.user);
    const dispatch = useDispatch();

    const loadingSelector = createLoadingSelector(["GET_USER"]);
    const isFetching = useSelector(state => loadingSelector(state));

    function newUserProfile() {
        dispatch(getUserRequest(userUUID));
    }

    useEffect(newUserProfile, [props.location.key]);

    const profilePicture = user.profile_picture_url ?
        <Grid item>
            <img alt={user.display_name} src={user.profile_picture_url}/>
        </Grid> : <></>

    const picUploadButton = user.uuid === whoami.uuid || whoami.roles.includes("admin") ?
        <Grid item>
            <input
                accept="image/*"
                style={{display: 'none'}}
                id="raised-button-file"
                multiple
                type="file"
            />
            <label htmlFor="raised-button-file">
                <Button variant="raised" component="span">
                    {user.profile_picture_url ? "Change" : "Upload Picture"}
                </Button>
            </label>
        </Grid> : <></>

    if (isFetching) {
        return (
            <DetailSkeleton/>
        )
    } else {
        return (
            <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"} spacing={4}>
                <Grid container direction={"row"} spacing={4}>
                    <Grid item>
                        <PaddedPaper width={"600px"}>
                            <UserProfile user={user}/>
                        </PaddedPaper>
                    </Grid>
                    <Grid item>
                        <PaddedPaper width={"360px"} minHeight={"360px"}>
                            <Grid container direction={"column"} spacing={2}>
                                {profilePicture}
                                {picUploadButton}
                            </Grid>
                        </PaddedPaper>
                    </Grid>
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
