import React from "react";
import { useTheme } from "@mui/material/styles";
import * as models from "../../../models";
import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import TaskDetailsEstablishment from "../../sharedTaskComponents/TaskDetailsEstablishment";
import RequesterContact from "../../sharedTaskComponents/RequesterContact";
import PrioritySelect from "../../sharedTaskComponents/PrioritySelect";
import { DataStore } from "aws-amplify";
import { displayErrorNotification } from "../../../redux/notifications/NotificationsActions";
import { useDispatch, useSelector } from "react-redux";
import { getWhoami } from "../../../redux/Selectors";

type ScheduledTaskOverviewProps = {
    scheduledTask: models.ScheduledTask;
};

const errorMessage = "Sorry, something went wrong";

const ScheduledTaskOverviewSummary: React.FC<ScheduledTaskOverviewProps> = ({
    scheduledTask,
}) => {
    const whoami = useSelector(getWhoami);
    const isAdmin = whoami?.roles.includes(models.Role.ADMIN);
    const dispatch = useDispatch();
    const handleEstablishmentChange = async (location: models.Location) => {
        try {
            const result = await DataStore.query(
                models.ScheduledTask,
                scheduledTask.id
            );
            if (!result) throw new Error("ScheduledTask doesn't exist");
            await DataStore.save(
                models.ScheduledTask.copyOf(result, (updated) => {
                    updated.establishmentLocation = location;
                })
            );
        } catch (error) {
            console.log(error);
            dispatch(displayErrorNotification(errorMessage));
        }
    };
    const handleRequesterContactChange = async (
        value: models.AddressAndContactDetails
    ) => {
        try {
            const existing = await DataStore.query(
                models.ScheduledTask,
                scheduledTask.id
            );
            if (existing) {
                await DataStore.save(
                    models.ScheduledTask.copyOf(existing, (updated) => {
                        updated.requesterContact = value;
                    })
                );
            }
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(error);
        }
    };
    const handleSelectPriority = async (priority: models.Priority | null) => {
        try {
            const existing = await DataStore.query(
                models.ScheduledTask,
                scheduledTask.id
            );
            if (existing) {
                await DataStore.save(
                    models.ScheduledTask.copyOf(existing, (updated) => {
                        updated.priority = priority;
                    })
                );
            }
        } catch (error) {
            dispatch(displayErrorNotification(errorMessage));
            console.log(error);
        }
    };
    const theme = useTheme();
    return (
        <Paper
            sx={{
                padding: "15px",
                width: "100%",
                maxWidth: 400,
                borderRadius: "1em",
                [theme.breakpoints.down("sm")]: {
                    maxWidth: "100%",
                },
            }}
        >
            <Stack spacing={1} divider={<Divider />}>
                <TaskDetailsEstablishment
                    hideEditIcon={!isAdmin}
                    value={scheduledTask.establishmentLocation}
                    onChange={handleEstablishmentChange}
                />
                <RequesterContact
                    hideEditIcon={!isAdmin}
                    onChange={handleRequesterContactChange}
                    contact={scheduledTask.requesterContact || null}
                />
                <Box>
                    {isAdmin && (
                        <>
                            <Typography>Priority:</Typography>
                            <PrioritySelect
                                onSelect={handleSelectPriority}
                                priority={
                                    scheduledTask.priority as models.Priority
                                }
                            />
                        </>
                    )}
                    {!isAdmin && (
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={1}
                        >
                            <Typography>Priority:</Typography>
                            <Typography>{scheduledTask.priority}</Typography>
                        </Stack>
                    )}
                </Box>
            </Stack>
        </Paper>
    );
};

export default ScheduledTaskOverviewSummary;
