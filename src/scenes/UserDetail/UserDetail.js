import React, { useEffect, useRef, useState } from "react";
import { decodeUUID } from "../../utilities";
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import UserProfile from "./components/UserProfile";
import { PaddedPaper } from "../../styles/common";
import ProfilePicture from "./components/ProfilePicture";
import NotFound from "../../ErrorComponents/NotFound";
import {
    dataStoreReadyStatusSelector,
    tenantIdSelector,
} from "../../redux/Selectors";
import { DataStore } from "aws-amplify";
import * as models from "../../models/index";
import { displayErrorNotification } from "../../redux/notifications/NotificationsActions";
import { Stack, useMediaQuery,Divider } from "@mui/material";
import { useTheme } from "@mui/styles";
import CurrentRiderResponsibilitySelector from "./components/CurrentRiderResponsibilitySelector";
import Skeleton from "@mui/material/Skeleton";

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
    disabled: 0,
};

export default function UserDetail(props) {
    const userUUID = decodeUUID(props.match.params.user_uuid_b62);
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    const [isFetching, setIsFetching] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [user, setUser] = useState(initialUserState);
    const [riderResponsibility, setRiderResponsibility] = useState(null);
    const [possibleRiderResponsibilities, setPossibleRiderResponsibilities] =
        useState([]);
    const riderRespObserver = useRef({ unsubscribe: () => {} });
    const tenantId = useSelector(tenantIdSelector);
    const [notFound, setNotFound] = useState(false);
    const [usersDisplayNames, setUsersDisplayNames] = useState([]);
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));
    const observer = useRef({
            unsubscribe: () => {},
        });


    async function newUserProfile() {
        setNotFound(false);
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const userResult = await DataStore.query(models.User, userUUID);
                // TODO: make this observeQuery when https://github.com/aws-amplify/amplify-js/issues/9682 is fixed
                DataStore.query(models.PossibleRiderResponsibilities).then(
                    (result) => {
                        const filtered = result
                            .filter((responsibility) => {
                                return (
                                    userResult &&
                                    responsibility.user &&
                                    responsibility.user.id &&
                                    userResult.id === responsibility.user.id
                                );
                            })
                            .map((r) => r.riderResponsibility);
                        setPossibleRiderResponsibilities(filtered);
                    }
                );
                observer.current.unsubscribe();
                observer.current = DataStore.observe(
                    models.User
                ).subscribe((result) => {
                DataStore.query(models.User, userUUID).then((res)=>{
                  setUser(res);
                })

                })
                riderRespObserver.current.unsubscribe();
                riderRespObserver.current = DataStore.observe(
                    models.PossibleRiderResponsibilities
                ).subscribe((result) => {
                    DataStore.query(models.PossibleRiderResponsibilities).then(
                        (result) => {
                            const filtered = result
                                .filter((responsibility) => {
                                    return (
                                        userResult &&
                                        responsibility.user &&
                                        responsibility.user.id &&
                                        userResult.id === responsibility.user.id
                                    );
                                })
                                .map((r) => r.riderResponsibility);
                            setPossibleRiderResponsibilities(filtered);
                        }
                    );
                });
                setIsFetching(false);
                if (userResult) {
                    setUser(userResult);
                    setRiderResponsibility(userResult.riderResponsibility);
                } else setNotFound(true);
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
                    `Failed to get users list: ${error.message}`
                )
            );
        }
    }
    useEffect(() => getDisplayNames(), []);

    useEffect(() => () => riderRespObserver.current.unsubscribe(), []);

    useEffect(() => () => observer.current.unsubscribe(), []);

    function handleUpdateRiderResponsibility(riderResponsibility) {
        setRiderResponsibility(riderResponsibility);
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
        return <NotFound>User {userUUID} could not be found.</NotFound>;
    } else {
        return (
            <Stack
                alignItems={isSm ? "center" : "flex-start"}
                direction={isSm ? "column" : "row"}
                spacing={1}
            >
                <PaddedPaper maxWidth={700}>
                    <CurrentRiderResponsibilitySelector
                        available={possibleRiderResponsibilities}
                        value={riderResponsibility}
                        onChange={handleUpdateRiderResponsibility}
                    />
                    <UserProfile
                        displayNames={usersDisplayNames}
                        user={user}
                        possibleRiderResponsibilities={
                            possibleRiderResponsibilities
                        }
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
