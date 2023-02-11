import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./UserProfile";
import { PaddedPaper } from "../../../styles/common";
import ProfilePicture from "./ProfilePicture";
import NotFound from "../../../ErrorComponents/NotFound";
import { dataStoreModelSyncedStatusSelector } from "../../../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { Stack, useMediaQuery, Divider } from "@mui/material";
import { useTheme } from "@mui/styles";
import CurrentRiderResponsibilitySelector from "./CurrentRiderResponsibilitySelector";
import Skeleton from "@mui/material/Skeleton";
import usePossibleRiderResponsibilities from "../../../hooks/usePossibleRiderResponsibilities";

const initialUserState = {
    id: "",
    username: "",
    contact: {
        emailAddress: "",
    },
    displayName: "",
    name: "",
    roles: [],
    riderResponsibility: null,
    dateOfBirth: null,
    patch: null,
    profilePictureURL: null,
    disabled: 0,
};

export default function UserDetail({ userId }) {
    const [isFetching, setIsFetching] = useState(false);
    const [user, setUser] = useState(initialUserState);
    const [notFound, setNotFound] = useState(false);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const observer = useRef({
        unsubscribe: () => {},
    });

    const possibleRiderResponsibilities =
        usePossibleRiderResponsibilities(userId).state;

    const loadedOnce = useRef(false);

    const userModelSynced = useSelector(
        dataStoreModelSyncedStatusSelector
    ).User;

    const newUserProfile = React.useCallback(
        async (userId) => {
            setNotFound(false);
            if (!loadedOnce.current) setIsFetching(true);
            try {
                const userResult = await DataStore.query(models.User, userId);
                observer.current = DataStore.observe(
                    models.User,
                    userId
                ).subscribe(({ element }) => {
                    setUser(element);
                });
                setIsFetching(false);
                loadedOnce.current = true;
                if (userResult) {
                    setUser(userResult);
                } else {
                    setNotFound(true);
                }
            } catch (error) {
                setIsFetching(false);
                dispatch(
                    displayErrorNotification(
                        `Failed to get user: ${error.message}`
                    )
                );
                console.log("Request failed", error);
            }
        },
        [dispatch]
    );
    useEffect(
        () => newUserProfile(userId),
        [userId, userModelSynced, newUserProfile]
    );

    useEffect(() => () => observer.current.unsubscribe(), []);

    function handleUpdateRiderResponsibility(riderResponsibility) {
        const oldState = { ...user };
        setUser({ ...user, riderResponsibility });
        DataStore.query(models.User, user.id)
            .then((currentUser) => {
                DataStore.save(
                    models.User.copyOf(currentUser, (updated) => {
                        updated.riderResponsibility = riderResponsibility;
                    })
                );
            })
            .catch((error) => {
                console.log(error);
                dispatch(
                    displayErrorNotification("Sorry, something went wrong")
                );
                setUser(oldState);
            });
    }

    if (isFetching) {
        return (
            <Stack
                alignItems={isSm ? "center" : "flex-start"}
                direction={isSm ? "column" : "row"}
                spacing={1}
            >
                <PaddedPaper maxWidth={700}>
                    <Stack direction={"row"} spacing={3}>
                        <Skeleton variant="text" width={300} height={50} />
                    </Stack>
                    <Divider />
                    <Stack direction={"column"}>
                        <Skeleton variant="text" maxWidth={700} height={50} />
                        <Skeleton variant="text" maxWidth={700} height={50} />
                    </Stack>
                    <Divider />
                    <Stack direction={"column"}>
                        {[...Array(4)].map((ele) => (
                            <Skeleton
                                variant="text"
                                maxWidth={700}
                                height={50}
                            />
                        ))}
                    </Stack>
                    <Divider />
                    <Stack direction={"column"}>
                        {[...Array(4)].map((ele) => (
                            <Skeleton
                                variant="text"
                                maxWidth={700}
                                height={50}
                            />
                        ))}
                    </Stack>
                    <Divider />
                    <Stack direction={"row"} spacing={2}>
                        {[...Array(4)].map((ele) => (
                            <Skeleton variant="text" width={50} height={50} />
                        ))}
                    </Stack>
                </PaddedPaper>
                <PaddedPaper maxWidth={400}>
                    <Stack
                        container
                        direction={"column"}
                        alignItems={"center"}
                        spacing={2}
                    >
                        <Skeleton
                            variant="rectangular"
                            width={250}
                            height={250}
                        />
                        <Skeleton variant="text" width={150} height={50} />
                    </Stack>
                </PaddedPaper>
            </Stack>
        );
    } else if (notFound) {
        return <NotFound>User {userId} could not be found.</NotFound>;
    } else {
        return (
            <Stack
                alignItems={isSm ? "center" : "flex-start"}
                direction={isSm ? "column" : "row"}
                spacing={1}
            >
                <PaddedPaper maxWidth={700}>
                    <Stack direction="column" spacing={3}>
                        <CurrentRiderResponsibilitySelector
                            available={possibleRiderResponsibilities}
                            value={user.riderResponsibility || ""}
                            onChange={handleUpdateRiderResponsibility}
                        />
                        {possibleRiderResponsibilities &&
                            possibleRiderResponsibilities.length > 0 && (
                                <Divider />
                            )}
                        <UserProfile
                            key={user.id}
                            user={user}
                            quickUpdateRolesState={(roles) =>
                                setUser({ ...user, roles })
                            }
                        />
                    </Stack>
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
