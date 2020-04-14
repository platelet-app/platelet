import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import UserCard from "../components/UserCard";
import Grid from "@material-ui/core/Grid";
import {TextFieldControlled} from "../components/TextFieldControlled";

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
            }
        })}
}

export default function UsersList(props) {
    const users = useSelector(state => state.users);
    const [filteredUsers, setFilteredUsers] = useState(users);
    useEffect(() => setFilteredUsers(users), [users]);

    return (<Grid container>
            <Grid item>
                <TextFieldControlled onSelect={(e) => setFilteredUsers(filterUsers(users, e.target.value))}/>
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
