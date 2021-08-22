import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import Grid from "@material-ui/core/Grid";
import { TextFieldControlled } from "../components/TextFields";
import { AddCircleButton } from "../components/Buttons";
import { addUserRequest } from "../redux/users/UsersActions";
import UserContextMenu from "../components/ContextMenus/UserContextMenu";
import { contextDots, PaddedPaper } from "../styles/common";
import { createPostingSelector } from "../redux/LoadingSelectors";
import { sortByCreatedTime } from "../utilities";

function filterUsers(users, search) {
    if (!search) {
        return users;
    } else {
        return users.filter((user) => {
            if (
                user.display_name
                    ? user.display_name
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

const initialSnack = { snack: () => {} };

export default function UsersList(props) {
    const contextClass = contextDots();
    const dispatch = useDispatch();
    const users = useSelector((state) => state.users.users);
    const postingSelector = createPostingSelector(["ADD_USER"]);
    const deletingSelector = createPostingSelector(["DELETE_USER"]);
    const isPosting = useSelector((state) => postingSelector(state));
    const isDeleting = useSelector((state) => deletingSelector(state));
    //useEffect(() => setFilteredUsers(users), [users]);
    const [snack, setSnack] = React.useState(initialSnack);

    function dispatchSnack() {
        if (!isDeleting) {
            snack.snack();
            setSnack(initialSnack);
        }
    }
    useEffect(dispatchSnack, [isDeleting]);

    const circleAdd = (
        <AddCircleButton
            onClick={() => {
                dispatch(addUserRequest({}));
            }}
        />
    );
    return (
        <Grid
            container
            direction={"column"}
            spacing={3}
            alignItems={"flex-start"}
            justify={"center"}
        >
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
                                {sortByCreatedTime(Object.values(users)).map(
                                    (user) => (
                                        <Grid key={user.uuid} item>
                                            <div
                                                style={{
                                                    cursor: "context-menu",
                                                    position: "relative",
                                                }}
                                            >
                                                <UserCard
                                                    key={user.uuid}
                                                    displayName={
                                                        user.display_name
                                                    }
                                                    userUUID={user.uuid}
                                                    avatarURL={
                                                        user.profile_picture_thumbnail_url
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
                                    )
                                )}
                            </Grid>
                        </Grid>
                    </Grid>
                </PaddedPaper>
            </Grid>
        </Grid>
    );
}
