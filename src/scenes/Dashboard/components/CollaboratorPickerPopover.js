import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import Grid from "@material-ui/core/Grid";
import UserCard from "../../../components/UserCard";
import UsersSelect from "../../../components/UsersSelect";
import {useDispatch} from "react-redux";
import {addSessionCollaborator} from "../../../redux/sessions/SessionsActions";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(2),
    },
    collaboratorButton: {
        color: "white",
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
    iconButton: {
        width: theme.spacing(4),
        height: theme.spacing(4)
    },
}));

export default function CollaboratorPickerPopover(props) {
    const classes = useStyles();
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
            dispatch(addSessionCollaborator({sessionUUID: props.sessionUUID, payload}))
            handleClose();
        }
    }

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;
    const userSelectExclude = props.coordinatorUUID ? [...props.collaborators.map(u => u.uuid), props.coordinatorUUID] : props.collaborators.map(u => u.uuid)

    return (
        <div>
            <Tooltip title={"View/Add a collaborator"}>
                <IconButton className={classes.iconButton}
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={handleClick}
                            disabled={props.disabled}
                >
                    <AddCircleOutline className={classes.collaboratorButton}/>
                </IconButton>
            </Tooltip>
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
                <Grid container spacing={1} direction={"column"} alignItems={"center"} justify={"flex-start"}>
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