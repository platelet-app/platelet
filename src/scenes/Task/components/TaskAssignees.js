import React from "react";
import Typography from "@mui/material/Typography";
import UserCard from "../../../components/UserCard";
import Divider from "@mui/material/Divider";
import makeStyles from "@mui/styles/makeStyles";
import PropTypes from "prop-types";
import { Stack } from "@mui/material";

const useStyles = makeStyles({
    root: {
        minWidth: 300,
        padding: 10,
    },
    spacer: {
        height: 15,
    },
});

function TaskAssignees(props) {
    const classes = useStyles();

    const noAssigneeMessage = props.assignees ? (
        props.assignees.length === 0 ? (
            <Typography>No assignees</Typography>
        ) : (
            <></>
        )
    ) : (
        <></>
    );

    return (
        <Stack
            className={classes.root}
            direction={"column"}
            justifyContent={"center"}
            alignItems={"flex-start"}
        >
            {noAssigneeMessage}
            {Object.values(props.assignees).map((assignment) => {
                const user = assignment.assignee || null;
                return (
                    <React.Fragment key={assignment.id}>
                        <UserCard
                            compact
                            onDelete={() => props.onRemove(assignment.id)}
                            userUUID={user.id}
                            displayName={user.displayName}
                            avatarURL={user.profilePictureThumbnailURL}
                        />
                        <Divider />
                        <div className={classes.spacer} />
                    </React.Fragment>
                );
            })}
        </Stack>
    );
}

TaskAssignees.propTypes = {
    assignees: PropTypes.arrayOf(PropTypes.object),
    onRemove: PropTypes.func,
};

TaskAssignees.defaultProps = {
    assignees: [],
    onRemove: () => {},
};

export default TaskAssignees;
