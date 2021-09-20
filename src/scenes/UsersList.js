import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import Grid from "@material-ui/core/Grid";
import * as queries from "../graphql/queries";
import API from "@aws-amplify/api";
import { TextFieldControlled } from "../components/TextFields";
import { AddCircleButton } from "../components/Buttons";
import { addUserRequest } from "../redux/users/UsersActions";
import UserContextMenu from "../components/ContextMenus/UserContextMenu";
import { contextDots, PaddedPaper } from "../styles/common";
import { createPostingSelector } from "../redux/LoadingSelectors";
import { sortByCreatedTime } from "../utilities";
import CardsGridSkeleton from "../SharedLoadingSkeletons/CardsGridSkeleton";
import { Button } from "@material-ui/core";
import { getWhoami } from "../redux/Selectors";
import { Link } from "react-router-dom";
import { DataStore, Hub } from "aws-amplify";
import * as models from "../models/index";

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
    const contextClass = contextDots();
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const whoami = useSelector(getWhoami);
    //useEffect(() => setFilteredUsers(users), [users]);

    const [dataStoreReady, setDataStoreReady] = useState(false);
    // Create listener
    // const listener = Hub.listen("datastore", async (hubData) => {
    //     debugger;
    //     const { event, data } = hubData.payload;
    //     if (event === "ready") {
    //         setDataStoreReady(true);
    //         // do something here once the data is synced from the cloud
    //     }
    // });

    async function getUsers() {
        setIsFetching(true);
        try {
            // const usersData = await API.graphql({
            //     query: queries.listUsers,
            // });
            //const users = usersData.data.listUsers.items;
            const users = await DataStore.query(models.User);
            setIsFetching(false);
            setUsers(users);
            // Remove listener
            //listener();
        } catch (error) {
            throw error;
            setIsFetching(false);
            console.log("Request failed", error);
        }
    }

    useEffect(() => getUsers(), [dataStoreReady]);

    const addButton = whoami.roles.includes("ADMIN") ? (
        <Button component={Link} to={`/admin/adduser`}>
            Add user
        </Button>
    ) : (
        <></>
    );

    if (isFetching) {
        return <CardsGridSkeleton />;
    } else {
        return (
            <Grid
                container
                direction={"column"}
                spacing={3}
                alignItems={"flex-start"}
                justify={"center"}
            >
                <Grid item>{addButton}</Grid>
                <Grid item>
                    <PaddedPaper width={"800px"}>
                        <Grid
                            container
                            spacing={1}
                            direction={"column"}
                            justify={"center"}
                            alignItems={"flex-start"}
                        >
                            <Grid item>
                                <TextFieldControlled
                                    label={"Search users"}
                                    //onChange={(e) => setFilteredUsers(filterUsers(users, e.target.value))}
                                />
                            </Grid>
                            <Grid item>
                                <Grid container spacing={2}>
                                    {sortByCreatedTime(users).map((user) => (
                                        <Grid key={user.id} item>
                                            <div
                                                style={{
                                                    cursor: "context-menu",
                                                    position: "relative",
                                                }}
                                            >
                                                <UserCard
                                                    key={user.id}
                                                    displayName={
                                                        user.displayName
                                                    }
                                                    userUUID={user.id}
                                                    avatarURL={
                                                        user.profilePictureThumbnailURL
                                                    }
                                                />
                                                <div
                                                    className={
                                                        contextClass.root
                                                    }
                                                >
                                                    <UserContextMenu
                                                        user={user}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </PaddedPaper>
                </Grid>
            </Grid>
        );
    }
}
