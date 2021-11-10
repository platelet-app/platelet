import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import { contextDots, PaddedPaper } from "../styles/common";
import { sortByCreatedTime } from "../utilities";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import { Button, Stack } from "@mui/material";
import { dataStoreReadyStatusSelector, getWhoami } from "../redux/Selectors";
import { Link } from "react-router-dom";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { userRoles } from "../apiConsts";

function filterUsers(users, search) {
    if (!search) {
        return users;
    } else {
        return users.filter((user) => {
            if (
                user.displayName
                    ? user.displayName
                          .toLowerCase()
                          .includes(search.toLowerCase())
                    : false
            ) {
                return user;
            } else if (
                user.patch
                    ? user.patch.toLowerCase().includes(search.toLowerCase())
                    : false
            ) {
                return user;
            } else if (
                user.roles
                    ? user.roles.toLowerCase().includes(search.toLowerCase())
                    : false
            ) {
                return user;
            }
        });
    }
}

export default function UsersList(props) {
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    //useEffect(() => setFilteredUsers(users), [users]);
    //const fetchTimer = useRef();
    //const fetchingTimer = setTimeout(() => setIsFetching(true), 1000);

    async function getUsers() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const users = await DataStore.query(models.User);
                setIsFetching(false);
                setUsers(users);
            } catch (error) {
                console.log("Request failed", error);
                if (error && error.message)
                    dispatch(displayErrorNotification(error.message));
                setIsFetching(false);
            }
        }
    }

    useEffect(() => getUsers(), [dataStoreReadyStatus]);

    const addButton = whoami.roles.includes(userRoles.admin) ? (
        <Button component={Link} to={`/admin/add-user`}>
            Add user
        </Button>
    ) : (
        <></>
    );

    if (isFetching) {
        return <CardsGridSkeleton />;
    } else {
        return (
            <Stack
                direction={"column"}
                spacing={3}
                alignItems={"flex-start"}
                justifyContent={"center"}
            >
                {addButton}
                <PaddedPaper maxWidth={"800px"}>
                    <Stack
                        spacing={1}
                        direction={"column"}
                        justifyContent={"center"}
                        alignItems={"flex-start"}
                    >
                        {sortByCreatedTime(users).map((user) => (
                            <UserCard
                                key={user.id}
                                displayName={user.displayName}
                                userUUID={user.id}
                                avatarURL={user.profilePictureThumbnailURL}
                            />
                        ))}
                    </Stack>
                </PaddedPaper>
            </Stack>
        );
    }
}
