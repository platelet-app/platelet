import React, { useEffect, useState } from "react";
import { decodeUUID } from "../../utilities";
import API from "@aws-amplify/api";

import { useDispatch, useSelector } from "react-redux";
import { getUserRequest } from "../../redux/users/UsersActions";
import { getUserQuery } from "./queries/getUserQuery";
import UserProfile from "./components/UserProfile";
import {
    createLoadingSelector,
    createNotFoundSelector,
} from "../../redux/LoadingSelectors";
import Grid from "@material-ui/core/Grid";
import { PaddedPaper } from "../../styles/common";
import DetailSkeleton from "./components/DetailSkeleton";
import Button from "@material-ui/core/Button";
import ProfilePicture from "./components/ProfilePicture";
import NotFound from "../../ErrorComponents/NotFound";
import Typography from "@material-ui/core/Typography";

const initialUserState = {
    id: "",
    username: "",
    contact: {
        emailAddress: "",
    },
    displayName: "",
    name: "",
    roles: "",
    dateOfBirth: "",
    patch: "",
    profilePictureURL: "",
    profilePictureThumbnailURL: "",
    active: 1,
};

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const whoami = useSelector((state) => state.whoami.user);
    const notFoundSelector = createNotFoundSelector(["GET_USER"]);
    const notFound = useSelector((state) => notFoundSelector(state));
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState(initialUserState);

    async function newUserProfile() {
        setIsFetching(true);
        try {
            const userData = await API.graphql({
                query: getUserQuery,
                variables: { id: userUUID },
            });
            setIsFetching(false);
            const user = userData.data.getUser;
            setUser(user);
        } catch (error) {
            setIsFetching(false);
            console.log("Request failed", error);
        }
    }

    useEffect(() => newUserProfile(), [props.location.key]);

    if (isFetching) {
        return <DetailSkeleton />;
    } else if (notFound) {
        return <NotFound>User {userUUID} could not be found.</NotFound>;
    } else {
        return (
            <Grid container direction={"row"} spacing={4}>
                <Grid item>
                    <PaddedPaper width={"600px"}>
                        <UserProfile user={user} />
                    </PaddedPaper>
                </Grid>
                <Grid item>
                    <ProfilePicture
                        pictureURL={user.profile_picture_url}
                        userUUID={user.uuid}
                        altText={user.display_name}
                        editable={
                            user.uuid === whoami.uuid ||
                            whoami.roles.includes("admin")
                        }
                    />
                </Grid>
            </Grid>
        );
    }
}
