import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import UserCard from "../components/UserCard";
import Grid from "@material-ui/core/Grid";
import {TextFieldControlled} from "../components/TextFieldControlled";
import {setMenuIndex} from "../redux/Actions";
import {AddCircleButton} from "../components/Buttons";
import {addUser} from "../redux/users/UsersActions";
import TaskContextMenu from "../components/ContextMenus/TaskContextMenu";
import UserContextMenu from "../components/ContextMenus/UserContextMenu";

function filterUsers(users, search) {
    if (!search) {
        return users;
    }
    else {
        return users.filter(user => {
            if (user.display_name ? user.display_name.toLowerCase().includes(search.toLowerCase()) : false) {
                return user
            } else if (user.patch ? user.patch.toLowerCase().includes(search.toLowerCase()) : false) {
                return user;
            } else if (user.roles ? user.roles.toLowerCase().includes(search.toLowerCase()) : false) {
                return user;
        }
    })}
}

export default function UsersList(props) {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users);
    const [filteredUsers, setFilteredUsers] = useState(users);
    useEffect(() => setFilteredUsers(users), [users]);
    useEffect(() => {
        dispatch(setMenuIndex(5))
    }, []);

    const circleAdd =
        <AddCircleButton
            onClick={() => {
                dispatch(addUser({}))
            }
            }
        />;
    return (
        <Grid container direction={"column"} spacing={3} alignItems={"flex-start"} justify={"center"}>
            <Grid item>
                {circleAdd}
            </Grid>
            <Grid item>
                <TextFieldControlled
                    label={"Search users"}
                    onChange={(e) => setFilteredUsers(filterUsers(users, e.target.value))}/>
            </Grid>
            <Grid item>
                <Grid container spacing={2}>
                    {filteredUsers.map((user) => (
                        <Grid key={user.uuid} item>
                            <div style={{cursor: 'context-menu', position: "relative"}}>
                                <UserCard key={user.uuid} user={user}/>
                                <div style={{cursor: 'context-menu', position: "absolute", bottom: 0, right: 0, zIndex: 1000}}>
                                <UserContextMenu user={user}/>
                            </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}
