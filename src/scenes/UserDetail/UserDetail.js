import React, { useEffect, useState } from "react";
import { decodeUUID } from "../../utilities";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./components/UserProfile";
import { PaddedPaper } from "../../styles/common";
import DetailSkeleton from "./components/DetailSkeleton";
import ProfilePicture from "./components/ProfilePicture";
import NotFound from "../../ErrorComponents/NotFound";
import {
    dataStoreReadyStatusSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { protectedFields } from "../../apiConsts";
import { Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/styles";
import * as mutations from "../../graphql/mutations";
import { API, graphqlOperation } from "aws-amplify";

const initialUserState = {
    id: "",
    username: "",
    contact: {
        emailAddress: "",
    },
    displayName: "",
    name: "",
    roles: [],
    responsibility: null,
    dateOfBirth: null,
    patch: null,
    profilePictureURL: null,
    profilePictureThumbnailURL: null,
    active: 1,
};

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [user, setUser] = useState(initialUserState);
    const tenantId = useSelector(tenantIdSelector);
    const [notFound, setNotFound] = useState(false);
    const [usersDisplayNames, setUsersDisplayNames] = useState([]);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    async function newUserProfile() {
        setNotFound(false);
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const userResult = await DataStore.query(models.User, userUUID);
                const possibleRiderResponsibilities = await DataStore.query(
                    models.PossibleRiderResponsibilities
                );
                const userRiderResponsibilities = possibleRiderResponsibilities
                    .filter((responsibility) => {
                        return (
                            responsibility.user.id &&
                            userResult.id === responsibility.user.id
                        );
                    })
                    .map((r) => r.riderResponsibility);
                setIsFetching(false);
                if (userResult)
                    setUser({
                        ...userResult,
                        possibleRiderResponsibilities:
                            userRiderResponsibilities,
                    });
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
                roles,
                riderResponsibility,
                possibleRiderResponsibilities,
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
                    models.User.copyOf(existingUser, (updated) => {
                        for (const [key, newValue] of Object.entries(contact)) {
                            if (!protectedFields.includes(key))
                                updated.contact[key] = newValue;
                        }
                    })
                );
            }
            if (riderResponsibility) {
                await DataStore.save(
                    models.User.copyOf(existingUser, (updated) => {
                        updated.riderResponsibility =
                            riderResponsibility || null;
                    })
                );
            } else if (riderResponsibility === null) {
                await DataStore.save(
                    models.User.copyOf(existingUser, (updated) => {
                        updated.riderResponsibility = null;
                    })
                );
            }
            if (roles) {
                await API.graphql(
                    graphqlOperation(mutations.updateUserRoles, {
                        userId: user.id,
                        roles,
                    })
                );
            }
            if (possibleRiderResponsibilities && tenantId) {
                DataStore.query(models.PossibleRiderResponsibilities).then(
                    (result) => {
                        const existing = result.filter(
                            (r) => r.user && r.user.id === existingUser.id
                        );
                        for (const i of existing) {
                            DataStore.delete(i);
                        }
                    }
                );
                await Promise.all(
                    possibleRiderResponsibilities.map((riderResponsibility) => {
                        return DataStore.save(
                            new models.PossibleRiderResponsibilities({
                                tenantId,
                                riderResponsibility,
                                user: existingUser,
                            })
                        );
                    })
                );
            }
            setIsPosting(false);
        } catch (error) {
            console.error("Update request failed", error);
            dispatch(displayErrorNotification("Sorry, an error occurred"));
            setIsPosting(false);
        }
    }
    if (isFetching) {
        return <DetailSkeleton />;
    } else if (notFound) {
        return <NotFound>User {userUUID} could not be found.</NotFound>;
    } else {
        return (
            <Stack
                alignItems={isSm ? "center" : "flex-start"}
                direction={isSm ? "column" : "row"}
                spacing={1}
            >
                <PaddedPaper maxWidth={700}>
                    <UserProfile
                        displayNames={usersDisplayNames}
                        user={user}
                        onUpdate={onUpdate}
                        isPosting={isPosting}
                    />
                </PaddedPaper>
                <ProfilePicture
                    profilePicture={user.profilePicture}
                    userId={user.id}
                    altText={user.displayName}
                    editable
                />
            </Stack>
        );
    }
}
