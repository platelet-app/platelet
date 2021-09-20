import React, { useEffect, useState } from "react";
import { decodeUUID } from "../../utilities";
import API from "@aws-amplify/api";
import _ from "lodash";

import { useSelector } from "react-redux";
import * as queries from "./queries";
import UserProfile from "./components/UserProfile";
import { createNotFoundSelector } from "../../redux/LoadingSelectors";
import Grid from "@material-ui/core/Grid";
import { PaddedPaper } from "../../styles/common";
import DetailSkeleton from "./components/DetailSkeleton";
import ProfilePicture from "./components/ProfilePicture";
import NotFound from "../../ErrorComponents/NotFound";
import { getWhoami } from "../../redux/Selectors";
import { DataStore } from "@aws-amplify/datastore";
import * as models from "../../models/index";

const initialUserState = {
    id: "",
    username: "",
    contact: {
        emailAddress: "",
    },
    displayName: "",
    name: "",
    dateOfBirth: null,
    patch: null,
    profilePictureURL: null,
    profilePictureThumbnailURL: null,
    active: 1,
};

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const whoami = useSelector(getWhoami);
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState(initialUserState);
    const [notFound, setNotFound] = useState(false);

    async function newUserProfile() {
        setIsFetching(true);
        try {
            const user = await DataStore.query(models.User, userUUID);
            setIsFetching(false);
            if (user) setUser(user);
            else setNotFound(true);
        } catch (error) {
            setIsFetching(false);
            console.log("Request failed", error);
        }
    }
    useEffect(() => newUserProfile(), [props.location.key]);

    async function onUpdate(value) {
        const input = _.omit(value, "contact");
        try {
            await API.graphql({
                query: queries.updateUser,
                variables: { id: userUUID, input },
            });
        } catch (error) {
            console.log("Update request failed", error);
        }
    }

    if (isFetching) {
        return <DetailSkeleton />;
    } else if (notFound) {
        return <NotFound>User {userUUID} could not be found.</NotFound>;
    } else {
        return (
            <Grid container direction={"row"} spacing={4}>
                <Grid item>
                    <PaddedPaper width={"600px"}>
                        <UserProfile user={user} onUpdate={onUpdate} />
                    </PaddedPaper>
                </Grid>
                <Grid item>
                    <ProfilePicture
                        pictureURL={user.profilePictureURL}
                        userUUID={user.id}
                        altText={user.displayName}
                        editable={
                            user.id === whoami.id ||
                            whoami.roles.includes("ADMIN")
                        }
                    />
                </Grid>
            </Grid>
        );
    }
}
