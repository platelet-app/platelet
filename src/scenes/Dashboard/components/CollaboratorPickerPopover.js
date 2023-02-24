import React from 'react';
import { makeStyles } from 'tss-react/mui';
import Popover from '@mui/material/Popover';
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import AddCircleOutline from "@mui/icons-material/AddCircleOutline";
import Grid from "@mui/material/Grid";
import UserCard from "../../../components/UserCard";
import UsersSelect from "../../../components/UsersSelect";
import {useDispatch} from "react-redux";
import {SmallCirclePlusButton} from "../../../components/Buttons";

const useStyles = makeStyles()((theme) => ({
    root: {
        padding: theme.spacing(2),
    }
}));

export default function CollaboratorPickerPopover(props) {
    const { classes } = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const dispatch = useDispatch();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelectUser = (user) => {
        if (user) {
            const payload = {user_uuid: user.uuid, user}
            handleClose();
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const userSelectExclude = props.coordinatorUUID ? [...props.collaborators.map(u => u.uuid), props.coordinatorUUID] : props.collaborators.map(u => u.uuid)

    return (
        <div>
            <SmallCirclePlusButton tooltip={"Video/Add a collaborator"} colour={"white"} onClick={handleClick} disabled={props.disabled}/>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <div className={classes.root}>
                <Grid container spacing={1} direction={"column"} alignItems={"center"} justifyContent={"flex-start"}>
                    <Grid item>
                        <UsersSelect roles={["coordinator"]} onSelect={handleSelectUser} excludeList={userSelectExclude}/>
                    </Grid>
                    {props.collaborators.map((user) => (
                        <Grid key={user.uuid} item>
                            <UserCard key={user.uuid} user={user}/>
                        </Grid>
                    ))
                    }
                </Grid>
                </div>


            </Popover>
        </div>
    );
}
