import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import { Divider, Grid, Stack } from "@mui/material";
import { userRoles } from "../../../apiConsts";
import UserChip from "../../../components/UserChip";
import { DataStore } from "aws-amplify";
import * as models from "../../../models";
import { convertListDataToObject } from "../../../utilities";
import { useSelector } from "react-redux";
import { dataStoreReadyStatusSelector } from "../../../redux/Selectors";

function TaskAssignees(props) {
    const [responsibilities, setResponsibilities] = useState({});
    const dataStoreReadyStatus = useSelector(dataStoreReadyStatusSelector);

    async function getResponsibilities() {
        if (!dataStoreReadyStatus) {
            return;
        }
        try {
            const resps = await DataStore.query(models.RiderResponsibility);
            setResponsibilities(convertListDataToObject(resps));
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => getResponsibilities(), [dataStoreReadyStatus]);

    return [userRoles.coordinator, userRoles.rider].map((role) => {
        const assignments = Object.values(props.assignees).filter(
            (a) => a.role === role
        );
        const message = assignments.length === 0 ? "No one assigned" : "";
        const label =
            role === userRoles.coordinator ? "Coordinators:" : "Riders:";
        return (
            <>
                <Grid
                    container
                    key={role}
                    direction="row"
                    alignItems="center"
                    spacing={1}
                >
                    <Grid item>
                        <Typography>{label}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>{message}</Typography>
                    </Grid>
                    {assignments.map((assignment) => {
                        const user = assignment.assignee || null;
                        const responsibility =
                            responsibilities[user.userRiderResponsibilityId] ||
                            null;
                        const respLabel = responsibility
                            ? responsibility.label
                            : null;
                        return (
                            <Grid item>
                                <UserChip
                                    responsibility={respLabel}
                                    disabled={props.disabled}
                                    user={user}
                                    key={assignment.id}
                                    onDelete={() =>
                                        props.onRemove(assignment.id)
                                    }
                                />
                            </Grid>
                        );
                    })}
                </Grid>
                <Divider />
            </>
        );
    });
}

TaskAssignees.propTypes = {
    assignees: PropTypes.object,
    onRemove: PropTypes.func,
    disabled: PropTypes.bool,
};

TaskAssignees.defaultProps = {
    assignees: {},
    onRemove: () => {},
    disabled: false,
};

export default TaskAssignees;
