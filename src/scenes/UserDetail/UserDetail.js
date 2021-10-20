import React, { useEffect, useRef, useState } from "react";
import { decodeUUID } from "../../utilities";
import _ from "lodash";

import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./components/UserProfile";
import Grid from "@mui/material/Grid";
import { PaddedPaper } from "../../styles/common";
import DetailSkeleton from "./components/DetailSkeleton";
import ProfilePicture from "./components/ProfilePicture";
import NotFound from "../../ErrorComponents/NotFound";
import { dataStoreReadyStatusSelector, getWhoami } from "../../redux/Selectors";
import { DataStore } from "@aws-amplify/datastore";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { protectedFields } from "../../apiConsts";

const initialUserState = {
    id: "",
    username: "",
    contact: {
        emailAddress: "",
    },
    displayName: "",
    name: "",
    responsibility: null,
    dateOfBirth: null,
    patch: null,
    profilePictureURL: null,
    profilePictureThumbnailURL: null,
    active: 1,
};

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const whoami = useSelector(getWhoami);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [user, setUser] = useState(initialUserState);
    const [notFound, setNotFound] = useState(false);
    const [usersDisplayNames, setUsersDisplayNames] = useState([]);
    const dispatch = useDispatch();

    async function newUserProfile() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const user = await DataStore.query(models.User, userUUID);
                setIsFetching(false);
                if (user) setUser(user);
                else setNotFound(true);
            } catch (error) {
                setIsFetching(false);
                dispatch(
                    displayErrorNotification(
                        `Failed to get user: ${error.message}`
                    )
                );
                console.log("Request failed", error);
            }
        }
    }
    useEffect(
        () => newUserProfile(),
        [props.location.key, dataStoreReadyStatus]
    );

    async function getDisplayNames() {
        try {
            const users = await DataStore.query(models.User);
            const displayNames = users.map((u) => ({
                displayName: u.displayName,
                id: u.id,
            }));
            setUsersDisplayNames(displayNames);
        } catch (error) {
            dispatch(
                displayErrorNotification(
                    `Failed to get users lists: ${error.message}`
                )
            );
        }
    }
    useEffect(() => getDisplayNames(), []);

    async function onUpdate(value) {
        setIsPosting(true);
        try {
            const existingUser = await DataStore.query(models.User, user.id);
            const {
                userRiderResponsibilityId,
                responsibility,
                contact,
                ...rest
            } = value;
            await DataStore.save(
                models.User.copyOf(existingUser, (updated) => {
                    for (const [key, newValue] of Object.entries(rest)) {
                        if (!protectedFields.includes(key))
                            updated[key] = newValue;
                    }
                })
            );
            if (existingUser.contact && contact) {
                await DataStore.save(
                    models.AddressAndContactDetails.copyOf(
                        existingUser.contact,
                        (updated) => {
                            for (const [key, newValue] of Object.entries(
                                contact
                            )) {
                                if (!protectedFields.includes(key))
                                    updated[key] = newValue;
                            }
                        }
                    )
                );
            }
            if (userRiderResponsibilityId) {
                const existingUserResponsibility = await DataStore.query(
                    models.User,
                    user.id
                );
                try {
                    await DataStore.save(
                        models.User.copyOf(
                            existingUserResponsibility,
                            (updated) => {
                                updated.userRiderResponsibilityId =
                                    userRiderResponsibilityId;
                            }
                        )
                    );
                } catch (error) {
                    console.error("DataStore workaround", error);
                }
            }
            setIsPosting(false);
        } catch (error) {
            console.log("Update request failed", error);
            dispatch(displayErrorNotification(error.message));
            setIsPosting(false);
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
                        <UserProfile
                            displayNames={usersDisplayNames}
                            user={user}
                            onUpdate={onUpdate}
                            isPosting={isPosting}
                        />
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
