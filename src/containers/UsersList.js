import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import UserCard from "../components/UserCard";
import Grid from "@material-ui/core/Grid";
import {TextFieldControlled} from "../components/TextFieldControlled";
import {setMenuIndex} from "../redux/Actions";

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

    return (<Grid container>
            <Grid item>
                <TextFieldControlled onChange={(e) => setFilteredUsers(filterUsers(users, e.target.value))}/>
            </Grid>
            <Grid item>
                <Grid container spacing={1}>
                    {filteredUsers.map((user) => (
                        <Grid key={user.uuid} item>
                            <UserCard key={user.uuid} user={user}/>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    )
}
