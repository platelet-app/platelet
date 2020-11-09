import React, {useEffect} from "react";
import {decodeUUID} from "../../utilities";
import {useDispatch, useSelector} from "react-redux";
import {getUserRequest} from "../../redux/users/UsersActions";
import UserProfile from "./components/UserProfile";
import {createLoadingSelector, createNotFoundSelector} from "../../redux/selectors";
import Grid from "@material-ui/core/Grid";
import {PaddedPaper} from "../../styles/common";
import CommentsSection from "../Comments/CommentsSection";
import DetailSkeleton from "./components/DetailSkeleton";
import Button from "@material-ui/core/Button";
import ProfilePicture from "./components/ProfilePicture";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@material-ui/core/Typography";

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const user = useSelector(state => state.user.user);
    const whoami = useSelector(state => state.whoami.user);
    const notFoundSelector = createNotFoundSelector(["GET_USER"]);
    const notFound = useSelector(state => notFoundSelector(state));
    const dispatch = useDispatch();

    const loadingSelector = createLoadingSelector(["GET_USER"]);
    const isFetching = useSelector(state => loadingSelector(state));

    function newUserProfile() {
        dispatch(getUserRequest(userUUID));
    }
    useEffect(newUserProfile, [props.location.key]);

    if (isFetching) {
        return (
            <DetailSkeleton/>
        )
    } else if (notFound) {
        return <NotFound><Typography>User {userUUID} could not be found.</Typography></NotFound>
    } else {
        return (
            <Grid container direction={"column"} justify={"flex-start"} alignItems={"flex-start"} spacing={4}>
                <Grid container direction={"row"} spacing={4} wrap={"nowrap"}>
                    <Grid item>
                        <PaddedPaper width={"600px"}>
                            <UserProfile user={user}/>
                        </PaddedPaper>
                    </Grid>
                    <Grid item>
                        <ProfilePicture
                            pictureURL={user.profile_picture_url}
                            userUUID={user.uuid}
                            altText={user.display_name}
                            editable={user.uuid === whoami.uuid || whoami.roles.includes("admin")}
                        />
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
