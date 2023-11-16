import React, { useState } from "react";
import { useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import { PaddedPaper } from "../styles/common";
import { sortByCreatedTime } from "../utilities";
import { FormControlLabel, Stack, Switch, TextField } from "@mui/material";
import { getWhoami } from "../redux/Selectors";
import * as models from "../models/index";
import { userRoles } from "../apiConsts";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import AddToListButton from "../components/AddToListButton";
import useListControls from "../hooks/useListControls";

const useStyles = makeStyles()((theme) => {
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

export default function UsersList() {
    const [hideDisabled, setHideDisabled] = useState(true);
    const [searchText, setSearchText] = useState("");
    const whoami = useSelector(getWhoami);
    const { classes } = useStyles();
    const { state } = useListControls<models.User>(
        ["name", "displayName", "riderResponsibility"],
        searchText,
        hideDisabled,
        models.User
    );

    const isAdmin = whoami.roles.includes(userRoles.admin);

    return (
        <Stack
            direction={"column"}
            spacing={2}
            alignItems={"flex-start"}
            justifyContent={"flex-start"}
        >
            <PaddedPaper maxWidth={"800px"}>
                <Stack
                    direction={"column"}
                    spacing={2}
                    alignItems={"flex-start"}
                    justifyContent={"flex-start"}
                >
                    {isAdmin && (
                        <AddToListButton
                            link="/admin/add-user"
                            label="Add new user"
                        />
                    )}
                    <Stack
                        direction={"row"}
                        spacing={2}
                        alignItems={"center"}
                        justifyContent={"flex-start"}
                    >
                        <TextField
                            placeholder={"Filter users..."}
                            value={searchText}
                            onChange={(e) => {
                                const { value } = e.target;
                                setSearchText(value);
                            }}
                            color={"primary"}
                            className={classes.root}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            className={classes.searchIcon}
                                        />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={!hideDisabled}
                                    onChange={(e) =>
                                        setHideDisabled(!e.target.checked)
                                    }
                                />
                            }
                            label="Show disabled"
                        />
                    </Stack>
                </Stack>
            </PaddedPaper>
            <PaddedPaper maxWidth={"800px"}>
                <Stack
                    spacing={1}
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"flex-start"}
                >
                    {sortByCreatedTime(state).map((user: models.User) => {
                        return (
                            <UserCard
                                key={user.id}
                                user={user}
                                thumbnailKey={
                                    user.profilePicture
                                        ? user.profilePicture.key
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
