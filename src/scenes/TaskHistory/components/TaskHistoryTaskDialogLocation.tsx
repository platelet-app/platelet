import { Divider, Paper, Stack, Tooltip, Typography } from "@mui/material";
import React from "react";
import { Location } from "../../../API";
import { ThemedLink } from "../../../styles/common";
import { encodeUUID } from "../../../utilities";
import TaskHistoryLabelItemPair from "./TaskHistoryLabelItemPair";

type TaskHistoryTaskDialogLocationProps = {
    location: Location | null;
    title: string;
};

const fields = {
    ward: "Ward",
    line1: "Line one",
    line2: "Line two",
    line3: "Line three",
    town: "Town",
    county: "County",
    country: "Country",
    postcode: "Postcode",
};

const contactFields = {
    name: "Name",
    telephoneNumber: "Telephone",
};

const TaskHistoryTaskDialogLocation: React.FC<
    TaskHistoryTaskDialogLocationProps
> = ({ location, title }) => {
    const presetName = location && location.name ? location.name : "";
    const locationLink =
        location && location.id ? `/location/${encodeUUID(location.id)}` : "";

    let locationTitle = <></>;
    if (location && !!location.listed) {
        locationTitle = (
            <ThemedLink to={locationLink}>
                <Typography
                    noWrap
                    sx={{
                        width: "90%",
                    }}
                >
                    {presetName}
                </Typography>
            </ThemedLink>
        );
    } else if (location && !!!location.listed) {
        locationTitle = (
            <Typography
                noWrap
                sx={{
                    width: "90%",
                }}
            >
                {presetName}
            </Typography>
        );
    }

    if (presetName.length > 35) {
        locationTitle = <Tooltip title={presetName}>{locationTitle}</Tooltip>;
    }

    let contactContent: React.ReactNode[] = [];
    if (location && location.contact) {
        contactContent = Object.entries(contactFields).map(([key, value]) => {
            const data = location?.contact?.[key as keyof typeof contactFields];
            console.log(data);
            if (data) {
                return (
                    <TaskHistoryLabelItemPair key={key} label={value}>
                        <Typography>{data}</Typography>
                    </TaskHistoryLabelItemPair>
                );
            }
            return <></>;
        });
    }

    let locationContent: React.ReactNode[] = [];
    if (location) {
        locationContent = Object.keys(fields).map((key) => {
            if (!location?.[key as keyof typeof fields]) {
                return <></>;
            }
            return (
                <Typography>
                    {location?.[key as keyof typeof fields]}
                </Typography>
            );
        });
    }

    return (
        <Paper
            sx={{
                borderRadius: "1em",
                padding: 1,
            }}
        >
            <Stack spacing={1}>
                <Typography variant="h5">{title}</Typography>
                <Divider />
                {locationTitle}
                <Stack>
                    {locationContent.map((item) => item)}
                    {contactContent.map((item) => item)}
                </Stack>
            </Stack>
        </Paper>
    );
};

export default TaskHistoryTaskDialogLocation;
