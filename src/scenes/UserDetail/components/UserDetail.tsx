import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@mui/material/styles";
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
import CurrentRiderResponsibilitySelector from "./CurrentRiderResponsibilitySelector";
import Skeleton from "@mui/material/Skeleton";
import useUser from "../../../hooks/useUser";
import GetError from "../../../ErrorComponents/GetError";
import usePossibleRiderResponsibilities from "../../../hooks/usePossibleRiderResponsibilities";

type UserDetailProps = {
    userId: string;
};

export default function UserDetail({ userId }: UserDetailProps) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.down("md"));

    const { state, setState, isFetching, error, notFound } = useUser(userId);
    const possibleRiderResponsibilities =
        usePossibleRiderResponsibilities(userId).state;

    function handleUpdateRiderResponsibility(riderResponsibility: string) {
        if (state) {
            const oldState = { ...state };
            setState({ ...state, riderResponsibility });
            DataStore.query(models.User, state.id)
                .then((currentUser) => {
                    if (currentUser) {
                        DataStore.save(
                            models.User.copyOf(currentUser, (updated) => {
                                updated.riderResponsibility =
                                    riderResponsibility;
                            })
                        );
                    }
                })
                .catch((error) => {
                    console.log(error);
                    dispatch(
                        displayErrorNotification("Sorry, something went wrong")
                    );
                    setState(oldState);
                });
        }
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
                        <Skeleton variant="text" height={50} />
                        <Skeleton variant="text" height={50} />
                    </Stack>
                    <Divider />
                    <Stack direction={"column"}>
                        {[...Array(4)].map((ele) => (
                            <Skeleton variant="text" height={50} />
                        ))}
                    </Stack>
                    <Divider />
                    <Stack direction={"column"}>
                        {[...Array(4)].map((ele) => (
                            <Skeleton variant="text" height={50} />
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
                    <Stack direction="column" alignItems="center" spacing={2}>
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
    } else if (error) {
        return <GetError />;
    } else if (state) {
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
                            value={state.riderResponsibility}
                            onChange={handleUpdateRiderResponsibility}
                        />
                        {possibleRiderResponsibilities &&
                            possibleRiderResponsibilities.length > 0 && (
                                <Divider />
                            )}
                        <UserProfile
                            key={state.id}
                            user={state}
                            possibleRiderResponsibilities={
                                possibleRiderResponsibilities
                            }
                        />
                    </Stack>
                </PaddedPaper>
                <ProfilePicture
                    profilePicture={state.profilePicture}
                    userId={state.id}
                    altText={state.displayName}
                    editable
                />
            </Stack>
        );
    } else {
        return null;
    }
}
