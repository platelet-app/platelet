import React from "react";
import { useParams } from "react-router";
import { decodeUUID } from "../../../utilities";
import ScheduledTaskOverview from "./ScheduledTaskOverview";

const ScheduledTaskOverviewRoute = () => {
    let { scheduled_task_uuid_b62 } = useParams() as {
        scheduled_task_uuid_b62: string;
    };
    const scheduledTaskId = decodeUUID(scheduled_task_uuid_b62);
    return <ScheduledTaskOverview scheduledTaskId={scheduledTaskId} />;
};

export default ScheduledTaskOverviewRoute;
