import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import { PaddedPaper } from "../styles/common";
import { sortByCreatedTime } from "../utilities";
import { Button, Stack } from "@mui/material";
import { getWhoami } from "../redux/Selectors";
import { Link } from "react-router-dom";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { userRoles } from "../apiConsts";
import { TextFieldControlled } from "../components/TextFields";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { matchSorter } from "match-sorter";

const useStyles = makeStyles((theme) => {
    return {
        root: {
            [theme.breakpoints.down("md")]: {
                width: "100%",
            },
        },
        searchIcon: {
            [theme.breakpoints.down("md")]: {
                display: "none",
            },
        },
    };
});

export default function UsersList(props) {
    const usersRef = useRef([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const observer = useRef({ unsubscribe: () => {} });
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const classes = useStyles();

    function onChangeFilterText(e) {
        setFilteredUsers(
            matchSorter(usersRef.current, e.target.value, {
                keys: ["name", "displayName", "riderResponsibility"],
            })
        );
    }

    async function getUsers() {
        try {
            observer.current = DataStore.observeQuery(models.User).subscribe(
                (data) => {
                    usersRef.current = data.items;
                    setFilteredUsers(data.items);
                }
            );
        } catch (error) {
            console.log("Request failed", error);
            if (error && error.message)
                dispatch(displayErrorNotification(error.message));
        }
    }

    useEffect(() => getUsers(), []);

    const addButton = whoami.roles.includes(userRoles.admin) ? (
        <Button component={Link} to={`/admin/add-user`}>
            Add user
        </Button>
    ) : (
        <></>
    );

    return (
        <Stack
            direction={"column"}
            spacing={2}
            alignItems={"flex-start"}
            justifyContent={"center"}
        >
            {addButton}
            <TextFieldControlled
                variant={"standard"}
                placeholder={"Filter users"}
                onChange={onChangeFilterText}
                color={"secondary"}
                className={classes.root}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon className={classes.searchIcon} />
                        </InputAdornment>
                    ),
                }}
            />
            <PaddedPaper maxWidth={"800px"}>
                <Stack
                    spacing={1}
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                >
                    {sortByCreatedTime(filteredUsers).map((user) => {
                        return (
                            <UserCard
                                key={user.id}
                                displayName={user.displayName}
                                riderResponsibility={user.riderResponsibility}
                                userUUID={user.id}
                                thumbnailKey={
                                    user.profilePictureThumbnail
                                        ? user.profilePictureThumbnail.key
                                        : null
                                }
                            />
                        );
                    })}
                </Stack>
            </PaddedPaper>
        </Stack>
    );
}
