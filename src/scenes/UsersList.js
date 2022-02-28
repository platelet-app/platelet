import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import UserCard from "../components/UserCard";
import { contextDots, PaddedPaper } from "../styles/common";
import { sortByCreatedTime } from "../utilities";
import { Button, Stack } from "@mui/material";
import { dataStoreReadyStatusSelector, getWhoami } from "../redux/Selectors";
import { Link } from "react-router-dom";
import { DataStore } from "aws-amplify";
import * as models from "../models/index";
import { displayErrorNotification } from "../redux/notifications/NotificationsActions";
import { userRoles } from "../apiConsts";
import Skeleton from '@mui/material/Skeleton';
import { TextFieldControlled } from "../components/TextFields";
import SearchIcon from "@mui/icons-material/Search";
import { InputAdornment } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { matchSorter } from "match-sorter";


const useStyles = makeStyles((theme) => {
    return {
        root: {
            [theme.breakpoints.down("md")]: {
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                    borderColor: "white",
                },
                "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline":
                    {
                        borderColor: "white",
                    },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
                    {
                        borderColor: "white",
                    },
                "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input":
                    {
                        color: "white",
                    },
                "& .MuiInputLabel-outlined.Mui-focused": {
                    color: "white",
                },
                width: "100%",
            },
        },
        searchIcon: {
            [theme.breakpoints.down("md")]: {
                color: "white",
                display: "none",
            },
        },
    };
});


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
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(false);
    const whoami = useSelector(getWhoami);
    const dispatch = useDispatch();
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);
    //useEffect(() => setFilteredUsers(users), [users]);
    //const fetchTimer = useRef();
    //const fetchingTimer = setTimeout(() => setIsFetching(true), 1000);
    const classes = useStyles();


    function onChangeFilterText(e) {
        setFilteredUsers(matchSorter(users, e.target.value,{
          keys: ['name', 'displayName', 'riderResponsibility.label']
        }))
    }

    async function getUsers() {
        if (!dataStoreReadyStatus) {
            setIsFetching(true);
        } else {
            try {
                const users = await DataStore.query(models.User);
                setIsFetching(false);
                setUsers(users);
                setFilteredUsers(users);
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
        return (
           <Stack
                direction={"column"}
                spacing={3}
                alignItems={"flex-start"}
                justifyContent={"center"}
            >
                <PaddedPaper maxWidth={"800px"}>
                    <Stack
                        spacing={1}
                        direction={"column"}
                    > 
                      { Array(5).fill(1).map( ele => { 
                        return(
                            <Stack
                              spacing={2}
                              direction={"row"}
                              justifyContent={"flex-start"}
                              alignItems={"center"}
                            >
                                <Skeleton variant="circular" width={40} height={40} />
                                <Skeleton variant="text" width={500} height={50}/>
                            </Stack>
                          )
                        })
                      }
                    </Stack>
                </PaddedPaper>
            </Stack>
        )
    } else {
      return (
          <Stack
              direction={"column"}
              spacing={3}
              alignItems={"flex-start"}
              justifyContent={"center"}
          >
          {addButton}
          <TextFieldControlled
              id="tasks-filter-input"
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
                      {sortByCreatedTime(filteredUsers).map((user) => (
                          <UserCard
                              key={user.id}
                              displayName={user.displayName}
                              riderResponsibility = {user.riderResponsibility.label && user.riderResponsibility.label}
                              userUUID={user.id}
                              thumbnailKey={
                                  user.profilePictureThumbnail
                                      ? user.profilePictureThumbnail.key
                                      : null
                              }
                          />
                      ))}
                  </Stack>
              </PaddedPaper>
          </Stack>
        );
    }
}
